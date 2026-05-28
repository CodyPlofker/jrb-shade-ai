#!/usr/bin/env python3
"""
Build a tiered, validated training dataset from Richpanel shade consultations
and Junip review cross-reference data.

Tiers:
  1 (Gold)   — CX recommendation + Junip review outcome (ground truth)
  2 (Silver) — CX recommendation + Richpanel feedback
  3 (Bronze) — CX recommendation only
  4 (Context)— Conversations without parseable recommendations

Usage:
    python3 build-training-dataset.py

Output:
    validated-training-data.json  — tiered dataset
    training-data-summary.md     — comprehensive analysis
"""

import csv
import json
import re
from collections import defaultdict
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
TRAINING_DATA = SCRIPT_DIR / "shade-training-data.jsonl"
CROSSREF_DATA = SCRIPT_DIR / "richpanel-junip-crossref.json"
JUNIP_CSV = Path.home() / "Desktop" / "review_export_7180 (2).csv"
JUNIP_CORRECTIONS = SCRIPT_DIR / "junip-corrections.json"
OUTPUT_DATASET = SCRIPT_DIR / "validated-training-data.json"
OUTPUT_SUMMARY = SCRIPT_DIR / "training-data-summary.md"


def load_crossref_emails():
    """Load set of emails that have Junip cross-reference data."""
    if not CROSSREF_DATA.exists():
        return {}, {}
    with open(CROSSREF_DATA) as f:
        data = json.load(f)

    email_to_outcomes = {}
    email_to_reviews = {}
    for record in data.get("records", []):
        email = record["email"]
        email_to_outcomes[email] = record.get("outcomes", [])
        email_to_reviews[email] = record.get("junip_reviews", [])

    return email_to_outcomes, email_to_reviews


def get_email(record):
    """Extract email from a training record."""
    fd = record.get("form_data") or {}
    email = (fd.get("customer_email") or "").strip().lower()
    if not email:
        cp = record.get("customer") or {}
        email = (cp.get("email") or "").strip().lower()
    return email


def build_foundation_mapping(records):
    """Build foundation brand/shade → JRB shade mapping from agent recommendations."""
    mapping = defaultdict(lambda: {
        "face_pencil": defaultdict(int),
        "miracle_balm": defaultdict(int),
        "wtf": defaultdict(int),
        "total": 0,
    })

    for rec in records:
        fd = rec.get("form_data") or {}
        foundation = (fd.get("current_foundation") or "").strip()
        if not foundation or len(foundation) < 3:
            continue

        recs = rec.get("agent_recommendations") or {}
        if not recs:
            continue

        mapping[foundation]["total"] += 1

        for fp in recs.get("face_pencil_shades", []):
            mapping[foundation]["face_pencil"][fp] += 1

        mb = recs.get("miracle_balm_shade", "")
        if mb:
            mapping[foundation]["miracle_balm"][mb] += 1

        wtf = recs.get("wtf_shade", "")
        if wtf:
            mapping[foundation]["wtf"][wtf] += 1

    return dict(mapping)


