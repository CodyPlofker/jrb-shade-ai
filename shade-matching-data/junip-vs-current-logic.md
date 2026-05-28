# Junip Review Data vs Current Shade AI Logic — Full Analysis

## How the Tool Works Today

The AI shade matching tool has **two layers of logic**:

### Layer 1: The System Prompt (route.ts)
When a customer uploads a selfie, it goes to Claude Sonnet 4's vision model with a ~100-line system prompt. That prompt was built from **85+ real CX team shade consultations** over 12 months. It tells the AI:
- How to read skin tone (jawline + forehead, compare face to neck)
- How to handle edge cases (rosacea, olive tones, lighting)
- A **shade-to-product mapping table** that maps each WTF shade to all other products

This is the part that decides: "This person is Light-Medium, Warm undertone."

### Layer 2: The Shade Lookup (shade-data.ts)
Once Claude returns a skin tone + undertone, the code looks up product recommendations in two static tables:
- **`complexionShadesByTone`** — maps each skin tone to a single WTF shade, Face Pencil range, Neutralizer, and Tinted Powder
- **`miracleBalmShades`** — maps each skin tone to MB recommendations by usage (Blush, Bronzer, Highlighter, Tint, Glow)

This is the part that decides: "Light-Medium → WTF Beige, Face Pencil 08-10, Neutralizer Light Peachy Pink."

---

## What We Analyzed

**381,099 total Junip reviews** exported from the admin dashboard.
- 373,669 are product reviews (not store reviews)
- **46,004 have self-reported Skin Tone** (Fair, Light, Light-Medium, Medium, Medium-Dark, Dark, Deep)
- **35,903 of those** are for shade-bearing products (WTF, MB, Face Pencil, Neutralizer, Tinted Powder)
- Also have: Age, Skin Type, Skin Concerns on many reviews

### How the analysis works
For each product, we grouped reviews by:
1. **Customer's self-reported Skin Tone** (from Junip survey field)
2. **The shade they actually purchased** (from product variant)
3. **Their rating** (1-5 stars) and whether they'd recommend

This creates a real-world satisfaction matrix: when a Light-Medium customer buys WTF Beige and rates it 5 stars, that's a validated match. When they rate it 1 star and write "too dark," that's a mismatch signal.

We also text-mined all review bodies for shade-specific language: "too dark," "too light," "too pink," "too orange," "oxidized," "wrong shade," "perfect match," "exchanged for," etc.

---

## What the Data Shows vs What the Tool Currently Says

### What The Foundation (15,973 reviews with skin tone)

| Skin Tone | Current Tool Says | Review Data Says | Divergence? |
|-----------|-------------------|------------------|-------------|
| **Fair** | → Fair | Fair (77% 5★, n=1260) AND Porcelain (77% 5★, n=919) both strong. Alabaster also works (70%). | **Current is correct** but could offer wider range |
| **Light** | → Light | Fair (n=1120), Light (n=1009), and Ivory (n=790) ALL perform similarly (4.4-4.5 avg). Customers spread across 3 shades. | **Tool is too narrow** — many Light customers are happy with Fair or Ivory too |
| **Light-Medium** | → Beige | Beige dominates (n=2966, 73% 5★). Confirmed strongly. | **Current is correct** — Beige is the clear winner |
| **Medium** | → Medium | Beige (n=1324) still gets more reviews than Medium (n=621). Both rate well. Medium Honey (n=569) also strong. | **Tool may be slightly off** — Beige is more popular with Medium skin than expected |
| **Medium-Dark** | → Medium Honey | Medium Honey (n=93, 75% 5★), Honey (n=51, 75%), Golden (n=40, 70%) all work. Pecan has issues (20% low). | **Current is correct** but should flag that Honey and Golden are equal alternatives |
| **Dark** | → Rich | Only 29 reviews with skin tone data. Almond (4.70 avg) and Cinnamon (4.86) outperform Deep (3.17) and Pecan (3.60). | **MAJOR GAP** — "Rich" isn't even a shade name in reviews. Almond/Cinnamon are the winners, Deep is problematic |

**Key WTF finding**: The system prompt mapping table (line 43 in route.ts) maps Dark → "18+" which implies Deep. But review data says Dark-skinned customers are happiest with Almond and Cinnamon, NOT Deep. Deep has 33% low ratings.

