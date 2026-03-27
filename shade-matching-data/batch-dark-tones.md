# Batch: Dark Tones (Medium-Dark, Dark, Deep)

**Date searched**: 2026-03-27
**Source**: Richpanel CX conversations
**Goal**: Find shade matching consultations for medium-dark through deep skin tones
**Result**: ZERO completed dark-tone shade matching conversations found

---

## Search Summary

### Scope
- **Date range scanned**: Jan 2025 - Mar 2026 (full 15 months)
- **Total conversations scanned**: ~1,200+ across 11+ page batches (100 per page)
- **Pages sampled**: Pages 1-15 across Q1 2025, Q2 2025, Q3 2025, Q4 2025, Q1 2026
- **Tags database**: Scanned all 988 Richpanel tags for shade-specific identifiers

### Search Strategies Attempted
1. **Keyword search on subjects/first messages**: Searched for "dark skin", "brown skin", "deep", "melanin", "african", "latina", "south asian", "olive", "tan", "cocoa", "espresso", "tawny", "golden hour", "caramel", "mocha" -- found zero shade matching requests explicitly mentioning darker skin tones
2. **Dark-shade tag filtering**: Searched all batches for tickets tagged with darker product tags:
   - `cc-wtf-chestnut` (85c9e2fe) -- 0 found
   - `cc-wtf-cinnamon` (59bc0401) -- 0 found
   - `cc-mb-cocoa-bronze` (053fb5c6) -- 0 found
   - `cc-mb-tawny` (cf1b54ef) -- 2 found, but both were product complaints (smell/texture), NOT shade matching
   - `cc-mb-golden-hour` (09ab4c85) -- 0 found
   - `cc-face-pencil-shade-13` through `shade-18` -- 0 found
   - `shadematchingteam` (735a10a4) -- 4 found, but all were light/fair recommendations or incomplete consults
3. **Full conversation reads**: Pulled and read ~25 full shade matching conversations to check agent-recommended shades. Every single completed consult recommended Fair, Porcelain, Light, Ivory, Beige, or Medium Honey at the darkest. Face Pencil shades never exceeded 10.
4. **Broader shade match scanning**: Identified 50+ "shade match" tagged tickets across all batches. Spot-checked many -- all were fair/light/medium recommendations.

### Key Finding
**The Richpanel shade matching conversation dataset contains virtually no dark-tone consultations.** This is not a search limitation -- it reflects the actual customer base reaching out for shade help via email/chat. The JRB shade matching email channel is overwhelmingly used by fair-to-medium skin tone customers.

### Darkest Shade Recommendations Found (Still Not Medium-Dark+)
| Ticket | Date | WTF/JETM Shade | Face Pencil | MB Shade | Notes |
|--------|------|----------------|-------------|----------|-------|
| #424021 | 2026-03-26 | Medium Honey | -- | -- | Customer nervous it might be "too dark" -- agent confirmed Medium Honey |
| #423906 | 2026-03-26 | Beige | 10 / 9 | -- | "Dark circles" mention was about under-eye, not skin tone |
| #221314 | 2025-03-30 | Beige | 10 / 09 | -- | Used Estee Lauder 3W1 Tawny (medium shade cross-reference) |

### Why Dark-Tone Data Is Missing from Richpanel
1. **Customer demographics**: JRB's core audience skews 65+ and fair-skinned (confirmed by Tracksuit brand health data)
2. **Channel bias**: Darker-skinned customers may be less likely to use the email shade matching service, possibly preferring in-store consults at JRB retail locations or the online quiz
3. **Product awareness gap**: Customers with darker skin tones may not know JRB carries shades like Rich, Deep, Warm Deep, Cool Deep, Espresso, Chestnut, Cinnamon
4. **Self-selection**: The quiz funnels most customers before they email -- those who email are often quiz failures or edge cases, which skew light

### Recommended Alternative Data Sources for Dark-Tone Training Data
1. **In-store POS data**: Match Shopify orders for WTF in Rich/Deep/Warm Deep/Cool Deep/Espresso/Chestnut/Cinnamon with any associated shade consult notes from retail staff
2. **Quiz completion data**: Filter quiz results that land on darker shades -- the quiz sees far more diverse traffic than email support
3. **Synthetic/expert-generated data**: Have JRB makeup artists create reference shade matching examples for darker skin tones based on their professional expertise
4. **Review mining**: Search product reviews on jonesroadbeauty.com for WTF Rich, Deep, Chestnut, Cinnamon -- customers who self-selected these shades often describe their skin tone
5. **Social media**: Instagram comments/DMs on JRB posts featuring diverse models may contain shade matching discussions

### Tags That EXIST But Had Zero Matching Conversations (in 1,200+ scanned)
These tags exist in the system, confirming the products/shades are real, but no conversations in our scan carried them:
- `cc-face-pencil-shade-13` (ca11ba01)
- `cc-face-pencil-shade-14` (4fc97eb3)
- `cc-face-pencil-shade-18` (cc958cee)
- `cc-face-pencil-shade-11` (a09ce8da)
- `cc-face-pencil-shade-12` (cc4d9140)
- `cc-wtf-chestnut` (85c9e2fe)
- `cc-wtf-cinnamon` (59bc0401)
- `cc-mb-cocoa-bronze` (053fb5c6)
- `cc-mb-golden-hour` (09ab4c85)
- `cc-tinted-face-powder-dark` (81209b64)
- `cc-gel-bronzer-dark` (909db32d)

---

## Extracted Training Data

**Count: 0 usable dark-tone shade matching conversations**

This file will be updated if future searches or alternative data sources yield results.
