#!/usr/bin/env python3
"""
Extract conversations tagged with CC (product+shade) tags from Richpanel.
These are from the 2024-2026 Richpanel-native era and contain structured
product/shade labels applied by CX agents.

Phase 1: Scan all tickets to discover CC-tagged conversation IDs
Phase 2: Fetch full conversation details for each discovered ID

Usage:
    python3 extract-cc-conversations.py [--resume] [--phase2-only]

Output:
    cc-conversation-ids.json     — discovered CC-tagged conversation IDs + their tags
    cc-training-data.jsonl       — one JSON record per conversation (full details)
    cc-extraction-progress.json  — tracks progress across both phases
"""

import json
import os
import re
import sys
import time
import argparse
import requests
from html import unescape
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
TAG_MAPPING_FILE = SCRIPT_DIR / "cc-tag-mapping.json"
OUTPUT_FILE = SCRIPT_DIR / "cc-training-data.jsonl"
PROGRESS_FILE = SCRIPT_DIR / "cc-extraction-progress.json"
DISCOVERY_FILE = SCRIPT_DIR / "cc-conversation-ids.json"

API_BASE = "https://api.richpanel.com/v1"
API_KEY = os.environ.get("RICHPANEL_API_KEY", "")
HEADERS = {"x-richpanel-key": API_KEY, "Content-Type": "application/json"}

DELAY_BETWEEN_REQUESTS = 0.15  # seconds
MAX_RETRIES = 3
BACKOFF_BASE = 5


def load_cc_tags():
    """Load all CC tag UUIDs and names."""
    with open(TAG_MAPPING_FILE) as f:
        return json.load(f)


def parse_cc_tag_to_product_shade(tag_name):
    """Parse a CC tag name into product and shade components."""
    name = tag_name.replace('cc-', '', 1)

    m = re.match(r'face-pencil-shade-(\d+)', name)
    if m:
        return {"product": "Face Pencil", "shade": f"Shade {m.group(1)}"}

    if name.startswith('mini-wtf-'):
        shade = name.replace('mini-wtf-', '').replace('-', ' ').title()
        return {"product": "Mini What The Foundation", "shade": shade}

    if name.startswith('wtf-'):
        shade = name.replace('wtf-', '').replace('-', ' ').title()
        return {"product": "What The Foundation", "shade": shade}

    if name.startswith('jetm-'):
        shade = name.replace('jetm-', '').replace('-', ' ').title()
        return {"product": "Just A Tint", "shade": shade}

    if name.startswith('mb-palette-'):
        shade = name.replace('mb-palette-', '').replace('-', ' ').title()
        return {"product": "Miracle Balm Palette", "shade": shade}

    if name.startswith('mini-mb-'):
        shade = name.replace('mini-mb-', '').replace('-', ' ').title()
        return {"product": "Mini Miracle Balm", "shade": shade}

    if name.startswith('mb-'):
        shade = name.replace('mb-', '').replace('-', ' ').title()
        return {"product": "Miracle Balm", "shade": shade}

    if name.startswith('gel-bronzer-'):
        shade = name.replace('gel-bronzer-', '').replace('-', ' ').title()
        return {"product": "Gel Bronzer", "shade": shade}

    if name.startswith('bronzer-'):
        shade = name.replace('bronzer-', '').replace('-', ' ').title()
        return {"product": "The Bronzer", "shade": shade}

    return {"product": name.replace('-', ' ').title(), "shade": "unknown"}


def load_progress():
    """Load progress state."""
    if PROGRESS_FILE.exists():
        with open(PROGRESS_FILE) as f:
            return json.load(f)
    return {"phase": "discovery", "pages_scanned": 0, "conv_to_tags": {}, "processed_ids": []}


def save_progress(progress):
    """Save progress to disk."""
    progress["last_updated"] = time.strftime("%Y-%m-%dT%H:%M:%S")
    with open(PROGRESS_FILE, "w") as f:
        json.dump(progress, f)


def api_get(url, params=None):
    """Make a GET request with retry logic."""
    for attempt in range(MAX_RETRIES):
        try:
            resp = requests.get(url, headers=HEADERS, params=params, timeout=30)
            if resp.status_code == 200:
                return resp.json()
            elif resp.status_code == 429:
                wait = BACKOFF_BASE * (attempt + 1)
                print(f"    Rate limited, waiting {wait}s...")
                time.sleep(wait)
                continue
            elif resp.status_code == 404:
                return None
            else:
                print(f"    HTTP {resp.status_code}")
                if attempt < MAX_RETRIES - 1:
                    time.sleep(BACKOFF_BASE)
                    continue
                return None
        except Exception as e:
            print(f"    Error: {e}")
            if attempt < MAX_RETRIES - 1:
                time.sleep(BACKOFF_BASE)
                continue
            return None
    return None