---

### Miracle Balm (12,997 reviews with skin tone)

| Skin Tone | Current Tool: Blush | Review Data: Top Blush | Divergence? |
|-----------|--------------------|-----------------------|-------------|
| **Fair** | Flushed | Flushed (4.48, n=293) — but 161 total "too pink" mentions across all tones | **Correct but risky** — Flushed is polarizing |
| **Light** | Flushed | Flushed (4.41, n=367). Miami Beach also strong (4.62, n=141). | **Correct** |
| **Light-Medium** | Flushed | Flushed (4.37, n=397) BUT Pinched Cheeks is higher (4.53, n=451). | **Pinched Cheeks may be better primary** |
| **Medium** | Flushed | Flushed (4.34, n=167), but Pinched Cheeks (4.31, n=204) has more volume. Miami Beach (4.62, n=136) is strongest. | **Miami Beach is the standout** |
| **Dark** | Cheeky | Pinched Cheeks has 40% low ratings (n=5). Cocoa Bronze (4.67) and Sunkissed (4.27) work better. | **Small sample but clear signal against Pinched Cheeks for Dark** |

| Skin Tone | Current Tool: Bronzer | Review Data: Top Bronzer | Divergence? |
|-----------|----------------------|--------------------------|-------------|
| **Fair** | Pinky Bronze | Pinky Bronze (4.29, n=211) — but 116 total "too dark" mentions | **Works for Fair, but flagged as too dark by Light-Medium** |
| **Light** | Bronze | Bronze (4.29, n=118) — fine | **Correct** |
| **Light-Medium** | Sunkissed | Bronze (4.39, n=173), Sunkissed (4.15, n=142). Bronze rates higher. | **Bronze may be better than Sunkissed here** |

| Skin Tone | Current Tool: Highlighter | Review Data | Divergence? |
|-----------|--------------------------|-------------|-------------|
| **Fair** | Happy Hour | Happy Hour has 25% low ratings for Fair. Magic Hour and Golden Hour also struggle. | **Happy Hour is the weakest shade across ALL tones (24-26% low)** |
| **Light** | Magic Hour | Magic Hour (3.82, n=142) — mediocre | **Below average** |

**Key MB findings**:
1. **Happy Hour is consistently weak** — 24-26% low ratings across Fair, Light, Light-Medium. The current tool recommends it as Highlighter for Pale/Fair.
2. **Miami Beach is universally strong** — 79-94% 5-star across ALL skin tones. Currently only recommended as an "Alt" option.
3. **Pinky Bronze gets "too dark" from lighter tones** (116 mentions). Currently recommended as Bronzer for Fair.
4. **Flushed gets "too pink" (161 mentions)** — strongest color signal in the entire dataset.

---

### Face Pencil (3,957 reviews with skin tone)

| Skin Tone | Current Tool: Face Shade | Review Data | Divergence? |
|-----------|--------------------------|-------------|-------------|
| **Fair** | 05 | Shade 01 (n=249) and 02 (n=226) get the most reviews but 01 has 70 "too light" mentions. 05 (n=114) rates well. | **Current is actually better than what customers self-select** |
| **Light** | 07-08 | 02 (n=186), 05 (n=186), 06 (n=178), 04 (n=170) all rate well. Wide spread. | **Customers spread wider than 07-08** |
| **Light-Medium** | 08-10 | 10 (n=296) most popular, 08 (n=268) and 09 (n=145) also strong. 09 has best avg (4.50). | **Current range is correct** but 09 is the satisfaction sweet spot |
| **Medium** | 09-12 | 10 (n=112), 08 (n=70), 13 (n=61) are top. Wide spread from 05-18. | **Current range captures it** |
| **Medium-Dark** | 13-15 | 19 (n=15, 4.60) and 15 (n=12, 4.50) are strongest. 14 (n=8, 5.00). | **Tool should skew higher — 19 outperforms 13** |

---

### Neutralizer Pencil (2,134 reviews with skin tone)

