#!/usr/bin/env python3
"""
Cross-reference Richpanel shade consultations with Junip product reviews.
Matches customer emails to find people who got a shade recommendation
AND later reviewed the product — creating ground-truth training data.

Usage:
    python3 cross-reference-richpanel-junip.py

Output:
    richpanel-junip-crossref.json  — matched records with outcomes
    crossref-analysis.md           — summary analysis
"""

import csv
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
TRAINING_DATA = SCRIPT_DIR / "shade-training-data.jsonl"
JUNIP_CSV = Path.home() / "Desktop" / "review_export_7180 (2).csv"
OUTPUT_CROSSREF = SCRIPT_DIR / "richpanel-junip-crossref.json"
OUTPUT_ANALYSIS = SCRIPT_DIR / "crossref-analysis.md"

# Products that have shade variants
SHADE_PRODUCTS = {
    "what the foundation": "wtf",
    "the face pencil": "face_pencil",
    "miracle balm": "miracle_balm",
    "just a sec": "just_a_sec",
    "neutralizer pencil": "neutralizer",
    "tinted face powder": "tinted_face_powder",
    "just every tone moisturizer": "jetm",
    "cool gloss": "cool_gloss",
    "gel bronzer": "gel_bronzer",
    "the bronzer": "bronzer",
}

# Normalize shade names for comparison
def normalize_shade(shade_str):
    """Normalize a shade string for comparison."""
    if not shade_str:
        return ""
    s = shade_str.strip().lower()
    # Remove "shade " prefix
    s = re.sub(r'^shade\s+', '', s)
    # Remove leading zeros
    s = re.sub(r'^0+(\d)', r'\1', s)
    return s


def classify_product(product_title):
    """Map a Junip product title to our product categories."""
    title_lower = product_title.lower().strip()
    for product_name, category in SHADE_PRODUCTS.items():
        if product_name in title_lower:
            return category
    return None


def extract_junip_shade(variant_title, product_category):
    """Extract shade from Junip variant title."""
    if not variant_title:
        return None
    variant = variant_title.strip()

    if product_category == "face_pencil":
        # Extract shade number
        m = re.search(r'(\d{1,2})', variant)
        return m.group(1) if m else variant

    # For named shades (WTF, MB, etc.)
    return variant


def match_recommendation_to_review(agent_recs, product_category, review_shade):
    """Determine if the review matches what the agent recommended."""
    if not agent_recs or not review_shade:
        return "unknown"

    review_norm = normalize_shade(review_shade)

    if product_category == "face_pencil":
        rec_shades = agent_recs.get("face_pencil_shades", [])
        rec_norms = [normalize_shade(s) for s in rec_shades]
        if review_norm in rec_norms:
            return "exact_match"
        # Check adjacent (within 1-2 shades)
        try:
            review_num = int(review_norm)
            for rs in rec_norms:
                try:
                    if abs(int(rs) - review_num) <= 2:
                        return "adjacent_match"
                except ValueError:
                    continue
        except ValueError:
            pass
        return "different_shade"

    elif product_category == "miracle_balm":
        rec_shade = normalize_shade(agent_recs.get("miracle_balm_shade", ""))
        if rec_shade and rec_shade == review_norm:
            return "exact_match"
        if rec_shade:
            return "different_shade"
        return "unknown"

    elif product_category == "wtf":
        rec_shade = normalize_shade(agent_recs.get("wtf_shade", ""))
        if rec_shade and rec_shade == review_norm:
            return "exact_match"
        if rec_shade:
            return "different_shade"
        return "unknown"

    elif product_category == "jetm":
        rec_shade = normalize_shade(agent_recs.get("jetm_shade", ""))
        if rec_shade and rec_shade == review_norm:
            return "exact_match"
        if rec_shade:
            return "different_shade"
        return "unknown"

    elif product_category == "cool_gloss":
        rec_shade = normalize_shade(agent_recs.get("cool_gloss_shade", ""))
        if rec_shade and rec_shade == review_norm:
            return "exact_match"
        if rec_shade:
            return "different_shade"
        return "unknown"

    return "unknown"