def strip_html(html_text):
    """Strip HTML tags and decode entities."""
    if not html_text:
        return ""
    text = re.sub(r'<style[^>]*>.*?</style>', '', html_text, flags=re.DOTALL)
    text = re.sub(r'<script[^>]*>.*?</script>', '', html_text, flags=re.DOTALL)
    text = re.sub(r'<br\s*/?>', '\n', text)
    text = re.sub(r'</p>', '\n', text)
    text = re.sub(r'</div>', '\n', text)
    text = re.sub(r'<[^>]+>', '', text)
    text = unescape(text)
    lines = [re.sub(r'[ \t]+', ' ', line).strip() for line in text.split('\n')]
    return '\n'.join(line for line in lines if line).strip()


def process_conversation(raw_data, cc_tags_on_conv):
    """Process a raw API response into a structured training record."""
    ticket = raw_data.get("ticket", {})
    if not ticket:
        return None

    comments = ticket.get("comments", [])
    if not comments:
        return None

    cc_ground_truth = []
    for tag_id, tag_name in cc_tags_on_conv.items():
        parsed = parse_cc_tag_to_product_shade(tag_name)
        parsed["tag_id"] = tag_id
        parsed["tag_name"] = tag_name
        cc_ground_truth.append(parsed)

    record = {
        "id": ticket.get("id"),
        "subject": ticket.get("subject"),
        "created_at": ticket.get("created_at"),
        "closed_at": ticket.get("closed_at"),
        "channel": ticket.get("via", {}).get("channel"),
        "customer": ticket.get("customer_profile", {}),
        "tags": ticket.get("tags", []),
        "cc_ground_truth": cc_ground_truth,
        "messages": [],
    }

    for comment in comments:
        is_operator = comment.get("is_operator", False)
        author = comment.get("author_id", "")
        body = comment.get("plain_body") or comment.get("body") or ""

        if body and "<" in body and ">" in body:
            body = strip_html(body)

        msg = {
            "role": "agent" if is_operator or "operator" in author else "customer",
            "timestamp": comment.get("created_at"),
            "text": body[:5000],
        }
        record["messages"].append(msg)

    return record


def phase1_discover(cc_tag_uuids, progress):
    """Scan all tickets to find CC-tagged conversations."""
    print("\n── PHASE 1: SCANNING ALL TICKETS FOR CC TAGS ──")

    conv_to_tags = progress.get("conv_to_tags", {})
    start_page = progress.get("pages_scanned", 0) + 1
    page = start_page
    total_scanned = (start_page - 1) * 100
    empty_pages = 0

    print(f"  Starting from page {start_page}")
    print(f"  Already found: {len(conv_to_tags)} CC-tagged conversations")
    print(f"  Target: ~7,408 based on analytics\n")

    while True:
        data = api_get(f"{API_BASE}/tickets", params={"per_page": 100, "page": page})

        if data is None:
            print(f"  Page {page}: API error, retrying after delay...")
            time.sleep(5)
            continue

        tickets = data.get("ticket", [])
        if not tickets:
            empty_pages += 1
            if empty_pages >= 3:
                print(f"  {empty_pages} consecutive empty pages — done scanning")
                break
            page += 1
            time.sleep(DELAY_BETWEEN_REQUESTS)
            continue

        empty_pages = 0
        total_scanned += len(tickets)

        batch_found = 0
        for t in tickets:
            raw_tags = t.get("tags") or []
            tag_set = set(raw_tags)
            overlap = tag_set & cc_tag_uuids
            if overlap:
                conv_id = t.get("id")
                if conv_id:
                    conv_to_tags[conv_id] = {uid: cc_tags_full[uid] for uid in overlap}
                    batch_found += 1

        if page % 50 == 0 or batch_found > 0:
            print(f"  Page {page}: scanned {total_scanned:,} tickets, "
                  f"found {len(conv_to_tags)} CC-tagged (+{batch_found} this page)")

        # Save progress every 100 pages
        if page % 100 == 0:
            progress["pages_scanned"] = page
            progress["conv_to_tags"] = conv_to_tags
            save_progress(progress)

        # Check if there's a next page
        next_page = data.get("next_page")
        if not next_page:
            print(f"  No next_page — done scanning at page {page}")
            break

        page += 1
        time.sleep(DELAY_BETWEEN_REQUESTS)

    # Final save
    progress["pages_scanned"] = page
    progress["conv_to_tags"] = conv_to_tags
    progress["phase"] = "extraction"
    save_progress(progress)

    # Save discovery results
    with open(DISCOVERY_FILE, "w") as f:
        json.dump({
            "total_conversations": len(conv_to_tags),
            "total_pages_scanned": page,
            "total_tickets_scanned": total_scanned,
            "conversations": conv_to_tags
        }, f, indent=2)

    print(f"\n  Discovery complete:")
    print(f"    Pages scanned: {page}")
    print(f"    Tickets scanned: {total_scanned:,}")
    print(f"    CC-tagged found: {len(conv_to_tags)}")

    return conv_to_tags