| Skin Tone | Current Tool | Review Data | Divergence? |
|-----------|-------------|-------------|-------------|
| **Fair** | Fair Pink | Fair Pink (4.38, n=319) — confirmed | **Correct** |
| **Light** | Light Peachy Pink | Fair Pink (4.24, n=296) and Light Peachy Pink (4.43, n=167) both work. Light Peach has 24% low ratings. | **Both work but avoid Light Peach** |
| **Light-Medium** | Light Peachy Pink | Light Peachy Pink (4.35, n=387) — confirmed | **Correct** |
| **Medium** | Medium Peachy Pink | Light Peachy Pink (4.36, n=83) still tops Medium Peach (4.14, n=71). | **Customers prefer going lighter than expected** |

---

### Tinted Face Powder (842 reviews with skin tone)

| Skin Tone | Current Tool | Review Data | Divergence? |
|-----------|-------------|-------------|-------------|
| **Medium-Dark** | Medium | Medium (4.69, n=13) confirmed. But Dark has 40% low ratings (n=5). | **Correct for Medium, but Dark shade is problematic** |

---

## Shade Finder / Quiz Feedback

534 reviews explicitly mention the shade finder, shade quiz, or shade matching tool:
- **68% rated 5★** (363 reviews) — the tool works well for most
- **8% rated 1-2★** (46 reviews) — specific failure patterns:
  - Bronze recommended but "too orange"
  - Flushed recommended but "too pink"
  - Au Naturel recommended but "gives no color" (expectation mismatch, not shade mismatch)
  - Face Pencil shade finder vs photo consultation give different recommendations

---

## Summary: Where the Current Logic is Wrong or Weak

### HIGH PRIORITY — Clear Mismatches
1. **WTF for Dark skin**: Current maps to "Rich" → reviews show Almond (4.70) and Cinnamon (4.86) are the winners. Deep (3.17) is a bad recommendation.
2. **MB Happy Hour as Highlighter**: Consistently 24-26% low ratings. Weakest shade in the entire MB range.
3. **MB Pinky Bronze for Fair/Light**: 116 "too dark" mentions. Should not be the primary Bronzer for Fair.
4. **Tinted Powder Dark for Medium-Dark**: 40% low ratings. Medium is much better.

### MEDIUM PRIORITY — Refinements
5. **MB Flushed "too pink" risk**: 161 mentions. Works well for many but should carry a warning — especially for warm undertones.
6. **MB Miami Beach is under-recommended**: Universally strong (79-94% 5★) but only listed as an "Alt."
7. **Face Pencil 01 "too light" for Fair**: 70 mentions. 02 is a better default.
8. **Face Pencil Medium-Dark should skew higher**: 19 outperforms 13-15 in the data.
9. **Neutralizer: Medium customers prefer going lighter** — Light Peachy Pink outperforms Medium Peach.

### LOW PRIORITY — Nice to Have
10. **WTF Light skin has wider spread than expected** — Fair, Light, AND Ivory all work. Could offer multiple options.
11. **WTF Medium skin buys more Beige than Medium** — surprising but may be a preference/familiarity effect.
12. **MB Bronze vs Sunkissed for Light-Medium**: Bronze rates higher but Sunkissed is currently recommended.

---

## How Changes Would Flow Through the System

There are two places where changes would go:

### 1. System Prompt changes (route.ts lines 14-97)
This is the instruction text that tells Claude Vision how to classify skin and what shades to recommend. Changes here affect:
- The shade mapping table (line 33-44)
- The "Critical Nuances" rules (lines 48-73)
- Adding a new "Review-Validated Corrections" section

**Impact**: Changes what the AI recommends for every selfie it analyzes. High impact, but the AI still uses judgment — it's not a hard lookup.

### 2. Shade lookup table changes (shade-data.ts)
This is the hardcoded fallback mapping. Changes here affect:
- `complexionShadesByTone` (lines 321-378) — the single-shade defaults
- `miracleBalmShades` (lines 49-116) — the MB usage recommendations

**Impact**: Changes the actual product cards shown to the user. More mechanical than the prompt — this is the hard output.

### What does NOT change
- The vision model itself (Claude Sonnet 4) — we're not retraining anything
- How the selfie is captured or processed
- The UI/UX of the results page
- The feedback collection system

---

## Proposed Approach

1. Create new branch from `overnight/shade-ai-mvp`
2. Make changes to both files
3. Deploy to a preview URL on Vercel
4. Test with the same selfies on BOTH versions (current vs updated)
5. Compare outputs side-by-side before merging anything
