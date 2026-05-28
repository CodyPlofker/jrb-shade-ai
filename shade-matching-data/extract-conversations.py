#!/usr/bin/env python3
"""
Extract full conversation bodies from Richpanel shade-match tagged tickets.
Parses form submissions, agent recommendations, and follow-up feedback.

Usage:
    python3 extract-conversations.py [--limit N] [--resume]

Output:
    shade-training-data.jsonl  — one JSON record per conversation
    extraction-progress.json   — tracks which IDs have been processed
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
CONVERSATIONS_FILE = SCRIPT_DIR / "richpanel-shade-conversations.json"
OUTPUT_FILE = SCRIPT_DIR / "shade-training-data.jsonl"
PROGRESS_FILE = SCRIPT_DIR / "extraction-progress.json"

API_BASE = "https://api.richpanel.com/v1"
API_KEY = os.environ.get("RICHPANEL_API_KEY", "")
HEADERS = {"x-richpanel-key": API_KEY, "Content-Type": "application/json"}

DELAY_BETWEEN_REQUESTS = 0.2  # seconds
BATCH_SIZE = 50  # save progress every N conversations
MAX_RETRIES = 3
BACKOFF_BASE = 5  # seconds


def load_shade_match_ids():
    """Load conversation IDs that have shade-match tag."""
    with open(CONVERSATIONS_FILE) as f:
        data = json.load(f)

    ids = []
    for conv in data["conversations"]:
        if conv.get("has_shade_match"):
            ids.append(conv["id"])

    print(f"Loaded {len(ids)} shade-match conversation IDs (out of {len(data['conversations'])} total)")
    return ids


def load_progress():
    """Load set of already-processed conversation IDs."""
    if PROGRESS_FILE.exists():
        with open(PROGRESS_FILE) as f:
            data = json.load(f)
        return set(data.get("processed_ids", []))
    return set()


def save_progress(processed_ids):
    """Save progress to disk."""
    with open(PROGRESS_FILE, "w") as f:
        json.dump({
            "processed_ids": list(processed_ids),
            "count": len(processed_ids),
            "last_updated": time.strftime("%Y-%m-%dT%H:%M:%S")
        }, f)


def strip_html(html_text):
    """Strip HTML tags and decode entities, return clean text."""
    if not html_text:
        return ""
    text = re.sub(r'<style[^>]*>.*?</style>', '', html_text, flags=re.DOTALL)
    text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.DOTALL)
    text = re.sub(r'<br\s*/?>', '\n', text)
    text = re.sub(r'</p>', '\n', text)
    text = re.sub(r'</div>', '\n', text)
    text = re.sub(r'<[^>]+>', '', text)
    text = unescape(text)
    # Collapse whitespace but preserve newlines
    lines = [re.sub(r'[ \t]+', ' ', line).strip() for line in text.split('\n')]
    text = '\n'.join(line for line in lines if line)
    return text.strip()


def parse_form_submission(body_text):
    """Extract structured form fields from a shade consultation form submission."""
    form_data = {}

    # Name
    m = re.search(r'Name:\s*\n\s*(.+)', body_text)
    if m:
        form_data["customer_name"] = m.group(1).strip()

    # Email
    m = re.search(r'Email:\s*\n\s*(\S+@\S+)', body_text)
    if m:
        form_data["customer_email"] = m.group(1).strip()

    # Current foundation
    m = re.search(r'(?:foundation brand|current foundation)[^:]*:\s*\n\s*(.+)', body_text, re.IGNORECASE)
    if m:
        form_data["current_foundation"] = m.group(1).strip()

    # Products requested
    m = re.search(r'(?:products you would like|products you\'d like)[^:]*:\s*\n\s*(.+)', body_text, re.IGNORECASE)
    if m:
        form_data["products_requested"] = m.group(1).strip()

    # Skin type / skin tone (some forms have this)
    m = re.search(r'(?:skin type|skin tone)[^:]*:\s*\n\s*(.+)', body_text, re.IGNORECASE)
    if m:
        form_data["skin_info"] = m.group(1).strip()

    # Age
    m = re.search(r'(?:age|age range)[^:]*:\s*\n\s*(.+)', body_text, re.IGNORECASE)
    if m:
        form_data["age"] = m.group(1).strip()

    # Photo URLs (HulkApps S3 or other)
    photos = re.findall(r'(https://form-builder-by-hulkapps\.s3\.amazonaws\.com/[^\s"<>]+)', body_text)
    if not photos:
        photos = re.findall(r'(https://[^\s"<>]*(?:\.jpeg|\.jpg|\.png|\.heic)[^\s"<>]*)', body_text, re.IGNORECASE)
    if photos:
        form_data["photo_urls"] = photos

    return form_data if form_data else None


def extract_shade_recommendations(text):
    """Extract specific shade numbers and product recommendations from agent text."""
    recs = {}

    # Face Pencil shades
    fp_shades = re.findall(r'(?:Face Pencil|face pencil)\s*(?:shade|Shade)?\s*[:#]?\s*(\d{1,2})', text, re.IGNORECASE)
    if not fp_shades:
        fp_shades = re.findall(r'Shade\s+(\d{1,2})\b', text)
    if fp_shades:
        recs["face_pencil_shades"] = list(set(fp_shades))

    # Known shade names for validation
    BALM_SHADES = {"dusty rose", "magic hour", "flushed", "peachy", "bronze", "golden hour",
                   "cool rose", "au naturel", "coral", "tawny", "mocha"}
    WTF_SHADES = {"porcelain", "fair", "light", "light medium", "medium", "medium tan",
                  "tan", "rich", "deep", "beige", "ivory", "sand", "honey", "caramel",
                  "chestnut", "espresso", "mahogany", "cocoa", "truffle", "ebony"}

    # Miracle Balm shade
    mb = re.search(r'Miracle Balm\s+(?:in\s+)?(?:shade\s+)?([A-Za-z][A-Za-z\s]+?)(?:\.|,|\s+This|\s+It|\s+Can|\s+is|\s+or\b|\s+and\b|\s+for\b)', text, re.IGNORECASE)
    if mb:
        shade = mb.group(1).strip()
        if shade.lower() in BALM_SHADES or len(shade.split()) <= 3:
            if not shade.lower().startswith(("or ", "and ", "in ")):
                recs["miracle_balm_shade"] = shade

    # WTF shade
    wtf = re.search(r'(?:What The Foundation|WTF)\s+(?:in\s+)?(?:shade\s+)?([A-Za-z][A-Za-z\s]+?)(?:\.|,|\s+This|\s+It|\s+is|\s+or\b|\s+and\b)', text, re.IGNORECASE)
    if wtf:
        shade = wtf.group(1).strip()
        if not shade.lower().startswith(("or ", "and ", "in ")):
            recs["wtf_shade"] = shade

    # Cool Gloss shade
    cg = re.search(r'Cool Gloss\s+(?:in\s+)?(?:shade\s+)?([A-Za-z][A-Za-z\s]+?)(?:\.|,|\s+This|\s+It|\s+or\b|\s+and\b)', text, re.IGNORECASE)
    if cg:
        recs["cool_gloss_shade"] = cg.group(1).strip()

    # Undertone mentions
    ut = re.search(r'(?:your skin|you have|your undertone|undertone)\s+(?:is\s+|has\s+)?(?:a\s+)?(warm|cool|neutral|olive|yellow|pink)', text, re.IGNORECASE)
    if ut:
        recs["detected_undertone"] = ut.group(1).lower()

    return recs if recs else None


def extract_feedback_signals(text):
    """Extract customer feedback about shade fit from follow-up messages."""
    signals = []

    patterns = [
        (r'too\s+(dark|light|pink|orange|warm|cool|yellow|red)', "shade_complaint"),
        (r'(perfect|great|exact)\s+match', "positive_match"),
        (r'(love|loving|loved)\s+(?:the\s+)?(?:shade|color|colour)', "positive_match"),
        (r'(wrong|incorrect|bad)\s+(?:shade|color|colour|match)', "negative_match"),
        (r'(?:doesn\'t|does not|didn\'t|did not)\s+match', "negative_match"),
        (r'exchange|return|swap', "exchange_signal"),
    ]

    for pattern, signal_type in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            signals.append({"type": signal_type, "detail": matches[0] if isinstance(matches[0], str) else matches[0]})

    return signals if signals else None


def fetch_conversation(conv_id):
    """Fetch a single conversation from Richpanel API."""
    url = f"{API_BASE}/tickets/{conv_id}"

    for attempt in range(MAX_RETRIES):
        try:
            resp = requests.get(url, headers=HEADERS, timeout=30)

            if resp.status_code == 200:
                return resp.json()
            elif resp.status_code == 429:
                wait = BACKOFF_BASE * (attempt + 1)
                print(f"  Rate limited, waiting {wait}s...")
                time.sleep(wait)
                continue
            elif resp.status_code == 404:
                return None
            else:
                print(f"  HTTP {resp.status_code} for {conv_id}")
                if attempt < MAX_RETRIES - 1:
                    time.sleep(BACKOFF_BASE)
                    continue
                return None
        except requests.exceptions.Timeout:
            print(f"  Timeout for {conv_id}, attempt {attempt + 1}")
            if attempt < MAX_RETRIES - 1:
                time.sleep(BACKOFF_BASE)
                continue
            return None
        except Exception as e:
            print(f"  Error for {conv_id}: {e}")
            return None

    return None


def process_conversation(raw_data):
    """Process a raw API response into a structured training record."""
    ticket = raw_data.get("ticket", {})
    if not ticket:
        return None

    comments = ticket.get("comments", [])
    if not comments:
        return None

    record = {
        "id": ticket.get("id"),
        "subject": ticket.get("subject"),
        "created_at": ticket.get("created_at"),
        "closed_at": ticket.get("closed_at"),
        "channel": ticket.get("via", {}).get("channel"),
        "customer": ticket.get("customer_profile", {}),
        "tags": ticket.get("tags", []),
        "form_data": None,
        "agent_recommendations": None,
        "customer_feedback": None,
        "messages": [],
    }

    for comment in comments:
        is_operator = comment.get("is_operator", False)
        author = comment.get("author_id", "")
        body = comment.get("plain_body") or comment.get("body") or ""

        # Strip HTML if plain_body wasn't available
        if body and "<" in body and ">" in body:
            body = strip_html(body)

        msg = {
            "role": "agent" if is_operator or "operator" in author else "customer",
            "timestamp": comment.get("created_at"),
            "text": body[:5000],  # cap at 5K chars per message
        }
        record["messages"].append(msg)

        # Parse form submission (usually the first customer message)
        if msg["role"] == "customer" and record["form_data"] is None:
            form = parse_form_submission(body)
            if form:
                record["form_data"] = form

        # Extract agent shade recommendations
        if msg["role"] == "agent":
            recs = extract_shade_recommendations(body)
            if recs:
                if record["agent_recommendations"] is None:
                    record["agent_recommendations"] = recs
                else:
                    record["agent_recommendations"].update(recs)

        # Extract customer feedback signals
        if msg["role"] == "customer":
            feedback = extract_feedback_signals(body)
            if feedback:
                if record["customer_feedback"] is None:
                    record["customer_feedback"] = feedback
                else:
                    record["customer_feedback"].extend(feedback)

    # Check ALL comments' HTML bodies for embedded form data and agent recs
    # (multi-reply threads often have the original form + agent response quoted)
    for comment in comments:
        html_body = comment.get("html_body", "")
        if not html_body:
            continue
        plain = strip_html(html_body)

        if record["form_data"] is None:
            form = parse_form_submission(plain)
            if form:
                record["form_data"] = form

        if record["agent_recommendations"] is None:
            recs = extract_shade_recommendations(plain)
            if recs:
                record["agent_recommendations"] = recs

    return record


def main():
    parser = argparse.ArgumentParser(description="Extract Richpanel shade conversations")
    parser.add_argument("--limit", type=int, default=0, help="Max conversations to process (0=all)")
    parser.add_argument("--resume", action="store_true", help="Resume from last progress")
    args = parser.parse_args()

    if not API_KEY:
        print("ERROR: RICHPANEL_API_KEY not set. Run: source ~/.zshrc")
        sys.exit(1)

    # Load conversation IDs
    all_ids = load_shade_match_ids()

    # Load progress if resuming
    processed_ids = load_progress() if args.resume else set()
    if processed_ids:
        print(f"Resuming: {len(processed_ids)} already processed")

    # Filter to unprocessed
    ids_to_process = [cid for cid in all_ids if cid not in processed_ids]
    if args.limit > 0:
        ids_to_process = ids_to_process[:args.limit]

    print(f"Processing {len(ids_to_process)} conversations...")

    # Open output file in append mode
    mode = "a" if args.resume and OUTPUT_FILE.exists() else "w"

    stats = {
        "processed": 0,
        "success": 0,
        "with_form": 0,
        "with_recs": 0,
        "with_feedback": 0,
        "with_photos": 0,
        "errors": 0,
    }

    with open(OUTPUT_FILE, mode) as out_f:
        for i, conv_id in enumerate(ids_to_process):
            # Fetch
            raw = fetch_conversation(conv_id)
            stats["processed"] += 1

            if raw is None:
                stats["errors"] += 1
                processed_ids.add(conv_id)
                time.sleep(DELAY_BETWEEN_REQUESTS)
                continue

            # Process
            record = process_conversation(raw)
            if record:
                stats["success"] += 1
                if record["form_data"]:
                    stats["with_form"] += 1
                    if record["form_data"].get("photo_urls"):
                        stats["with_photos"] += 1
                if record["agent_recommendations"]:
                    stats["with_recs"] += 1
                if record["customer_feedback"]:
                    stats["with_feedback"] += 1

                out_f.write(json.dumps(record) + "\n")

            processed_ids.add(conv_id)

            # Progress update
            if (i + 1) % BATCH_SIZE == 0:
                save_progress(processed_ids)
                out_f.flush()
                pct = (i + 1) / len(ids_to_process) * 100
                print(f"  [{i+1}/{len(ids_to_process)}] ({pct:.1f}%) — "
                      f"{stats['success']} ok, {stats['with_form']} forms, "
                      f"{stats['with_recs']} recs, {stats['with_photos']} photos, "
                      f"{stats['errors']} errors")

            time.sleep(DELAY_BETWEEN_REQUESTS)

    # Final save
    save_progress(processed_ids)

    print(f"\n{'='*60}")
    print(f"DONE — {stats['processed']} processed")
    print(f"  Success:      {stats['success']}")
    print(f"  With form:    {stats['with_form']}")
    print(f"  With recs:    {stats['with_recs']}")
    print(f"  With feedback: {stats['with_feedback']}")
    print(f"  With photos:  {stats['with_photos']}")
    print(f"  Errors:       {stats['errors']}")
    print(f"\nOutput: {OUTPUT_FILE}")
    print(f"Progress: {PROGRESS_FILE}")


if __name__ == "__main__":
    main()
