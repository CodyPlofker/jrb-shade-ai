#!/usr/bin/env python3
"""
Aggregate extracted Richpanel shade conversations into statistical summaries
for V2 system prompt training data.

Reads: shade-training-data.jsonl
Outputs: shade-aggregated-stats.json (compact stats for prompt engineering)

Run with: python3 aggregate-training-data.py
"""

import json
import re
from collections import Counter, defaultdict
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
INPUT_FILE = SCRIPT_DIR / "shade-training-data.jsonl"
OUTPUT_FILE = SCRIPT_DIR / "shade-aggregated-stats.json"


def normalize_foundation(raw):
    """Parse foundation string into structured brand/shade entries."""
    results = []
    if not raw:
        return results

    raw = raw.strip()
    # Skip non-foundation responses
    skip_patterns = [
        r'^(no|none|n/a|not using|don\'t use|i don\'t|nothing|nope)',
        r'^(just|only|first time)',
    ]
    for p in skip_patterns:
        if re.match(p, raw, re.IGNORECASE):
            return results

    # Common brand patterns — brand name followed by shade info
    brand_patterns = [
        # MAC
        (r'MAC\s+(?:Studio\s+Fix|Face\s+and\s+Body|Mineralize)?\s*(N[CW]?\s*\d+(?:\.\d+)?)', 'MAC'),
        (r'MAC\s+([A-Za-z\s]+\d+)', 'MAC'),
        # NARS
        (r'NARS?\s+(?:Sheer\s+Glow|Natural\s+Radiant|Tinted\s+Moisturizer)?\s*(?:in\s+)?([A-Za-z\s]+?)(?:\.|,|$|\s+and\b)', 'NARS'),
        # Clinique
        (r'Clinique\s*,?\s*([A-Za-z\s]*\d+[A-Za-z\s]*)', 'Clinique'),
        # Estee Lauder / Estée Lauder
        (r'Est[eé]+\s*Lauder\s+(?:Double\s+Wear|Futurist)?\s*(?:in\s+)?([A-Za-z0-9\s]+?)(?:\.|,|$)', 'Estee Lauder'),
        # Bobbi Brown
        (r'Bobbi\s+Brown\s+(?:Skin\s+Long.Wear|Skin\s+Foundation)?\s*(?:in\s+)?([A-Za-z\s]+?)(?:\.|,|$)', 'Bobbi Brown'),
        # IT Cosmetics
        (r'IT\s+Cosmetics?\s+(?:CC\+?\s+Cream|Your\s+Skin\s+But\s+Better)?\s*(?:in\s+)?([A-Za-z\s]+?)(?:\.|,|$)', 'IT Cosmetics'),
        # Bare Minerals
        (r'Bare\s*Minerals?\s+(?:Original|Complexion\s+Rescue)?\s*(?:in\s+)?([A-Za-z\s\d.]+?)(?:\.|,|$)', 'bareMinerals'),
        # Laura Mercier
        (r'Laura\s+Mercier\s+(?:Tinted\s+Moisturizer|Flawless)?\s*(?:in\s+)?([A-Za-z\s\d]+?)(?:\.|,|$)', 'Laura Mercier'),
        # Tarte
        (r'Tarte\s+(?:Shape\s+Tape|Amazonian\s+Clay)?\s*(?:in\s+)?([A-Za-z\s\d]+?)(?:\.|,|$)', 'Tarte'),
        # Too Faced
        (r'Too\s+Faced\s+(?:Born\s+This\s+Way)?\s*(?:in\s+)?([A-Za-z\s\d]+?)(?:\.|,|$)', 'Too Faced'),
        # Fenty
        (r'Fenty\s+(?:Pro\s+Filt\'?r|Eaze\s+Drop)?\s*(?:in\s+)?(\d+(?:\.\d+)?)', 'Fenty'),
        # Maybelline
        (r'Maybelline\s+(?:Fit\s+Me|SuperStay)?\s*(?:in\s+)?([A-Za-z\s\d]+?)(?:\.|,|$)', 'Maybelline'),
        # L'Oreal
        (r'L\'?[Oo]r[eé]al\s+(?:True\s+Match|Infallible)?\s*(?:in\s+)?([A-Za-z\s\d.]+?)(?:\.|,|$)', "L'Oreal"),
        # Chanel
        (r'Chanel\s+(?:Les\s+Beiges|Vitalumiere)?\s*(?:in\s+)?([A-Za-z\s\d.]+?)(?:\.|,|$)', 'Chanel'),
        # Dior
        (r'Dior\s+(?:Forever|Backstage|Skin)?\s*(?:in\s+)?([A-Za-z\s\d.]+?)(?:\.|,|$)', 'Dior'),
        # Giorgio Armani
        (r'(?:Giorgio\s+)?Armani\s+(?:Luminous\s+Silk)?\s*(?:in\s+)?([A-Za-z\s\d.]+?)(?:\.|,|$)', 'Armani'),
        # Urban Decay
        (r'Urban\s+Decay\s+(?:Stay\s+Naked|All\s+Nighter)?\s*(?:in\s+)?([A-Za-z\s\d.]+?)(?:\.|,|$)', 'Urban Decay'),
        # Jones Road (existing customer re-matching)
        (r'Jones\s+Road\s+(?:Face\s+Pencil|WTF|What\s+The\s+Foundation|Miracle\s+Balm)?\s*(?:in\s+)?(?:shade\s+)?([A-Za-z\s\d]+?)(?:\.|,|$)', 'Jones Road'),
        # Cover Girl
        (r'Cover\s*Girl\s+(?:Clean|Simply)?\s*(?:in\s+)?([A-Za-z\s\d.]+?)(?:\.|,|$)', 'CoverGirl'),
        # Revlon
        (r'Revlon\s+(?:ColorStay|Photoready)?\s*(?:in\s+)?([A-Za-z\s\d.]+?)(?:\.|,|$)', 'Revlon'),
    ]

    for pattern, brand in brand_patterns:
        m = re.search(pattern, raw, re.IGNORECASE)
        if m:
            shade = m.group(1).strip().rstrip('.,;')
            if shade and len(shade) > 1 and len(shade) < 50:
                results.append({"brand": brand, "shade": shade})

    return results


