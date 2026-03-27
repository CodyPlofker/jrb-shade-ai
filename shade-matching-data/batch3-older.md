# Batch 3 — Older Shade Matching Conversations (Feb 15 – Mar 15 2026)

> **Source**: Richpanel closed tickets, Feb 15 – Mar 15 2026
> **Extracted**: 2026-03-27
> **Total shade-related tickets scanned**: 93 across 500 closed tickets (pages 1-5, 10, 20, 30, 40)
> **Full conversations pulled**: 15

## IMPORTANT NOTE ON SKIN TONE DIVERSITY

This batch, like batches 1 and 2, is **heavily skewed toward fair/light skin tones**. Despite deliberately targeting tickets mentioning darker shades (Tawny, Cocoa Bronze, etc.), olive undertones, and "too light" complaints, the overwhelming majority of shade-match requests come from fair-to-light-medium customers.

**Skin tone distribution in this batch:**
- Porcelain/Alabaster: 1 ticket
- Fair: 5 tickets
- Fair-to-Light: 2 tickets
- Light: 2 tickets
- Beige (light-medium): 4 tickets
- Medium (Tawny user): 1 ticket (Elzbieta — #419105)
- Medium-dark / Dark / Deep: **0 tickets with full recommendations found**

This likely reflects the actual JRB customer base demographics (skews 65+, fair skin) rather than a sampling error. To get medium-dark/dark training data, we may need to:
1. Search a much larger date range (6+ months)
2. Specifically search for shade names like "Tawny", "Cocoa Bronze", "Rich", "Deep" in agent responses
3. Consider creating synthetic training data based on JRB shade knowledge

---

## Summary Table

| # | Ticket | Date | Customer | Skin Tone Est. | WTF/JETM | Face Pencil | Neutralizer | Miracle Balm | Other Products | Special Notes | Photos |
|---|--------|------|----------|----------------|-----------|-------------|-------------|--------------|----------------|---------------|--------|
| 1 | 419105 | 2026-03-13 | Elzbieta S. | Medium (warm) | Beige | (not in initial resp) | — | Tawny (existing), Rouge (existing) | Complexion Set | Tawny user — highest skin tone in batch. From Poland. Agent asked for better lighting photo. | Yes (6 photos) |
| 2 | 414666 | 2026-03-03 | Sherry W. | Light-Medium | Ivory | Shade 06 (face), Shade 05 (undereye) | Fair Pink, Fair Peach | Au Naturel, Dusty Rose (glow), Chic (blush), Bronze (bronzing), Golden Hour (highlight) | — | Ordered "too light" products initially. Rosacea concerns. Age 46. Undereye issues. Ivory still didn't match — agent suggested mixing shades. | Yes (1 photo) |
| 3 | 419637 | 2026-03-14 | Sharon M. | Light-Medium | Beige | Shade 04, Shade 09 | — | Pink Champagne (owned), Happy Hour (owned), Chic (owned), Flushed (owned), Pinky Bronze, Dusty Rose | JETM in Beige (to mix with Ivory) | Age 62. Normally tanner but was indoors due to orthopedic issues. Uses Ivory JETM currently. Agent suggested Shade 09 for when she gets tanner. | Yes (1 photo) |
| 4 | 419336 | 2026-03-14 | Pilar G. | Medium (olive) | — | — | — | Dusty Rose, Flushed, Pinky Bronze | — | Self-identified olive undertone. Hates bronzers that turn orange. Only got MB recs, not foundation/pencils. | Yes (1 photo via widget) |
| 5 | 419585 | 2026-03-14 | Cindy B. | Light | Light | Shade 08 (face), Shade 04 (undereye) | Light Peachy Pink, Light Peach | Au Naturel/Dusty Rose (glow), Flushed (blush), Sunkissed (bronzing), Magic Hour (highlighting) | Everyday Sunscreen: Sandy. Tinted Face Powder: Light. Bronzer: Light Tan. Gel Bronzer: Light. Best Blush: Pop. Eyeshadow Stick: Taupe, Toffee. Best Eyeshadow: Chic (matte), Champagne (shimmer). Lippie Stick: Pink Nude. | Rosacea, sensitive skin. Hazel/brown eyes. Wanted long-lasting formulas for work. Very comprehensive recs — full face + eyes + lips + skin. | Yes (1 photo) |
| 6 | 419200 | 2026-03-13 | Jessica B. | Fair (very) | Porcelain | Shade 02 (face + undereye) | Fair Pink | Dusty Rose (blush) | Lippie Sticks: Pink Nude, Flushed, ME | Wanted full color match for eyes, face pencils, WTF, cheeks, lips. | Yes (1 photo) |
| 7 | 419167 | 2026-03-13 | Lisa R. | Light-Medium | — | — | — | Au Naturel/Dusty Rose (glow), Chic (blush), Bronze (bronzing), Golden Hour (highlighting) | — | Only wanted MB recs. Does not like shimmer. MB-only recommendation with no-shimmer preference addressed (Au Naturel, Chic are shimmer-free). | Yes (1 photo) |
| 8 | 419149 | 2026-03-13 | Susan R. | Light-Medium | Beige | — | — | Dusty Rose, Flushed, Pinky Bronze | Eye Cream, Spatula | Sallow skin. Has been using "yellow tint" products. Previous shade match customer returning for new suggestions. From Rhode Island. | Yes (1 photo) |
| 9 | 419092 | 2026-03-13 | Sarah W. | Fair | Fair | Shade 05 (face), Shade 02 (undereye) | Fair Pink | Dusty Rose, Flushed, Pinky Bronze | Tinted Face Powder: Light. Best Blush: Sandy. Eyeshadow Stick: Cream, Taupe, Brown (matte). | Wanted WTF, MB, Face Pencil, Neutralizer, Best Blush, Eyeshadow Stick recs. Very comprehensive response. Customer rated "Amazing". | Yes (1 photo) |
| 10 | 419634 | 2026-03-14 | Linnea L. | Light-Medium | Beige | — | — | — | Tinted Face Powder: Light | Only asked for foundation shade. Got Beige WTF rec + powder suggestion. | Yes (1 photo) |
| 11 | 418492 | 2026-03-12 | Elianne B. | Fair | Fair | Shade 05 (face), Shade 04 (undereye) | Fair Pink, Fair Peach | (standard recs in full response) | (comprehensive response saved to file) | Canadian customer. Wanted natural look + undereye lightener. | Yes (1 photo) |
| 12 | 418433 | 2026-03-11 | Elizabeth S. | Fair | Fair | — | — | — | — | Photo only — no text in initial message. Agent recommended Fair WTF/JETM. Asked customer to send photo without glasses for undereye recs. | Yes (1 photo) |
| 13 | 419576 | 2026-03-14 | Anne Marie F. | Very Fair | Fair (didn't work), wants Porcelain | — | — | — | — | Fair JETM was too dark. Wanted Porcelain but it was out of stock. Return/exchange only — no shade match recs given. | No |
| 14 | 417359 | 2026-03-09 | Nicole (Australia) | Medium (BB Natural Tan) | — | — | — | — | — | Said she's "Natural Tan" in Bobbi Brown (medium skin). Agent asked for photo — no follow-up photo received. Tagged as shade-match but no recs given. | No |
| 15 | 419230 | 2026-03-13 | Suzanne M. | Light | Light (ordered, too dark) | — | — | — | — | Ordered Light WTF, wanted lighter. Return/exchange only. | Yes (2 photos) |

---

## Detailed Conversation Extracts

### 1. Elzbieta S. (#419105) — MEDIUM SKIN, Tawny MB user
**Date**: 2026-03-13 | **Subject**: The Complexion Set

**Customer Context**:
- Loves Miracle Balm in **Tawny** and **Rouge** — both look great on her skin
- Wants Complexion Set shade recs (Face Pencil + WTF)
- Also wants a Miracle Balm for blush use
- Sent 6 photos including bare skin and photos wearing Tawny/Rouge
- From Poland (international customer)

**Agent Recommendations (Sabrina)**:
- WTF: **Beige**
- *(Agent initially asked for better-lit photo, then gave Beige rec on follow-up photo)*
- *(Full Face Pencil recs were in the complete agent response but truncated in the extract)*

**Customer Photos**:
- https://richpanel-data.s3.us-west-2.amazonaws.com/MessengerAttachments/d07e59f3-220d-4b1f-9e01-3e46acc2584e/image0.jpeg
- https://richpanel-data.s3.us-west-2.amazonaws.com/MessengerAttachments/a4b821ce-a371-4d49-97dc-41671f6df0b1/image1.jpeg
- https://richpanel-data.s3.us-west-2.amazonaws.com/MessengerAttachments/cbc9d0bb-b2fa-4ae4-bf66-e14db2508698/image2.jpeg
- https://richpanel-data.s3.us-west-2.amazonaws.com/MessengerAttachments/0b50971b-9361-4e0b-b395-443a2e96eb6a/image3.jpeg
- https://richpanel-data.s3.us-west-2.amazonaws.com/MessengerAttachments/4fdae6b3-37c4-4545-aaa2-a518bf579e15/image4.jpeg
- https://richpanel-data.s3.us-west-2.amazonaws.com/MessengerAttachments/78083b33-668e-41f0-b95b-a0b935929b58/image0.jpeg (follow-up natural light)

**Training Value**: HIGH — Only medium-skin customer in batch. Tawny MB user. Shows how Beige WTF maps to medium skin.

---

### 2. Sherry W. (#414666) — LIGHT-MEDIUM, Rosacea
**Date**: 2026-03-03 | **Subject**: Color & return

**Customer Context**:
- Age 46. Products ordered were "too light."
- Concerned next shade up with her undertone would be too dark
- Wanted application tutorials, especially for undereye issues
- Later reported Ivory WTF also didn't match — asked about mixing shades

**Agent Recommendations (Samantha)**:
- WTF or JETM: **Ivory**
- Face Pencil: **Shade 06** (face), **Shade 05** (undereye)
- Neutralizer Pencil: **Fair Pink** (for blue/purple/red), **Fair Peach** (for green/grey/brown)
- Miracle Balm: **Au Naturel** or **Dusty Rose** (glow), **Chic** (blush), **Bronze** (bronzing), **Golden Hour** (highlighting)
- Tinted Face Powder: **Untinted** (for longevity/shine control)

**Follow-up**: Customer said Ivory was still not right. Agent suggested mixing shades and using Untinted powder.

**Customer Photo**:
- https://richpanel-data.s3.us-west-2.amazonaws.com/MessengerAttachments/45305257-9609-4726-b6e0-265a197ca088/1000016954.jpg

**Training Value**: HIGH — Shows the difficulty of shade matching with rosacea. Demonstrates the "face darker than neck" problem. Multi-product recs. Follow-up correction data.

---

### 3. Sharon M. (#419637) — LIGHT-MEDIUM, Seasonal tanner
**Date**: 2026-03-14 | **Subject**: Please help me find my shades.

**Customer Context**:
- Age 62. Lives in South Carolina.
- Normally tanner but had orthopedic issues preventing sun exposure
- Currently uses Ivory JETM (thinks it might be too light)
- Owns Mini MBs: Pink Champagne, Happy Hour, Chic, Flushed
- Wants pencil and WTF recs most

**Agent Recommendations**:
- JETM: **Beige** (to mix with existing Ivory for custom match)
- WTF: **Beige**
- Face Pencil: **Shade 04** (current), **Shade 09** (for when tanner)
- Miracle Balm: **Pinky Bronze** or **Dusty Rose** (fresh blush options)

**Customer Photo**:
- https://richpanel-data.s3.us-west-2.amazonaws.com/MessengerAttachments/4a12e351-db3e-4b7c-80aa-1647a542e7d1/20260108_103426.jpg

**Training Value**: HIGH — Shows shade range consideration for seasonal tanners. Agent provided two pencil shades for different times of year. Mixing shades strategy.

---

### 4. Pilar G. (#419336) — MEDIUM, Olive undertone
**Date**: 2026-03-14 | **Subject**: Find my shade

**Customer Context**:
- Self-identified olive subtone
- Hates most bronzer brands because they turn orange
- Wants bronzer, tint, blush recs

**Agent Recommendations**:
- Miracle Balm: **Dusty Rose**, **Flushed**, or **Pinky Bronze**
- *(No foundation/pencil recs given — only MB)*

**Customer Photo**:
- https://richpanel-data.s3.us-west-2.amazonaws.com/MessengerAttachments/0b836d7b-93f9-4bb2-bec4-8b8d3ede712e/IMG_6142.jpeg
- (Also via widget): MessengerAttachments/21ad372c-6de3-4c8c-bd48-320841e759c1/IMG_6142.jpeg

**Training Value**: MEDIUM — Olive undertone data point. Shows that orange-avoidant customers get cooler/pinker MB recs. Missing foundation recs limits utility.

---

### 5. Cindy B. (#419585) — LIGHT, Rosacea + Sensitive Skin
**Date**: 2026-03-14 | **Subject**: Request for Match by Makeup Artist

**Customer Context**:
- Rosacea, sensitive skin
- Hazel/brown eyes
- Works (needs long-lasting formulas)
- Wanted: foundation, face + neutralizer pencils, eye makeup (new eyeshadow sticks), liner

**Agent Recommendations (full face)**:
- WTF or JETM: **Light**
- Face Pencil: **Shade 08** (face), **Shade 04** (undereye)
- Neutralizer Pencil: **Light Peachy Pink** (blue/purple/red), **Light Peach** (green/grey/brown)
- Miracle Balm: **Au Naturel/Dusty Rose** (glow), **Flushed** (blush), **Sunkissed** (bronzing), **Magic Hour** (highlighting)
- Everyday Sunscreen: **Sandy**
- Tinted Face Powder: **Light**
- Bronzer: **Light Tan**
- Gel Bronzer: **Light**
- Best Blush: **Pop**
- Shimmer Face Oil: **Midas**
- Eyeshadow Stick: **Taupe**, **Toffee**
- Best Eyeshadow: **Chic** (matte), **Champagne** (shimmer)
- Best Pencil: **Brown**
- Gel Liner: **Violet**
- Just a Sec: **Linen**
- Sparkle Wash: **Barely Pink**
- Lippie Stick: **Pink Nude**
- Lip Pencil / Classic Lip: **Nude Pink**

**Customer Photo**:
- https://richpanel-data.s3.us-west-2.amazonaws.com/MessengerAttachments/cc00eff0-8754-418b-84c2-067bd32633e3/IMG_7011.jpeg

**Training Value**: VERY HIGH — Most comprehensive shade match in entire batch. Full product lineup across every category. Light skin with rosacea. Great for training complete recommendation flows.

---

### 6. Jessica B. (#419200) — VERY FAIR
**Date**: 2026-03-13 | **Subject**: Make Up Free Selfie

**Customer Context**:
- Wanted color match for eyes, face pencils, WTF, cheeks, and lips

**Agent Recommendations (Sabrina)**:
- WTF: **Porcelain**
- Face Pencil: **Shade 02** (face + undereye)
- Neutralizer Pencil: **Fair Pink**
- Miracle Balm: **Dusty Rose** (glowy blush)
- Lippie Sticks: **Pink Nude**, **Flushed**, **ME**

**Customer Photo**:
- https://richpanel-data.s3.us-west-2.amazonaws.com/MessengerAttachments/f7dc591e-922b-43f3-b044-92f77ee3563a/image0.jpeg

**Training Value**: MEDIUM — Porcelain is the lightest shade. Simple, clean recs.

---

### 7. Lisa R. (#419167) — LIGHT-MEDIUM (MB only)
**Date**: 2026-03-13 | **Subject**: Selfie

**Customer Context**:
- Only wants Miracle Balm shade
- Does NOT like shimmer

**Agent Recommendations**:
- Miracle Balm: **Au Naturel/Dusty Rose** (glow), **Chic** (blush), **Bronze** (bronzing), **Golden Hour** (highlighting)

**Notes**: Agent described each shade including shimmer level. Au Naturel is shimmer-free. Chic is buildable, shimmer-free. Bronze and Golden Hour have shimmer but are described for specific use cases.

**Customer Photo**:
- https://richpanel-data.s3.us-west-2.amazonaws.com/MessengerAttachments/8bb6c9fa-fdca-4a29-b8f2-8be2311f6a9b/image0.png

**Training Value**: MEDIUM — Shows shimmer-preference-based recommendations. MB-only matching.

---

### 8. Susan R. (#419149) — LIGHT-MEDIUM, Sallow skin
**Date**: 2026-03-13 | **Subject**: photo of me for shades

**Customer Context**:
- Sallow skin, has been using "yellow tint" products
- Previous shade match customer — already has products
- Wants to know if she should try something new or stick with current shades
- From Rhode Island

**Agent Recommendations**:
- WTF: **Beige**
- Miracle Balm: **Dusty Rose**, **Flushed**, or **Pinky Bronze**

**Customer Photo**:
- https://richpanel-data.s3.us-west-2.amazonaws.com/MessengerAttachments/ad1632ce-afc0-4988-bf0b-5369dc37e03e/IMG_5999.jpeg

**Training Value**: MEDIUM — Sallow skin consideration. Repeat customer shade re-evaluation.

---

### 9. Sarah W. (#419092) — FAIR
**Date**: 2026-03-13 | **Subject**: Shade recommendations

**Customer Context**:
- Wanted: WTF, Miracle Balm, Face Pencil, Neutralizer, Best Blush, Eyeshadow Stick

**Agent Recommendations**:
- WTF or JETM: **Fair**
- Face Pencil: **Shade 05** (face), **Shade 02** (undereye)
- Neutralizer Pencil: **Fair Pink**
- Miracle Balm: **Dusty Rose**, **Flushed**, **Pinky Bronze**
- Tinted Face Powder: **Light**
- Best Blush: **Sandy**
- Eyeshadow Stick: **Cream**, **Taupe**, **Brown** (matte)

**Customer Photo**:
- https://richpanel-data.s3.us-west-2.amazonaws.com/MessengerAttachments/88931314-b9f6-4646-80b4-c0385b43e658/IMG_9384.jpeg

**Customer Satisfaction**: AMAZING ("I appreciate the detailed recommendations!")

**Training Value**: HIGH — Complete multi-product match. Customer satisfaction confirmed. Fair skin with comprehensive recs including eyeshadow sticks.

---

### 10. Linnea L. (#419634) — LIGHT-MEDIUM
**Date**: 2026-03-14 | **Subject**: Best Foundation Shade

**Customer Context**:
- Simple request — just wants best foundation shade

**Agent Recommendations**:
- WTF: **Beige**
- Tinted Face Powder: **Light**

**Customer Photo**:
- https://richpanel-data.s3.us-west-2.amazonaws.com/MessengerAttachments/1c8d542d-9d65-40e6-9cc9-8da226285a75/Image-1.jpeg

**Training Value**: LOW — Foundation-only rec, minimal context.

---

### 11. Elianne B. (#418492) — FAIR
**Date**: 2026-03-12 | **Subject**: Shade Matching Request

**Customer Context**:
- Wants natural look + undereye lightener
- Canadian customer

**Agent Recommendations**:
- WTF or JETM: **Fair**
- Face Pencil: **Shade 05** (face), **Shade 04** (undereye)
- Neutralizer Pencil: **Fair Pink** (blue/purple/red), **Fair Peach** (green/grey/brown)
- *(Full MB recs in response)*

**Customer Photo**:
- https://richpanel-data.s3.us-west-2.amazonaws.com/MessengerAttachments/52c452f9-1066-48e5-8d01-9d7a7f411cfe/E893A4A4-1337-446F-8C7E-C448B476FF13.png

**Training Value**: MEDIUM — Standard fair skin match.

---

### 12. Elizabeth S. (#418433) — FAIR
**Date**: 2026-03-11 | **Subject**: Recommend correct shade

**Customer Context**:
- Photo only, no text
- Wearing glasses in photo

**Agent Recommendations (Sabrina)**:
- WTF or JETM: **Fair**
- *(Agent asked for photo without glasses for undereye recs)*

**Follow-up**: Customer confused about "Fair" having multiple shades on website. Agent clarified there is only one Fair shade per product.

**Customer Photo**:
- https://richpanel-data.s3.us-west-2.amazonaws.com/MessengerAttachments/50a9fa53-620c-4da7-9930-6267b280a806/IMG_5521.jpeg

**Training Value**: LOW — Minimal recs, but shows common customer confusion about shade naming on website.

---

## Shade Mapping Patterns Observed

### WTF / JETM Shade Distribution
| Shade | Count | Approx. Skin Tone |
|-------|-------|--------------------|
| Porcelain | 1 | Very fair, cool |
| Fair | 5 | Fair, pink/neutral undertones |
| Ivory | 1 | Light, neutral/warm (didn't work for customer — too light for some, too dark for others) |
| Light | 2 | Light with some warmth or redness |
| Beige | 4 | Light-medium, warm/neutral |
| Medium Honey | 0 (searched, not found in recs) | Medium |
| Tan | 0 | Medium-tan |
| Tawny | 0 (customer already owned MB in Tawny, but WTF rec was Beige) | — |

### Face Pencil Mapping
| WTF Shade | Face Pencil (Face) | Face Pencil (Undereye) |
|-----------|-------------------|----------------------|
| Porcelain | Shade 02 | Shade 02 |
| Fair | Shade 05 | Shade 02 or 04 |
| Light | Shade 08 | Shade 04 |
| Ivory | Shade 06 | Shade 05 |
| Beige | Shade 04, or 04+09 (seasonal) | — |

### Neutralizer Pencil Mapping
| WTF Shade | Neutralizer |
|-----------|-------------|
| Porcelain | Fair Pink |
| Fair | Fair Pink, Fair Peach |
| Light | Light Peachy Pink, Light Peach |
| Ivory | Fair Pink, Fair Peach |

### Miracle Balm Patterns (by skin tone)
| Skin Tone | Glow/All-over | Blush | Bronzer | Highlighter |
|-----------|--------------|-------|---------|-------------|
| Very Fair (Porcelain) | Dusty Rose | Dusty Rose | — | — |
| Fair | Dusty Rose, Au Naturel | Flushed, Pinky Bronze | — | — |
| Light | Au Naturel, Dusty Rose | Flushed, Chic | Sunkissed | Magic Hour |
| Light-Medium | Dusty Rose, Au Naturel | Chic, Flushed, Pinky Bronze | Bronze | Golden Hour |
| Medium (olive) | Dusty Rose | Flushed, Pinky Bronze | — | — |
| Medium (warm, Tawny user) | Tawny (owned) | Rouge (owned) | — | — |

---

## Key Observations for AI Training

### 1. Rosacea Handling
Two customers had rosacea (Sherry #414666, Cindy #419585). Key patterns:
- Rosacea customers often have faces darker/redder than their neck
- Agent recommends matching to neck/chest rather than face redness
- Neutralizer Pencils (pink/peach variants) are heavily recommended for redness concealment
- Sunkissed MB is described as "neutralizes redness" — good for light-skin rosacea

### 2. Seasonal Shade Variation
Sharon M. (#419637) demonstrates the seasonal tanning pattern:
- Agent provided TWO Face Pencil shades (04 now, 09 for summer)
- Suggested mixing JETM shades (Ivory + Beige) for custom match
- This is a common pattern the AI should learn to handle

### 3. Shimmer Preferences
Lisa R. (#419167) specifically said "no shimmer." Agent response:
- Led with Au Naturel (shimmer-free) and Chic (shimmer-free)
- Still mentioned Bronze and Golden Hour but as secondary options with shimmer caveat
- AI should ask about shimmer preference early in the flow

### 4. Agent Response Templates
Agents use consistent response templates across tickets:
- Core products first (WTF/JETM, Face Pencil, Neutralizer)
- Then Miracle Balm shades by use case (glow, blush, bronzer, highlight)
- Then application tips (WTF application, pencil layering order, MB break-the-seal)
- Then additional product suggestions
- The AI should follow this same flow

### 5. Missing Data: Medium-Dark to Deep Skin Tones
Across all 93 shade-related tickets scanned (covering March 3-14, 2026):
- **Zero tickets** had agent recommendations for shades above Beige in the WTF/JETM range
- **Zero mentions** of Cocoa Bronze, Deep, Rich, or Espresso Miracle Balm shades
- The only medium-skin data point was Elzbieta (Tawny MB user → Beige WTF)
- Nicole from Australia (BB Natural Tan) never sent a follow-up photo

This is a critical gap. The JRB shade range extends well beyond Beige (Medium Honey → Honey → Tan → Rich → Deep), and there are MB shades specifically for darker skin (Tawny, Cocoa Bronze). We need to either find this data in a much larger historical search or build it from product knowledge.