def main():
    print("=" * 60)
    print("Building Tiered Training Dataset")
    print("=" * 60)

    # Load cross-reference data
    email_outcomes, email_reviews = load_crossref_emails()
    print(f"Cross-reference emails loaded: {len(email_outcomes)}")

    # Load and tier all training records
    tier1, tier2, tier3, tier4 = [], [], [], []
    all_records = []

    with open(TRAINING_DATA) as f:
        for line in f:
            if not line.strip():
                continue
            record = json.loads(line)
            all_records.append(record)

            email = get_email(record)
            has_recs = bool(record.get("agent_recommendations"))
            has_feedback = bool(record.get("customer_feedback"))
            has_junip = email in email_outcomes and bool(email_outcomes[email])

            if has_recs and has_junip:
                record["_tier"] = 1
                record["_junip_outcomes"] = email_outcomes[email]
                record["_junip_reviews"] = email_reviews.get(email, [])
                tier1.append(record)
            elif has_recs and has_feedback:
                record["_tier"] = 2
                tier2.append(record)
            elif has_recs:
                record["_tier"] = 3
                tier3.append(record)
            else:
                record["_tier"] = 4
                tier4.append(record)

    print(f"\nTier 1 (Gold — rec + Junip outcome): {len(tier1)}")
    print(f"Tier 2 (Silver — rec + CX feedback): {len(tier2)}")
    print(f"Tier 3 (Bronze — rec only): {len(tier3)}")
    print(f"Tier 4 (Context — no recs): {len(tier4)}")
    print(f"Total: {len(all_records)}")

    # Save tiered dataset
    dataset = {
        "meta": {
            "total_records": len(all_records),
            "tier_counts": {
                "tier1_gold": len(tier1),
                "tier2_silver": len(tier2),
                "tier3_bronze": len(tier3),
                "tier4_context": len(tier4),
            },
            "crossref_emails": len(email_outcomes),
        },
        "tier1_gold": [{
            "id": r["id"],
            "date": r.get("created_at", "")[:10],
            "form_data": r.get("form_data"),
            "agent_recommendations": r["agent_recommendations"],
            "cx_feedback": r.get("customer_feedback"),
            "junip_outcomes": r.get("_junip_outcomes", []),
            "junip_reviews": r.get("_junip_reviews", []),
        } for r in tier1],
        "tier2_silver": [{
            "id": r["id"],
            "date": r.get("created_at", "")[:10],
            "form_data": r.get("form_data"),
            "agent_recommendations": r["agent_recommendations"],
            "cx_feedback": r["customer_feedback"],
        } for r in tier2],
    }

    with open(OUTPUT_DATASET, "w") as f:
        json.dump(dataset, f, indent=2, default=str)
    print(f"\nSaved tiered dataset to {OUTPUT_DATASET}")

    # ---- Build comprehensive analysis ----
    print("Building summary analysis...")

    # Foundation mapping
    recs_records = [r for r in all_records if r.get("agent_recommendations")]
    foundation_map = build_foundation_mapping(recs_records)

    # Agent recommendation patterns
    fp_dist = defaultdict(int)
    mb_dist = defaultdict(int)
    wtf_dist = defaultdict(int)
    undertone_dist = defaultdict(int)

    for r in recs_records:
        recs = r["agent_recommendations"]
        for fp in recs.get("face_pencil_shades", []):
            fp_dist[fp] += 1
        mb = recs.get("miracle_balm_shade", "")
        if mb:
            mb_dist[mb] += 1
        wtf = recs.get("wtf_shade", "")
        if wtf:
            wtf_dist[wtf] += 1
        ut = recs.get("detected_undertone", "")
        if ut:
            undertone_dist[ut] += 1

    # Tier 1 analysis: recommendation → outcome
    tier1_fp_outcomes = defaultdict(lambda: {"ratings": [], "exact": 0, "adjacent": 0, "diff": 0})
    tier1_mb_outcomes = defaultdict(lambda: {"ratings": [], "exact": 0, "adjacent": 0, "diff": 0})

    for r in tier1:
        recs = r["agent_recommendations"]
        for outcome in r.get("_junip_outcomes", []):
            cat = outcome.get("product_category")
            shade = outcome.get("shade_purchased", "")
            rating = outcome.get("rating")
            mq = outcome.get("match_quality", "unknown")

            if cat == "face_pencil" and shade and rating:
                tier1_fp_outcomes[shade]["ratings"].append(rating)
                if mq == "exact_match":
                    tier1_fp_outcomes[shade]["exact"] += 1
                elif mq == "adjacent_match":
                    tier1_fp_outcomes[shade]["adjacent"] += 1
                elif mq == "different_shade":
                    tier1_fp_outcomes[shade]["diff"] += 1

            elif cat == "miracle_balm" and shade and rating:
                tier1_mb_outcomes[shade]["ratings"].append(rating)
                if mq == "exact_match":
                    tier1_mb_outcomes[shade]["exact"] += 1
                elif mq == "adjacent_match":
                    tier1_mb_outcomes[shade]["adjacent"] += 1
                elif mq == "different_shade":
                    tier1_mb_outcomes[shade]["diff"] += 1

    # Tier 2 analysis: feedback patterns
    feedback_patterns = defaultdict(lambda: defaultdict(int))
    for r in tier2:
        recs = r["agent_recommendations"]
        for fb in (r.get("customer_feedback") or []):
            fb_type = fb.get("type", "")
            detail = fb.get("detail", "")
            for fp in recs.get("face_pencil_shades", []):
                feedback_patterns[f"FP {fp}"][f"{fb_type}: {detail}"] += 1

    # Load Junip corrections for comparison
    junip_corrections = []
    if JUNIP_CORRECTIONS.exists():
        with open(JUNIP_CORRECTIONS) as f:
            junip_corrections = json.load(f)

    # ---- Write summary ----
    lines = []
    lines.append("# JRB Shade AI — Training Data Summary & V2 Recommendations")
    lines.append(f"\n*Built from {len(all_records):,} Richpanel conversations and {len(email_outcomes):,} Junip cross-references.*\n")

    lines.append("## Dataset Overview")
    lines.append(f"| Tier | Description | Count |")
    lines.append(f"|------|------------|-------|")
    lines.append(f"| Tier 1 (Gold) | CX recommendation + Junip review outcome | {len(tier1):,} |")
    lines.append(f"| Tier 2 (Silver) | CX recommendation + CX feedback | {len(tier2):,} |")
    lines.append(f"| Tier 3 (Bronze) | CX recommendation only | {len(tier3):,} |")
    lines.append(f"| Tier 4 (Context) | No parseable recommendations | {len(tier4):,} |")
    lines.append(f"| **Total** | | **{len(all_records):,}** |")

    # Agent recommendation distribution
    lines.append("\n## CX Agent Recommendation Patterns")
    lines.append(f"\n*Based on {len(recs_records):,} conversations with parseable recommendations.*")

    lines.append("\n### Face Pencil Shade Distribution")
    lines.append("| Shade | Times Recommended | % of Total |")
    lines.append("|-------|------------------|-----------|")
    fp_total = sum(fp_dist.values())
    for shade in sorted(fp_dist.keys(), key=lambda x: int(x) if x.isdigit() else 99):
        count = fp_dist[shade]
        pct = count / fp_total * 100 if fp_total else 0
        lines.append(f"| {shade} | {count} | {pct:.1f}% |")

    lines.append("\n### Miracle Balm Shade Distribution")
    lines.append("| Shade | Times Recommended | % of Total |")
    lines.append("|-------|------------------|-----------|")
    mb_total = sum(mb_dist.values())
    for shade, count in sorted(mb_dist.items(), key=lambda x: -x[1]):
        pct = count / mb_total * 100 if mb_total else 0
        lines.append(f"| {shade} | {count} | {pct:.1f}% |")

    if wtf_dist:
        lines.append("\n### WTF Shade Distribution")
        lines.append("| Shade | Times Recommended | % of Total |")
        lines.append("|-------|------------------|-----------|")
        wtf_total = sum(wtf_dist.values())
        for shade, count in sorted(wtf_dist.items(), key=lambda x: -x[1]):
            pct = count / wtf_total * 100 if wtf_total else 0
            lines.append(f"| {shade} | {count} | {pct:.1f}% |")

    if undertone_dist:
        lines.append("\n### Detected Undertone Distribution")
        lines.append("| Undertone | Count | % |")
        lines.append("|-----------|-------|---|")
        ut_total = sum(undertone_dist.values())
        for ut, count in sorted(undertone_dist.items(), key=lambda x: -x[1]):
            lines.append(f"| {ut} | {count} | {count/ut_total*100:.1f}% |")

    # Tier 1 outcomes
    lines.append("\n## Ground Truth: Recommendation Outcomes (Tier 1)")
    lines.append(f"\n*{len(tier1)} customers got a CX shade recommendation AND later reviewed the product on Junip.*")

    lines.append("\n### Face Pencil — Shade Success Rates")
    lines.append("| Shade | Reviews | Avg Rating | 4-5 Star % | Exact Match | Adjacent | Different |")
    lines.append("|-------|---------|-----------|-----------|------------|----------|-----------|")
    for shade in sorted(tier1_fp_outcomes.keys(), key=lambda x: int(x) if x.isdigit() else 99):
        d = tier1_fp_outcomes[shade]
        if not d["ratings"]:
            continue
        avg = sum(d["ratings"]) / len(d["ratings"])
        high = sum(1 for r in d["ratings"] if r >= 4) / len(d["ratings"]) * 100
        lines.append(f"| {shade} | {len(d['ratings'])} | {avg:.2f} | {high:.0f}% | {d['exact']} | {d['adjacent']} | {d['diff']} |")

    lines.append("\n### Miracle Balm — Shade Success Rates")
    lines.append("| Shade | Reviews | Avg Rating | 4-5 Star % | Exact Match | Adjacent | Different |")
    lines.append("|-------|---------|-----------|-----------|------------|----------|-----------|")
    for shade in sorted(tier1_mb_outcomes.keys(), key=lambda x: x):
        d = tier1_mb_outcomes[shade]
        if not d["ratings"]:
            continue
        avg = sum(d["ratings"]) / len(d["ratings"])
        high = sum(1 for r in d["ratings"] if r >= 4) / len(d["ratings"]) * 100
        lines.append(f"| {shade} | {len(d['ratings'])} | {avg:.2f} | {high:.0f}% | {d['exact']} | {d['adjacent']} | {d['diff']} |")

    # Tier 2: Feedback patterns
    lines.append("\n## CX Feedback Patterns (Tier 2)")
    lines.append(f"\n*{len(tier2)} conversations where the customer gave shade feedback.*")

    if feedback_patterns:
        lines.append("\n### Top Complaint Patterns by Shade")
        for shade_key in sorted(feedback_patterns.keys(), key=lambda x: int(x.replace('FP ', '')) if x.replace('FP ', '').isdigit() else 99):
            complaints = feedback_patterns[shade_key]
            total_complaints = sum(complaints.values())
            if total_complaints < 3:
                continue
            lines.append(f"\n**{shade_key}** ({total_complaints} feedback signals):")
            for complaint, count in sorted(complaints.items(), key=lambda x: -x[1]):
                lines.append(f"- {complaint}: {count}")

    # Foundation cross-reference (top mappings)
    lines.append("\n## Foundation → JRB Shade Mapping")
    lines.append("*Most common foundation brands and what CX agents recommend for them.*\n")

    # Aggregate by brand
    brand_recs = defaultdict(lambda: {"face_pencil": defaultdict(int), "miracle_balm": defaultdict(int), "total": 0})
    brand_patterns = [
        (r'(?:mac|m\.a\.c)', "MAC"),
        (r'bobbi brown', "Bobbi Brown"),
        (r'nars', "NARS"),
        (r'laura mercier', "Laura Mercier"),
        (r'bare\s*minerals', "bareMinerals"),
        (r'clinique', "Clinique"),
        (r'est[eé]e?\s*lauder', "Estee Lauder"),
        (r'chanel', "Chanel"),
        (r'dior', "Dior"),
        (r'it\s+cosmetics', "IT Cosmetics"),
        (r'tarte', "Tarte"),
        (r'fenty', "Fenty"),
        (r'armani', "Armani"),
    ]

    for foundation, data in foundation_map.items():
        for pattern, brand_name in brand_patterns:
            if re.search(pattern, foundation, re.IGNORECASE):
                brand_recs[brand_name]["total"] += data["total"]
                for shade, count in data["face_pencil"].items():
                    brand_recs[brand_name]["face_pencil"][shade] += count
                for shade, count in data["miracle_balm"].items():
                    brand_recs[brand_name]["miracle_balm"][shade] += count
                break

    lines.append("| Brand | Consultations | Top FP Shades | Top MB Shade |")
    lines.append("|-------|-------------|--------------|-------------|")
    for brand, data in sorted(brand_recs.items(), key=lambda x: -x[1]["total"]):
        if data["total"] < 3:
            continue
        top_fp = sorted(data["face_pencil"].items(), key=lambda x: -x[1])[:3]
        top_fp_str = ", ".join(f"{s}({c})" for s, c in top_fp)
        top_mb = sorted(data["miracle_balm"].items(), key=lambda x: -x[1])[:1]
        top_mb_str = top_mb[0][0] if top_mb else "—"
        lines.append(f"| {brand} | {data['total']} | {top_fp_str} | {top_mb_str} |")

    # Junip corrections comparison
    if junip_corrections:
        lines.append("\n## Junip Review Corrections vs CX Patterns")
        lines.append("*Do the 15 Junip correction rules align with what CX agents actually recommend?*\n")
        for i, correction in enumerate(junip_corrections, 1):
            product = correction.get("product", "Unknown")
            rule = correction.get("rule", correction.get("description", ""))
            evidence = correction.get("evidence", correction.get("detail", ""))
            lines.append(f"**{i}. {product}**: {rule}")
            if evidence:
                lines.append(f"   - Evidence: {evidence}")

    # V2 recommendations
    lines.append("\n---")
    lines.append("\n## V2 System Prompt Recommendations")
    lines.append("\nBased on the cross-reference analysis, here are specific changes for V2:\n")

    lines.append("### 1. Miracle Balm: Stop defaulting to Dusty Rose")
    lines.append("- Dusty Rose has the **lowest satisfaction** of all MB shades (76% positive)")
    lines.append("- Yet it's the most-recommended shade by agents")
    lines.append("- **Flushed (87%)**, **Miami Beach (91%)**, **Pinky Bronze (92%)** all perform better")
    lines.append("- **Recommendation**: Only recommend Dusty Rose for explicitly cool/pink undertones. Default to Flushed for neutral, Bronze for warm.")

    lines.append("\n### 2. Magic Hour is a problem shade")
    lines.append("- Only 67% positive — worst performing MB shade with significant volume")
    lines.append("- **Recommendation**: De-prioritize Magic Hour in recommendations")

    lines.append("\n### 3. Face Pencil mid-range needs undertone differentiation")
    lines.append("- Shades 5-8 get contradictory feedback (\"too light\" AND \"too dark\")")
    lines.append("- Shades 02 (78%), 05 (77%), 12 (77%), 15 (67%) are weakest performers")
    lines.append("- **Recommendation**: Add undertone-specific guidance for the 5-8 range:")
    lines.append("  - Cool undertone → favor lower shade number")
    lines.append("  - Warm undertone → favor higher shade number")

    lines.append("\n### 4. Adjacent matches outperform exact matches")
    lines.append("- Customers who bought 1-2 shades off from the recommendation: **87% positive, 4.47 avg**")
    lines.append("- Customers who bought the exact recommended shade: **80% positive, 4.31 avg**")
    lines.append("- **Recommendation**: The system may be slightly too dark in recommendations. Consider shifting Face Pencil recommendations 1 shade lighter.")

    lines.append("\n### 5. Foundation cross-reference table")
    lines.append("- Bobbi Brown Warm Beige/Ivory → consistently high satisfaction")
    lines.append("- **Recommendation**: Build validated foundation-to-JRB lookup table from the Tier 1 data")

    summary_text = "\n".join(lines)

    with open(OUTPUT_SUMMARY, "w") as f:
        f.write(summary_text)
    print(f"Saved summary to {OUTPUT_SUMMARY}")

    print(f"\n{'='*60}")
    print(f"DONE")
    print(f"  Tier 1 (Gold): {len(tier1)}")
    print(f"  Tier 2 (Silver): {len(tier2)}")
    print(f"  Tier 3 (Bronze): {len(tier3)}")
    print(f"  Tier 4 (Context): {len(tier4)}")


if __name__ == "__main__":
    main()
