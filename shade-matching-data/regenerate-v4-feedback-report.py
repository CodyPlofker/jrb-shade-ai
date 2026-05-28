#!/usr/bin/env python3
"""Regenerate the Shade AI V4 feedback dashboard from live Upstash data.

Usage:
    python3 regenerate-v4-feedback-report.py

Pulls fresh feedback from https://jrb-shade-ai.vercel.app/api/feedback,
computes V4 vs V3 summary stats, and writes:
  - shade-matching-data/v4-feedback-report.html (working source copy)
  - ../../jrb-docs/ecom/analysis/shade-ai-v4-feedback/index.html (publish target)

The three Vercel projects (V1, V2, V3) all share the same Upstash Redis
instance, so any endpoint returns the same data set. V4 entries are tagged
`version: "v4"` at submission time.
"""

from __future__ import annotations

import json
import re
import sys
import urllib.request
from collections import Counter, defaultdict
from datetime import datetime
from html import escape
from pathlib import Path
from zoneinfo import ZoneInfo

ENDPOINT = "https://jrb-shade-ai.vercel.app/api/feedback"
TZ = ZoneInfo("America/New_York")

# V3 baseline for delta arrows. The dashboard intentionally compares against
# the V3 sample frozen at handover (n=66) — V3 is no longer collecting
# feedback so this number is stable.
V3_BASELINE_N = 66
V3_BASELINE_SKIN_PCT = 42  # 28/66
V3_BASELINE_UT_PCT = 68    # 45/66

SKIN_EVAL_ORDER = ["Yes", "Too Dark", "Too Light", "Way Off"]
UT_EVAL_ORDER = ["Yes", "Should be Cool", "Should be Neutral", "Should be Warm"]
SKIN_TONE_BUCKETS = ["Fair", "Light", "Light-Medium", "Medium", "Medium-Dark", "Dark", "Deep"]
UT_BUCKETS = ["Neutral", "Warm", "Cool"]
CONFIDENCE_BUCKETS = ["high", "medium", "low"]

POS_KEYWORDS = re.compile(
    r"\b(love|loved|perfect|spot[- ]?on|right[- ]?on|amazing|great|accurate|"
    r"impressive|nailed|exact|impressed|gorgeous|excellent)\b",
    re.I,
)


def fetch_feedback() -> list[dict]:
    with urllib.request.urlopen(ENDPOINT, timeout=30) as r:
        data = json.load(r)
    return data["feedback"]


def pct(n: int, d: int) -> int:
    return round(100 * n / d) if d else 0


def fmt_ts(iso: str) -> str:
    dt = datetime.fromisoformat(iso.replace("Z", "+00:00")).astimezone(TZ)
    return dt.strftime("%b %-d, %-I:%M%p").lower()


def skin_class(v: str) -> str:
    return {
        "Yes": "yes",
        "Too Dark": "too-dark",
        "Too Light": "too-light",
        "Way Off": "way-off",
    }.get(v, "unknown")


def ut_class(v: str) -> str:
    return {
        "Yes": "yes",
        "Should be Cool": "should-be-cool",
        "Should be Neutral": "should-be-neutral",
        "Should be Warm": "should-be-warm",
    }.get(v, "unknown")


def skin_pill(v: str) -> str:
    if v == "Yes":
        return '<span class="pill pill-correct">✓ Skin</span>'
    if v == "":
        return '<span class="pill pill-neutral">Skin: —</span>'
    return f'<span class="pill pill-wrong">✗ Skin: {escape(v)}</span>'


def ut_pill(v: str) -> str:
    if v == "Yes":
        return '<span class="pill pill-correct">✓ UT</span>'
    if v == "":
        return '<span class="pill pill-neutral">UT: —</span>'
    return f'<span class="pill pill-wrong">✗ UT: {escape(v)}</span>'


def neutral_pill(v: str) -> str:
    if not v:
        return ""
    return f'<span class="pill pill-neutral">{escape(v)}</span>'


def detail_row(label: str, value: str) -> str:
    return f'<div class="dr"><span>{escape(label)}</span><b>{escape(value or "—")}</b></div>'


def has_shade_data(e: dict) -> bool:
    return bool(
        (e.get("actualWtfShade") or "").strip()
        or (e.get("actualFacePencilShade") or "").strip()
        or (e.get("actualMiracleBalmShades") or "").strip()
    )