def classify_satisfaction(rating, body):
    """Classify satisfaction from rating and review body."""
    if rating is None:
        return "unknown"
    r = int(rating)
    if r >= 4:
        return "positive"
    elif r <= 2:
        return "negative"
    return "neutral"


def extract_shade_feedback(body):
    """Extract shade-specific feedback from review body."""
    if not body:
        return []
    signals = []
    patterns = [
        (r'too\s+(dark|light|pink|orange|warm|cool|yellow|red)', "shade_complaint"),
        (r'(perfect|great|exact)\s+match', "positive_match"),
        (r'(love|loving|loved)\s+(?:the\s+)?(?:shade|color|colour)', "positive_shade"),
        (r'(wrong|incorrect|bad)\s+(?:shade|color|colour|match)', "negative_shade"),
        (r'(?:doesn\'t|does not|didn\'t)\s+match', "negative_match"),
        (r'shade\s+finder\s+(?:recommended|suggested)', "used_shade_finder"),
    ]
    for pattern, signal_type in patterns:
        matches = re.findall(pattern, body, re.IGNORECASE)
        if matches:
            signals.append({"type": signal_type, "detail": matches[0]})
    return signals


def main():
    print("=" * 60)
    print("Cross-Reference: Richpanel Shade Consultations x Junip Reviews")
    print("=" * 60)

    # ---- Step 1: Load Richpanel training data ----
    print("\n1. Loading Richpanel training data...")
    rp_by_email = defaultdict(list)
    rp_total = 0
    rp_with_email = 0
    rp_with_recs = 0

    with open(TRAINING_DATA) as f:
        for line in f:
            if not line.strip():
                continue
            d = json.loads(line)
            rp_total += 1
            fd = d.get("form_data") or {}
            email = (fd.get("customer_email") or "").strip().lower()
            if not email:
                # Try customer profile
                cp = d.get("customer") or {}
                email = (cp.get("email") or "").strip().lower()
            if email:
                rp_with_email += 1
                has_recs = bool(d.get("agent_recommendations"))
                if has_recs:
                    rp_with_recs += 1
                rp_by_email[email].append({
                    "conversation_id": d["id"],
                    "date": d.get("created_at", "")[:10],
                    "subject": d.get("subject", ""),
                    "agent_recs": d.get("agent_recommendations"),
                    "customer_context": {
                        "current_foundation": fd.get("current_foundation"),
                        "products_requested": fd.get("products_requested"),
                        "skin_info": fd.get("skin_info"),
                        "has_selfie": bool(fd.get("photo_urls")),
                    },
                    "cx_feedback": d.get("customer_feedback"),
                })

    print(f"   Total records: {rp_total}")
    print(f"   With email: {rp_with_email} ({len(rp_by_email)} unique)")
    print(f"   With recommendations: {rp_with_recs}")

    # ---- Step 2: Load Junip reviews ----
    print("\n2. Loading Junip reviews...")
    junip_by_email = defaultdict(list)
    junip_total = 0
    junip_shade = 0

    with open(JUNIP_CSV, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            junip_total += 1
            email = (row.get("email") or "").strip().lower()
            if not email:
                continue

            product_title = row.get("product_title", "")
            product_category = classify_product(product_title)

            # Only include shade-relevant products
            if not product_category:
                continue

            junip_shade += 1
            variant = row.get("product_variant_title", "")
            shade = extract_junip_shade(variant, product_category)

            junip_by_email[email].append({
                "product": product_title,
                "product_category": product_category,
                "shade_purchased": shade,
                "variant_raw": variant,
                "rating": int(row["rating"]) if row.get("rating") else None,
                "review_body": (row.get("body") or "")[:500],
                "skin_tone_survey": row.get("radio_Skin Tone", ""),
                "skin_type_survey": row.get("radio_Skin Type", ""),
                "skin_concerns_survey": row.get("radio_Skin Concerns", ""),
                "age_survey": row.get("radio_Age", ""),
                "date": (row.get("created_at") or "")[:10],
                "would_recommend": row.get("would_recommend", ""),
            })

    print(f"   Total reviews: {junip_total}")
    print(f"   Shade-product reviews: {junip_shade} ({len(junip_by_email)} unique emails)")

    # ---- Step 3: Cross-reference ----
    print("\n3. Cross-referencing emails...")
    overlap_emails = set(rp_by_email.keys()) & set(junip_by_email.keys())
    print(f"   Email overlap: {len(overlap_emails)}")

    crossref_records = []
    stats = {
        "total_matches": 0,
        "with_agent_recs": 0,
        "exact_match": 0,
        "adjacent_match": 0,
        "different_shade": 0,
        "unknown_match": 0,
        "positive": 0,
        "negative": 0,
        "neutral": 0,
        "by_product": defaultdict(lambda: {
            "total": 0, "exact": 0, "adjacent": 0, "different": 0, "unknown": 0,
            "positive": 0, "negative": 0, "neutral": 0,
            "avg_rating": [], "shade_ratings": defaultdict(list),
        }),
        "foundation_accuracy": defaultdict(lambda: {"total": 0, "positive": 0, "ratings": []}),
    }

    for email in overlap_emails:
        rp_convos = rp_by_email[email]
        junip_reviews = junip_by_email[email]

        # Find conversations with agent recommendations
        best_convo = None
        for convo in rp_convos:
            if convo["agent_recs"]:
                best_convo = convo
                break
        if not best_convo:
            best_convo = rp_convos[0]

        has_recs = bool(best_convo.get("agent_recs"))
        if has_recs:
            stats["with_agent_recs"] += 1

        record = {
            "email": email,
            "richpanel": best_convo,
            "junip_reviews": [],
            "outcomes": [],
        }

        for review in junip_reviews:
            product_cat = review["product_category"]
            review_shade = review["shade_purchased"]
            rating = review["rating"]

            # Match recommendation to review
            match_quality = match_recommendation_to_review(
                best_convo.get("agent_recs"), product_cat, review_shade
            ) if has_recs else "unknown"

            satisfaction = classify_satisfaction(rating, review["review_body"])
            shade_feedback = extract_shade_feedback(review["review_body"])

            outcome = {
                "product_category": product_cat,
                "shade_purchased": review_shade,
                "match_quality": match_quality,
                "satisfaction": satisfaction,
                "rating": rating,
                "shade_feedback": shade_feedback,
            }

            review_clean = {k: v for k, v in review.items()}
            record["junip_reviews"].append(review_clean)
            record["outcomes"].append(outcome)

            # Track stats
            stats["total_matches"] += 1
            stats[match_quality + ("_match" if match_quality in ("exact", "adjacent") else "")] = stats.get(match_quality + ("_match" if match_quality in ("exact", "adjacent") else ""), 0)
            stats["by_product"][product_cat]["total"] += 1

            if match_quality == "exact_match":
                stats["exact_match"] += 1
                stats["by_product"][product_cat]["exact"] += 1
            elif match_quality == "adjacent_match":
                stats["adjacent_match"] += 1
                stats["by_product"][product_cat]["adjacent"] += 1
            elif match_quality == "different_shade":
                stats["different_shade"] += 1
                stats["by_product"][product_cat]["different"] += 1
            else:
                stats["unknown_match"] += 1
                stats["by_product"][product_cat]["unknown"] += 1

            if satisfaction == "positive":
                stats["positive"] += 1
                stats["by_product"][product_cat]["positive"] += 1
            elif satisfaction == "negative":
                stats["negative"] += 1
                stats["by_product"][product_cat]["negative"] += 1
            else:
                stats["neutral"] += 1
                stats["by_product"][product_cat]["neutral"] += 1

            if rating is not None:
                stats["by_product"][product_cat]["avg_rating"].append(rating)
                if review_shade:
                    stats["by_product"][product_cat]["shade_ratings"][review_shade].append(rating)

            # Foundation cross-reference
            foundation = (best_convo.get("customer_context", {}).get("current_foundation") or "").strip()
            if foundation and rating is not None:
                key = foundation[:80]  # Truncate
                stats["foundation_accuracy"][key]["total"] += 1
                stats["foundation_accuracy"][key]["ratings"].append(rating)
                if rating >= 4:
                    stats["foundation_accuracy"][key]["positive"] += 1

        crossref_records.append(record)

    # ---- Step 4: Save cross-reference data ----
    print(f"\n4. Saving cross-reference data...")
    with open(OUTPUT_CROSSREF, "w") as f:
        json.dump({
            "meta": {
                "richpanel_total": rp_total,
                "richpanel_with_email": rp_with_email,
                "junip_total": junip_total,
                "junip_shade_products": junip_shade,
                "email_overlap": len(overlap_emails),
                "records_with_agent_recs": stats["with_agent_recs"],
            },
            "records": crossref_records,
        }, f, indent=2, default=str)
    print(f"   Saved {len(crossref_records)} records to {OUTPUT_CROSSREF}")

    # ---- Step 5: Generate analysis ----
    print(f"\n5. Generating analysis...")

    lines = []
    lines.append("# Cross-Reference Analysis: Richpanel x Junip")
    lines.append(f"\n*Generated from {len(overlap_emails)} customers who received a shade recommendation and later reviewed a product.*\n")

    lines.append("## Overview")
    lines.append(f"- **Richpanel conversations**: {rp_total:,} total, {rp_with_email:,} with email, {rp_with_recs:,} with recommendations")
    lines.append(f"- **Junip reviews**: {junip_total:,} total, {junip_shade:,} shade-product reviews")
    lines.append(f"- **Email overlap**: {len(overlap_emails)} customers")
    lines.append(f"- **With agent recommendations**: {stats['with_agent_recs']} customers")
    lines.append(f"- **Total review-to-recommendation matches**: {stats['total_matches']}")

    lines.append("\n## Match Quality (Did customers buy what was recommended?)")
    total_classifiable = stats["exact_match"] + stats["adjacent_match"] + stats["different_shade"]
    if total_classifiable > 0:
        lines.append(f"- **Exact match**: {stats['exact_match']} ({stats['exact_match']/total_classifiable*100:.1f}%) — bought the exact recommended shade")
        lines.append(f"- **Adjacent match**: {stats['adjacent_match']} ({stats['adjacent_match']/total_classifiable*100:.1f}%) — bought within 1-2 shades of recommendation")
        lines.append(f"- **Different shade**: {stats['different_shade']} ({stats['different_shade']/total_classifiable*100:.1f}%) — bought a different shade entirely")
    lines.append(f"- **Unknown**: {stats['unknown_match']} — couldn't determine (no recommendation for that product)")

    lines.append("\n## Satisfaction")
    total_sat = stats["positive"] + stats["negative"] + stats["neutral"]
    if total_sat > 0:
        lines.append(f"- **Positive (4-5 stars)**: {stats['positive']} ({stats['positive']/total_sat*100:.1f}%)")
        lines.append(f"- **Neutral (3 stars)**: {stats['neutral']} ({stats['neutral']/total_sat*100:.1f}%)")
        lines.append(f"- **Negative (1-2 stars)**: {stats['negative']} ({stats['negative']/total_sat*100:.1f}%)")

    lines.append("\n## By Product")
    for product_cat in sorted(stats["by_product"].keys()):
        p = stats["by_product"][product_cat]
        avg_r = sum(p["avg_rating"]) / len(p["avg_rating"]) if p["avg_rating"] else 0
        lines.append(f"\n### {product_cat.replace('_', ' ').title()}")
        lines.append(f"- Reviews: {p['total']}, Avg rating: {avg_r:.2f}")
        classifiable = p["exact"] + p["adjacent"] + p["different"]
        if classifiable > 0:
            lines.append(f"- Exact match: {p['exact']} ({p['exact']/classifiable*100:.1f}%)")
            lines.append(f"- Adjacent: {p['adjacent']} ({p['adjacent']/classifiable*100:.1f}%)")
            lines.append(f"- Different shade: {p['different']} ({p['different']/classifiable*100:.1f}%)")
        if p["positive"] + p["negative"] > 0:
            sat_rate = p["positive"] / (p["positive"] + p["negative"]) * 100
            lines.append(f"- Satisfaction (4-5 stars / total rated): {p['positive']}/{p['positive']+p['negative']+p['neutral']} ({sat_rate:.0f}% positive)")

        # Shade-level breakdown
        if p["shade_ratings"]:
            lines.append(f"\n**Shade-level ratings:**")
            lines.append(f"| Shade | Reviews | Avg Rating | 4-5 Star % |")
            lines.append(f"|-------|---------|-----------|-----------|")
            for shade in sorted(p["shade_ratings"].keys(), key=lambda x: (not x.isdigit(), int(x) if x.isdigit() else 0, x)):
                ratings = p["shade_ratings"][shade]
                avg = sum(ratings) / len(ratings)
                high = sum(1 for r in ratings if r >= 4) / len(ratings) * 100
                lines.append(f"| {shade} | {len(ratings)} | {avg:.2f} | {high:.0f}% |")

    # Foundation cross-reference
    lines.append("\n## Foundation Cross-Reference")
    lines.append("*Customers who mentioned their current foundation and later reviewed a JRB shade product.*\n")
    foundation_items = [(k, v) for k, v in stats["foundation_accuracy"].items() if v["total"] >= 2]
    foundation_items.sort(key=lambda x: -x[1]["total"])
    if foundation_items:
        lines.append(f"| Foundation | Reviews | Avg Rating | Positive % |")
        lines.append(f"|-----------|---------|-----------|-----------|")
        for foundation, data in foundation_items[:30]:
            avg = sum(data["ratings"]) / len(data["ratings"])
            pos_pct = data["positive"] / data["total"] * 100
            lines.append(f"| {foundation} | {data['total']} | {avg:.2f} | {pos_pct:.0f}% |")
    else:
        lines.append("*Not enough data (need 2+ reviews per foundation).*")

    # Match quality vs satisfaction
    lines.append("\n## Match Quality vs Satisfaction")
    lines.append("*Does following the CX recommendation lead to higher satisfaction?*\n")
    match_sat = defaultdict(lambda: {"positive": 0, "negative": 0, "neutral": 0, "ratings": []})
    for rec in crossref_records:
        for outcome in rec["outcomes"]:
            mq = outcome["match_quality"]
            sat = outcome["satisfaction"]
            match_sat[mq][sat] += 1
            if outcome["rating"] is not None:
                match_sat[mq]["ratings"].append(outcome["rating"])

    lines.append("| Match Quality | Count | Avg Rating | Positive % |")
    lines.append("|-------------|-------|-----------|-----------|")
    for mq in ["exact_match", "adjacent_match", "different_shade", "unknown"]:
        ms = match_sat[mq]
        total = ms["positive"] + ms["negative"] + ms["neutral"]
        if total == 0:
            continue
        avg = sum(ms["ratings"]) / len(ms["ratings"]) if ms["ratings"] else 0
        pos = ms["positive"] / total * 100 if total > 0 else 0
        lines.append(f"| {mq.replace('_', ' ').title()} | {total} | {avg:.2f} | {pos:.0f}% |")

    analysis_text = "\n".join(lines)

    with open(OUTPUT_ANALYSIS, "w") as f:
        f.write(analysis_text)
    print(f"   Saved analysis to {OUTPUT_ANALYSIS}")

    # Print summary
    print(f"\n{'='*60}")
    print(f"SUMMARY")
    print(f"  Customers matched: {len(overlap_emails)}")
    print(f"  With agent recommendations: {stats['with_agent_recs']}")
    print(f"  Total review matches: {stats['total_matches']}")
    print(f"  Exact shade match: {stats['exact_match']}")
    print(f"  Adjacent match: {stats['adjacent_match']}")
    print(f"  Different shade: {stats['different_shade']}")
    print(f"  Positive satisfaction: {stats['positive']}")
    print(f"  Negative satisfaction: {stats['negative']}")


if __name__ == "__main__":
    main()