def clean_miracle_balm_shade(shade: str):
    """Return cleaned MB shade name or None if it's a false positive."""
    if not shade:
        return None
    valid = {
        "dusty rose", "magic hour", "flushed", "peachy", "bronze",
        "golden hour", "cool rose", "au naturel", "coral", "tawny",
        "mocha", "sunkissed", "pinky bronze", "cocoa bronze",
        "chic", "miami beach", "pinched cheeks", "happy hour",
    }
    lower = shade.lower().strip()
    if lower in valid:
        return shade.title()
    # Partial match
    for v in valid:
        if v in lower:
            return v.title()
    return None


def main():
    records = []
    with open(INPUT_FILE) as f:
        for line in f:
            records.append(json.loads(line))

    print(f"Loaded {len(records)} records")

    # === 1. Foundation → JRB Shade Cross-Reference ===
    # Maps: (brand, brand_shade) → {face_pencil_shades, miracle_balm_shades}
    foundation_to_jrb = defaultdict(lambda: {
        "face_pencil": Counter(),
        "miracle_balm": Counter(),
        "count": 0
    })

    brand_counts = Counter()

    for rec in records:
        form = rec.get("form_data") or {}
        recs = rec.get("agent_recommendations") or {}
        raw_foundation = form.get("current_foundation", "")

        foundations = normalize_foundation(raw_foundation)
        fp_shades = recs.get("face_pencil_shades", [])
        mb_shade = clean_miracle_balm_shade(recs.get("miracle_balm_shade", ""))

        for f_entry in foundations:
            brand = f_entry["brand"]
            shade = f_entry["shade"]
            key = f"{brand}|{shade}"

            foundation_to_jrb[key]["count"] += 1
            brand_counts[brand] += 1

            for fps in fp_shades:
                foundation_to_jrb[key]["face_pencil"][fps] += 1
            if mb_shade:
                foundation_to_jrb[key]["miracle_balm"][mb_shade] += 1

    # === 2. Face Pencil Shade Distribution ===
    fp_distribution = Counter()
    fp_by_subject_tone = defaultdict(Counter)  # customer-described tone → shade

    for rec in records:
        recs = rec.get("agent_recommendations") or {}
        for fps in recs.get("face_pencil_shades", []):
            fp_distribution[fps] += 1

        # Extract tone from customer messages
        form = rec.get("form_data") or {}
        messages = rec.get("messages", [])
        customer_text = " ".join(m["text"] for m in messages if m["role"] == "customer")

        for tone_word in ["fair", "light", "medium", "dark", "olive", "pale", "tan", "deep"]:
            if re.search(rf'\b{tone_word}\b', customer_text, re.IGNORECASE):
                for fps in recs.get("face_pencil_shades", []):
                    fp_by_subject_tone[tone_word][fps] += 1

    # === 3. Miracle Balm Distribution ===
    mb_distribution = Counter()
    for rec in records:
        recs = rec.get("agent_recommendations") or {}
        mb = clean_miracle_balm_shade(recs.get("miracle_balm_shade", ""))
        if mb:
            mb_distribution[mb] += 1

    # === 4. Feedback/Complaint Analysis ===
    complaint_by_shade = defaultdict(list)  # shade → complaint types
    complaint_totals = Counter()
    positive_totals = Counter()

    for rec in records:
        feedback = rec.get("customer_feedback") or []
        recs = rec.get("agent_recommendations") or {}
        fp_shades = recs.get("face_pencil_shades", [])

        for fb in feedback:
            fb_type = fb["type"]
            detail = fb.get("detail", "")

            if fb_type == "shade_complaint":
                complaint_totals[detail] += 1
                for fps in fp_shades:
                    complaint_by_shade[fps].append(detail)
            elif fb_type == "positive_match":
                for fps in fp_shades:
                    positive_totals[fps] += 1

    # === 5. Products Requested Distribution ===
    products_requested = Counter()
    for rec in records:
        form = rec.get("form_data") or {}
        products = form.get("products_requested", "").lower()
        if "face pencil" in products:
            products_requested["Face Pencil"] += 1
        if "miracle balm" in products:
            products_requested["Miracle Balm"] += 1
        if "wtf" in products or "what the foundation" in products:
            products_requested["WTF"] += 1
        if "cool gloss" in products:
            products_requested["Cool Gloss"] += 1
        if "tinted moisture" in products or "moisturizer" in products:
            products_requested["Tinted Moisturizer"] += 1
        if "everything" in products or "all" in products:
            products_requested["All Products"] += 1

    # === Build output ===
    output = {
        "meta": {
            "total_records": len(records),
            "records_with_form": sum(1 for r in records if r.get("form_data")),
            "records_with_foundation": sum(1 for r in records if (r.get("form_data") or {}).get("current_foundation")),
            "records_with_recs": sum(1 for r in records if r.get("agent_recommendations")),
            "records_with_feedback": sum(1 for r in records if r.get("customer_feedback")),
        },

        "foundation_cross_reference": {
            "top_brands": dict(brand_counts.most_common(25)),
            "mappings": []
        },

        "face_pencil_distribution": dict(fp_distribution.most_common()),

        "face_pencil_by_customer_tone": {
            tone: dict(shades.most_common(5))
            for tone, shades in sorted(fp_by_subject_tone.items())
        },

        "miracle_balm_distribution": dict(mb_distribution.most_common()),

        "complaints": {
            "totals": dict(complaint_totals.most_common()),
            "by_shade": {
                shade: dict(Counter(complaints).most_common())
                for shade, complaints in sorted(complaint_by_shade.items())
            }
        },

        "positive_matches_by_shade": dict(positive_totals.most_common()),

        "products_requested": dict(products_requested.most_common()),
    }

    # Build foundation mappings (only include entries with 2+ occurrences)
    for key, data in sorted(foundation_to_jrb.items(), key=lambda x: -x[1]["count"]):
        if data["count"] < 2:
            continue
        brand, shade = key.split("|", 1)
        top_fp = data["face_pencil"].most_common(3)
        top_mb = data["miracle_balm"].most_common(2)

        output["foundation_cross_reference"]["mappings"].append({
            "brand": brand,
            "shade": shade,
            "count": data["count"],
            "face_pencil_recs": {s: c for s, c in top_fp},
            "miracle_balm_recs": {s: c for s, c in top_mb},
        })

    with open(OUTPUT_FILE, "w") as f:
        json.dump(output, f, indent=2)

    # Print summary
    print(f"\n{'='*60}")
    print(f"AGGREGATION COMPLETE")
    print(f"{'='*60}")

    print(f"\n--- Foundation Brands ({len(brand_counts)} unique) ---")
    for brand, count in brand_counts.most_common(15):
        print(f"  {brand}: {count}")

    print(f"\n--- Face Pencil Shade Distribution ---")
    total_fp = sum(fp_distribution.values())
    for shade, count in fp_distribution.most_common():
        pct = count / total_fp * 100
        bar = "█" * int(pct)
        print(f"  Shade {shade:>2}: {count:>4} ({pct:>4.1f}%) {bar}")

    print(f"\n--- Miracle Balm Distribution ---")
    for shade, count in mb_distribution.most_common():
        print(f"  {shade:>15}: {count}")

    print(f"\n--- Shade Complaints ---")
    for complaint, count in complaint_totals.most_common():
        print(f"  Too {complaint}: {count}")

    print(f"\n--- Foundation → JRB Mappings (2+ occurrences) ---")
    mappings = output["foundation_cross_reference"]["mappings"]
    print(f"  {len(mappings)} mappings found")
    for m in mappings[:20]:
        fp = ", ".join(f"FP{s}" for s in m["face_pencil_recs"])
        mb = ", ".join(m["miracle_balm_recs"].keys())
        print(f"  {m['brand']} {m['shade']} (n={m['count']}) → {fp}{' / ' + mb if mb else ''}")

    print(f"\n--- Products Requested ---")
    for product, count in products_requested.most_common():
        print(f"  {product}: {count}")

    print(f"\nOutput: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