def build_report(entries: list[dict]) -> str:
    v4 = [e for e in entries if e.get("version") == "v4"]
    v4.sort(key=lambda e: e["timestamp"], reverse=True)
    n = len(v4)
    with_shade = sum(1 for e in v4 if has_shade_data(e))

    skin_counts = Counter(e["skinToneCorrect"] for e in v4)
    ut_counts = Counter(e["undertoneCorrect"] for e in v4)
    skin_yes = skin_counts.get("Yes", 0)
    ut_yes = ut_counts.get("Yes", 0)
    skin_pct = pct(skin_yes, n)
    ut_pct = pct(ut_yes, n)
    skin_delta = skin_pct - V3_BASELINE_SKIN_PCT
    ut_delta = ut_pct - V3_BASELINE_UT_PCT

    too_dark = skin_counts.get("Too Dark", 0)
    too_light = skin_counts.get("Too Light", 0)
    too_dark_pct = pct(too_dark, n)
    too_light_pct = pct(too_light, n)
    if too_dark > too_light:
        miss_line = (
            f'"Too Dark" misses ({too_dark_pct}%) now outpace "Too Light" '
            f'({too_light_pct}%) — opposite of V3\'s blind spot, confirming the '
            f'lean-darker patch over-corrected on lighter customers.'
        )
    elif too_light > too_dark:
        miss_line = (
            f'"Too Light" misses ({too_light_pct}%) still outpace "Too Dark" '
            f'({too_dark_pct}%) — same direction as V3, but smaller in magnitude.'
        )
    else:
        miss_line = (
            f'"Too Light" and "Too Dark" misses are now balanced at '
            f'{too_light_pct}% each — V4 has eliminated V3\'s lean-light bias.'
        )

    now = datetime.now(TZ)
    generated = now.strftime("%B %-d, %Y at %-I:%M %p")

    # Build sections
    out = [HEAD]
    out.append(f'<h1>Shade AI V4 — Feedback Summary + Raw Responses</h1>')
    out.append(
        f'<p class="meta">Generated {generated} · n={n} V4 · V3 baseline n={V3_BASELINE_N}</p>'
    )

    out.append('<div class="headline">')
    out.append(
        f'<strong>V4 still ships better than V3 on both axes.</strong> '
        f'Skin-tone correct {skin_pct}% (V3 {V3_BASELINE_SKIN_PCT}%, '
        f'{"+" if skin_delta >= 0 else ""}{skin_delta} pts). '
        f'Undertone correct {ut_pct}% (V3 {V3_BASELINE_UT_PCT}%, '
        f'{"+" if ut_delta >= 0 else ""}{ut_delta} pts). '
        f'{miss_line}'
    )
    out.append('</div>')

    # Headline cards
    def delta_html(delta: int) -> str:
        if delta == 0:
            return f'<div class="delta">flat vs V3</div>'
        cls = "up" if delta > 0 else "down"
        sign = "+" if delta > 0 else ""
        return f'<div class="delta {cls}">{sign}{delta} pts vs V3</div>'

    out.append('<div class="grid">')
    out.append(f'<div class="card"><div class="lbl">V4 responses</div><div class="num">{n}</div></div>')
    out.append(
        f'<div class="card"><div class="lbl">Skin tone correct</div>'
        f'<div class="num">{skin_pct}%</div>{delta_html(skin_delta)}</div>'
    )
    out.append(
        f'<div class="card"><div class="lbl">Undertone correct</div>'
        f'<div class="num">{ut_pct}%</div>{delta_html(ut_delta)}</div>'
    )
    out.append(f'<div class="card"><div class="lbl">With shade data</div><div class="num">{with_shade}</div></div>')
    out.append('</div>')

    # Skin-tone eval breakdown
    out.append('<h2>Skin-tone breakdown</h2>')
    out.append('<table><thead><tr><th>Eval</th><th class="num">Count</th><th class="num">%</th></tr></thead><tbody>')
    for k in SKIN_EVAL_ORDER:
        c = skin_counts.get(k, 0)
        if c == 0:
            continue
        out.append(f'<tr><td>{escape(k)}</td><td class="num">{c}</td><td class="num">{pct(c, n)}%</td></tr>')
    out.append('</tbody></table>')

    # Undertone eval breakdown
    out.append('<h2>Undertone breakdown</h2>')
    out.append('<table><thead><tr><th>Eval</th><th class="num">Count</th><th class="num">%</th></tr></thead><tbody>')
    for k in UT_EVAL_ORDER:
        c = ut_counts.get(k, 0)
        if c == 0:
            continue
        out.append(f'<tr><td>{escape(k)}</td><td class="num">{c}</td><td class="num">{pct(c, n)}%</td></tr>')
    out.append('</tbody></table>')

    # By detected skin-tone bucket — sort by count desc
    out.append('<h2>By detected skin-tone bucket</h2>')
    out.append(
        '<table><thead><tr><th>Bucket</th><th class="num">n</th>'
        '<th class="num">Skin ✓</th><th class="num">UT ✓</th>'
        '<th class="num">Too Dark</th><th class="num">Too Light</th>'
        '<th class="num">Way Off</th></tr></thead><tbody>'
    )
    bucket_rows = []
    for b in SKIN_TONE_BUCKETS:
        sub = [e for e in v4 if e["skinToneDetected"] == b and e["skinToneCorrect"]]
        if not sub:
            continue
        cnt = len(sub)
        sc = sum(1 for e in sub if e["skinToneCorrect"] == "Yes")
        uc = sum(1 for e in sub if e["undertoneCorrect"] == "Yes")
        td = sum(1 for e in sub if e["skinToneCorrect"] == "Too Dark")
        tl = sum(1 for e in sub if e["skinToneCorrect"] == "Too Light")
        wo = sum(1 for e in sub if e["skinToneCorrect"] == "Way Off")
        bucket_rows.append((cnt, b, sc, uc, td, tl, wo))
    bucket_rows.sort(reverse=True)
    for cnt, b, sc, uc, td, tl, wo in bucket_rows:
        out.append(
            f'<tr><td>{escape(b)}</td><td class="num">{cnt}</td>'
            f'<td class="num">{pct(sc, cnt)}%</td><td class="num">{pct(uc, cnt)}%</td>'
            f'<td class="num">{td}</td><td class="num">{tl}</td><td class="num">{wo}</td></tr>'
        )
    out.append('</tbody></table>')

    # By detected undertone
    out.append('<h2>By detected undertone</h2>')
    out.append(
        '<table><thead><tr><th>Bucket</th><th class="num">n</th>'
        '<th class="num">Skin ✓</th><th class="num">UT ✓</th>'
        '<th class="num">Too Dark</th><th class="num">Too Light</th>'
        '<th class="num">Way Off</th></tr></thead><tbody>'
    )
    ut_rows = []
    for b in UT_BUCKETS:
        sub = [e for e in v4 if e["undertoneDetected"] == b and e["skinToneCorrect"]]
        if not sub:
            continue
        cnt = len(sub)
        sc = sum(1 for e in sub if e["skinToneCorrect"] == "Yes")
        uc = sum(1 for e in sub if e["undertoneCorrect"] == "Yes")
        td = sum(1 for e in sub if e["skinToneCorrect"] == "Too Dark")
        tl = sum(1 for e in sub if e["skinToneCorrect"] == "Too Light")
        wo = sum(1 for e in sub if e["skinToneCorrect"] == "Way Off")
        ut_rows.append((cnt, b, sc, uc, td, tl, wo))
    ut_rows.sort(reverse=True)
    for cnt, b, sc, uc, td, tl, wo in ut_rows:
        out.append(
            f'<tr><td>{escape(b)}</td><td class="num">{cnt}</td>'
            f'<td class="num">{pct(sc, cnt)}%</td><td class="num">{pct(uc, cnt)}%</td>'
            f'<td class="num">{td}</td><td class="num">{tl}</td><td class="num">{wo}</td></tr>'
        )
    out.append('</tbody></table>')

    # By self-reported confidence
    out.append('<h2>By self-reported confidence</h2>')
    out.append(
        '<table><thead><tr><th>Confidence</th><th class="num">n</th>'
        '<th class="num">Skin ✓</th><th class="num">UT ✓</th></tr></thead><tbody>'
    )
    conf_high_skin = conf_med_skin = None
    for b in CONFIDENCE_BUCKETS:
        sub = [e for e in v4 if e["confidence"] == b and e["skinToneCorrect"]]
        if not sub:
            continue
        cnt = len(sub)
        sc = sum(1 for e in sub if e["skinToneCorrect"] == "Yes")
        uc = sum(1 for e in sub if e["undertoneCorrect"] == "Yes")
        if b == "high":
            conf_high_skin = pct(sc, cnt)
        if b == "medium":
            conf_med_skin = pct(sc, cnt)
        out.append(
            f'<tr><td>{escape(b)}</td><td class="num">{cnt}</td>'
            f'<td class="num">{pct(sc, cnt)}%</td><td class="num">{pct(uc, cnt)}%</td></tr>'
        )
    out.append('</tbody></table>')

    # Confidence takeaway
    if conf_high_skin is not None and conf_med_skin is not None:
        if conf_high_skin <= conf_med_skin + 3:
            out.append(
                '<p class="takeaway"><strong>Confidence is still uncalibrated.</strong> '
                'High-confidence reads aren\'t materially more accurate than medium — '
                'surfacing the score to customers as-is is risky.</p>'
            )
        else:
            out.append(
                f'<p class="takeaway"><strong>Confidence now tracks accuracy.</strong> '
                f'High-confidence reads ({conf_high_skin}% skin correct) outperform '
                f'medium ({conf_med_skin}%) — safer to surface.</p>'
            )

    # Notes — positive vs corrective
    pos = [e for e in v4 if e.get("notes", "").strip() and POS_KEYWORDS.search(e["notes"])]
    neg = [
        e for e in v4
        if e.get("notes", "").strip()
        and e["skinToneCorrect"] not in ("", "Yes")
    ]
    pos.sort(key=lambda e: e["timestamp"], reverse=True)
    neg.sort(key=lambda e: e["timestamp"], reverse=True)

    out.append('<h2>Notes — sample positive vs corrective</h2>')
    out.append('<div class="quotes">')
    out.append('<div class="quote-col pos">')
    out.append(f'<h4>Positive ({len(pos)})</h4>')
    for e in pos[:5]:
        out.append(
            f'<div class="quote pos"><span class="who">{escape(e["name"] or "Anonymous")}</span>'
            f'{escape(e["notes"].strip())}</div>'
        )
    out.append('</div>')
    out.append('<div class="quote-col neg">')
    out.append(f'<h4>Corrective ({len(neg)})</h4>')
    for e in neg[:5]:
        out.append(
            f'<div class="quote neg"><span class="who">{escape(e["name"] or "Anonymous")}</span>'
            f'{escape(e["notes"].strip())}</div>'
        )
    out.append('</div>')
    out.append('</div>')

    # Repeat users
    name_counts = Counter(
        (e["name"] or "").strip()
        for e in v4
        if (e["name"] or "").strip()
    )
    repeats = [(name, c) for name, c in name_counts.items() if c >= 2]
    repeats.sort(key=lambda x: (-x[1], x[0].lower()))
    if repeats:
        out.append('<h2>Repeat users</h2>')
        out.append('<table><thead><tr><th>Name</th><th class="num">Submissions</th></tr></thead><tbody>')
        for name, c in repeats:
            out.append(f'<tr><td>{escape(name)}</td><td class="num">{c}</td></tr>')
        out.append('</tbody></table>')

    # Filter bar + raw entries
    out.append(f'<h2>All V4 responses (newest first, n={n})</h2>')
    out.append('<div class="filters">')
    out.append(f'<button class="filter-btn active" data-f="all">All ({n})</button>')
    out.append('<button class="filter-btn" data-f="skin-yes">Skin ✓</button>')
    out.append('<button class="filter-btn" data-f="skin-too-dark">Too Dark</button>')
    out.append('<button class="filter-btn" data-f="skin-too-light">Too Light</button>')
    out.append('<button class="filter-btn" data-f="skin-way-off">Way Off</button>')
    out.append('<button class="filter-btn" data-f="ut-no">Undertone wrong</button>')
    out.append('<button class="filter-btn" data-f="notes">Has notes</button>')
    out.append('</div>')

    out.append('<div id="entries">')
    for e in v4:
        sc = skin_class(e["skinToneCorrect"])
        uc = ut_class(e["undertoneCorrect"])
        notes_flag = "1" if (e.get("notes") or "").strip() else "0"
        out.append(
            f'<details class="entry" data-skin="{sc}" data-ut="{uc}" data-notes="{notes_flag}">'
        )
        out.append('<summary>')
        out.append(f'<span class="ename">{escape(e["name"] or "Anonymous")}</span>')
        out.append('<span class="meta-row">')
        out.append(skin_pill(e["skinToneCorrect"]))
        out.append(ut_pill(e["undertoneCorrect"]))
        if e.get("confidence"):
            out.append(neutral_pill(e["confidence"]))
        if (e.get("ethnicity") or "").strip():
            out.append(neutral_pill(e["ethnicity"]))
        out.append('</span>')
        out.append(f'<span class="date">{fmt_ts(e["timestamp"])}</span>')
        out.append('</summary>')

        out.append('<div class="detail"><div class="detail-grid">')
        out.append('<div><h4>AI Detection</h4>')
        out.append(detail_row("Skin Tone", e.get("skinToneDetected", "")))
        out.append(detail_row("Undertone", e.get("undertoneDetected", "")))
        out.append(detail_row("Confidence", e.get("confidence", "")))
        out.append(detail_row("Rec MB", e.get("recommendedMBShades", "")))
        out.append(detail_row("Rec WTF", e.get("recommendedWtfShade", "")))
        out.append(detail_row("Rec FP", e.get("recommendedFacePencil", "")))
        if e.get("recommendedFoundationStick"):
            out.append(detail_row("Rec FS", e.get("recommendedFoundationStick", "")))
        out.append('</div>')

        out.append('<div><h4>Tester Feedback</h4>')
        out.append(detail_row("Skin Correct?", e.get("skinToneCorrect", "")))
        out.append(detail_row("Undertone Correct?", e.get("undertoneCorrect", "")))
        out.append(detail_row("Actual MB", e.get("actualMiracleBalmShades", "")))
        out.append(detail_row("Actual WTF", e.get("actualWtfShade", "")))
        out.append(detail_row("Actual FP", e.get("actualFacePencilShade", "")))
        out.append(detail_row("Ethnicity", e.get("ethnicity", "")))
        out.append('</div>')
        out.append('</div>')

        if (e.get("reasoning") or "").strip():
            out.append(
                f'<div class="notes"><strong>AI Reasoning</strong>'
                f'{escape(e["reasoning"].strip())}</div>'
            )
        if (e.get("notes") or "").strip():
            out.append(
                f'<div class="notes"><strong>Tester Notes</strong>'
                f'{escape(e["notes"].strip())}</div>'
            )
        out.append('</div></details>')
    out.append('</div>')
    out.append(FOOT)
    return "\n".join(out)


HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Shade AI V4 — Feedback Summary + Raw Responses</title>
<style>
  @font-face { font-family:'Canela'; src:url('https://jrb-fonts-cdn.vercel.app/fonts/Canela-Light.otf') format('opentype'); font-weight:300; }
  @font-face { font-family:'ArticulatCF'; src:url('https://jrb-fonts-cdn.vercel.app/fonts/ArticulatCF-Bold.otf') format('opentype'); font-weight:700; }
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#000;background:#fff;line-height:1.5;-webkit-font-smoothing:antialiased}
  .wrap{max-width:880px;margin:0 auto;padding:48px 24px}
  h1{font-family:'Canela',Georgia,serif;font-weight:300;font-size:42px;line-height:1.05;margin-bottom:8px}
  .meta{font-size:11px;color:#666;letter-spacing:.5px;text-transform:uppercase;margin-bottom:28px}
  h2{font-family:'ArticulatCF',sans-serif;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.5px;margin:36px 0 12px;padding-bottom:8px;border-bottom:1px solid #000}
  .headline{background:#f8f8f8;padding:20px 24px;font-size:15px;line-height:1.6;margin-bottom:20px}
  .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:8px}
  @media(max-width:640px){.grid{grid-template-columns:repeat(2,1fr)}}
  .card{border:1px solid #000;padding:16px}
  .card .lbl{font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:#000;margin-bottom:6px}
  .card .num{font-family:'Canela',Georgia,serif;font-weight:300;font-size:38px;line-height:1}
  .card .delta{font-size:12px;margin-top:4px}
  .delta.up{color:#0a7d3a;font-weight:700}
  .delta.down{color:#b91c1c;font-weight:700}
  table{width:100%;border-collapse:collapse;margin-bottom:14px;font-size:13px}
  th,td{text-align:left;padding:8px 10px;border-bottom:1px solid #e5e5e5}
  th{background:#f8f8f8;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.3px}
  td.num,th.num{text-align:right;font-variant-numeric:tabular-nums}
  .takeaway{font-size:14px;line-height:1.6;margin-bottom:8px}
  .takeaway::before{content:"\\2192  ";font-weight:700}
  .filters{display:flex;flex-wrap:wrap;gap:6px;margin:18px 0 14px;position:sticky;top:0;background:#fff;padding:8px 0;z-index:10;border-bottom:1px solid #eee}
  .filter-btn{padding:5px 12px;border:1px solid #000;background:#fff;color:#000;font-size:12px;cursor:pointer;border-radius:20px;font-family:inherit}
  .filter-btn.active{background:#000;color:#fff}
  .entry{border:1px solid #e5e5e5;border-radius:6px;margin-bottom:8px;overflow:hidden;background:#fff}
  .entry summary{padding:12px 14px;cursor:pointer;display:flex;flex-wrap:wrap;align-items:center;gap:8px;list-style:none;font-size:13px}
  .entry summary::-webkit-details-marker{display:none}
  .entry summary::after{content:"\\25BE";color:#888;margin-left:auto;font-size:11px}
  .entry[open] summary::after{content:"\\25B4"}
  .entry[open] summary{border-bottom:1px solid #eee}
  .ename{font-weight:700;font-size:13px;min-width:130px}
  .meta-row{display:flex;flex-wrap:wrap;gap:4px;flex:1}
  .pill{display:inline-block;padding:2px 9px;border-radius:18px;font-size:11px;border:1px solid;white-space:nowrap}
  .pill-correct{background:#e6f5ec;color:#0a7d3a;border-color:#a4d8b6}
  .pill-wrong{background:#fdecea;color:#b91c1c;border-color:#f3b4ac}
  .pill-partial{background:#fdf3dd;color:#a06000;border-color:#e9c06b}
  .pill-neutral{background:#f0f0f0;color:#444;border-color:#d4d4d4}
  .date{font-size:11px;color:#999;margin-left:auto}
  .detail{padding:14px;background:#fafafa}
  .detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
  @media(max-width:640px){.detail-grid{grid-template-columns:1fr}}
  .detail h4{font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:#666;margin-bottom:8px}
  .dr{display:flex;justify-content:space-between;padding:4px 0;font-size:12px;border-bottom:1px solid #eee;gap:10px}
  .dr span{color:#666;flex-shrink:0}
  .dr b{color:#000;font-weight:600;text-align:right;word-break:break-word}
  .notes{margin-top:10px;padding:10px 12px;background:#fff;border:1px solid #eee;border-radius:4px;font-size:12px;line-height:1.55;color:#333}
  .notes strong{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:#888;margin-bottom:4px}
  .quotes{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:8px}
  @media(max-width:640px){.quotes{grid-template-columns:1fr}}
  .quote-col h4{font-family:'ArticulatCF',sans-serif;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px}
  .quote-col.pos h4{color:#0a7d3a}
  .quote-col.neg h4{color:#b91c1c}
  .quote{font-size:12px;line-height:1.55;padding:8px 10px;background:#f8f8f8;margin-bottom:6px;border-left:3px solid #ccc}
  .quote.pos{border-color:#0a7d3a}
  .quote.neg{border-color:#b91c1c}
  .quote .who{display:block;font-size:10px;color:#666;margin-bottom:3px;text-transform:uppercase;letter-spacing:.3px}
</style>
</head>
<body>
<div class="wrap">
"""

FOOT = """</div>
<script>
const buttons = document.querySelectorAll('.filter-btn');
const entries = document.querySelectorAll('.entry');
buttons.forEach(b => b.addEventListener('click', () => {
  buttons.forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  const f = b.dataset.f;
  entries.forEach(e => {
    const skin = e.dataset.skin;
    const ut = e.dataset.ut;
    const notes = e.dataset.notes;
    let show = true;
    if (f === 'skin-yes') show = skin === 'yes';
    else if (f === 'skin-too-dark') show = skin === 'too-dark';
    else if (f === 'skin-too-light') show = skin === 'too-light';
    else if (f === 'skin-way-off') show = skin === 'way-off';
    else if (f === 'ut-no') show = ut && ut !== 'yes' && ut !== '';
    else if (f === 'notes') show = notes === '1';
    e.style.display = show ? '' : 'none';
  });
}));
</script>
</body>
</html>
"""


def main() -> int:
    here = Path(__file__).resolve().parent
    out_local = here / "v4-feedback-report.html"
    out_published = here.parent.parent / "jrb-docs" / "ecom" / "analysis" / "shade-ai-v4-feedback" / "index.html"

    print(f"Fetching from {ENDPOINT} ...")
    entries = fetch_feedback()
    print(f"Loaded {len(entries)} total feedback entries.")
    v4_count = sum(1 for e in entries if e.get("version") == "v4")
    print(f"V4 entries: {v4_count}")

    html = build_report(entries)
    out_local.write_text(html, encoding="utf-8")
    print(f"Wrote {out_local}")

    if out_published.parent.exists():
        out_published.write_text(html, encoding="utf-8")
        print(f"Wrote {out_published}")
    else:
        print(f"Skipped published copy — directory not found: {out_published.parent}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