def phase2_extract(conv_to_tags, progress):
    """Fetch full conversation details for discovered CC-tagged tickets."""
    print("\n── PHASE 2: EXTRACTING FULL CONVERSATIONS ──")

    processed_ids = set(progress.get("processed_ids", []))
    ids_to_process = [cid for cid in conv_to_tags if cid not in processed_ids]

    print(f"  To process: {len(ids_to_process)} (already done: {len(processed_ids)})")

    stats = {"processed": 0, "success": 0, "errors": 0}
    mode = "a" if processed_ids and OUTPUT_FILE.exists() else "w"

    with open(OUTPUT_FILE, mode) as out_f:
        for i, conv_id in enumerate(ids_to_process):
            raw = api_get(f"{API_BASE}/tickets/{conv_id}")
            stats["processed"] += 1

            if raw is None:
                stats["errors"] += 1
                processed_ids.add(conv_id)
                time.sleep(DELAY_BETWEEN_REQUESTS)
                continue

            tags_on_conv = conv_to_tags.get(conv_id, {})
            record = process_conversation(raw, tags_on_conv)

            if record:
                stats["success"] += 1
                out_f.write(json.dumps(record) + "\n")

            processed_ids.add(conv_id)

            if (i + 1) % 50 == 0:
                progress["processed_ids"] = list(processed_ids)
                save_progress(progress)
                out_f.flush()
                pct = (i + 1) / len(ids_to_process) * 100
                print(f"  [{i+1}/{len(ids_to_process)}] ({pct:.1f}%) — "
                      f"{stats['success']} ok, {stats['errors']} errors")

            time.sleep(DELAY_BETWEEN_REQUESTS)

    progress["processed_ids"] = list(processed_ids)
    progress["phase"] = "complete"
    save_progress(progress)

    print(f"\n{'='*60}")
    print(f"DONE — {stats['processed']} processed")
    print(f"  Success: {stats['success']}")
    print(f"  Errors:  {stats['errors']}")
    print(f"  Output:  {OUTPUT_FILE}")

    # Tag distribution summary
    print(f"\n── CC TAG DISTRIBUTION ──")
    tag_counts = {}
    for cid, tags in conv_to_tags.items():
        for tid, tname in tags.items():
            tag_counts[tname] = tag_counts.get(tname, 0) + 1

    for tname, count in sorted(tag_counts.items(), key=lambda x: -x[1])[:30]:
        print(f"  {tname}: {count}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Extract CC-tagged conversations from Richpanel")
    parser.add_argument("--resume", action="store_true", help="Resume from last progress")
    parser.add_argument("--phase2-only", action="store_true", help="Skip discovery, use existing cc-conversation-ids.json")
    args = parser.parse_args()

    if not API_KEY:
        print("ERROR: RICHPANEL_API_KEY not set. Run: source ~/.zshrc")
        sys.exit(1)

    cc_tags_full = load_cc_tags()
    cc_tag_uuids = set(cc_tags_full.keys())
    print(f"Loaded {len(cc_tags_full)} CC tag definitions")

    progress = load_progress() if args.resume else {
        "phase": "discovery", "pages_scanned": 0, "conv_to_tags": {}, "processed_ids": []
    }

    if args.phase2_only:
        if DISCOVERY_FILE.exists():
            with open(DISCOVERY_FILE) as f:
                discovery = json.load(f)
            conv_to_tags = discovery["conversations"]
            print(f"Loaded {len(conv_to_tags)} discovered conversations from {DISCOVERY_FILE}")
            progress["phase"] = "extraction"
            progress["conv_to_tags"] = conv_to_tags
        else:
            print(f"ERROR: {DISCOVERY_FILE} not found. Run phase 1 first.")
            sys.exit(1)
    else:
        if progress["phase"] == "discovery":
            conv_to_tags = phase1_discover(cc_tag_uuids, progress)
        else:
            conv_to_tags = progress.get("conv_to_tags", {})

    if progress["phase"] == "extraction":
        phase2_extract(conv_to_tags, progress)
