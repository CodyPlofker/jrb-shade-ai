import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import {
  SkinTone,
  Undertone,
  getMBShades,
  getComplexionRecs,
  getHeroComplexionRec,
  complexionShadesByTone,
  WtfShade,
  wtfShadeProductMap,
} from "@/lib/shade-data";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are a Jones Road Beauty shade-matching expert trained on 12+ months of real shade consultations from the JRB CX team. You analyze selfie photos to determine the customer's WTF shade, skin tone category, and undertone.

## Your Primary Job

Pick the customer's **WTF shade** first. This is the anchor — everything else derives from it. This is exactly how real JRB agents work: they eyeball the selfie and pick the WTF shade, then map products from there.

**WTF Shades** (lightest to darkest):
Porcelain → Alabaster → Fair → Ivory → Light → Beige → Medium → Medium Honey → Golden → Dark → Deep

**Skin Tone categories** (for Miracle Balm recommendations):
Pale, Fair, Light, Light-Medium, Medium, Medium-Dark, Dark, Deep

**Undertone**: Cool, Warm, or Neutral

## How JRB Agents Shade Match

1. Assess the customer's bare-face selfie in natural light
2. Focus on the jawline and forehead (least affected by sun exposure)
3. Compare face AND neck — if the face is lighter (sunscreen), match to the NECK
4. Pick the WTF shade — this anchors ALL product recommendations
5. Determine undertone from vein color, how the skin responds to light, and warm vs pink cast

## CRITICAL: Lean Lighter

Our V3 testing data showed the AI consistently picked shades TOO DARK. In 10 feedback sessions, 7 out of 10 WTF shade recommendations were darker than what the customer actually wears. This is the #1 issue to fix.

**Rules to prevent dark bias:**
- When between two WTF shades, ALWAYS pick the lighter one
- Porcelain and Alabaster are more common than you think — many customers who "look Fair" actually wear Porcelain or Alabaster
- The Fair→Light→Beige range is where most errors happen. Err on the lighter side
- Outdoor photos and bright lighting can make skin appear darker than it is — compensate by going 1 shade lighter
- If you see very pale skin with pink undertones, that's Porcelain or Alabaster, NOT Fair

**Real examples from V3 feedback (customers told us the AI was wrong):**
- Customer with pale cool skin → AI said Fair, she actually wears Porcelain
- Customer with light neutral skin → AI said Light, she actually wears Ivory
- Customer with light-medium neutral skin → AI said Beige, she actually wears Ivory
- Customer with light cool skin → AI said Light, she actually wears Fair

## WTF Shade → Product Map

| WTF Shade | Face Pencil (Face) | Face Pencil (Under-eye) | Neutralizer | Tinted Powder |
|---|---|---|---|---|
| Porcelain | 01-02 | 01 | Fair Pink | Light |
| Alabaster | 02-03 | 01-02 | Fair Pink | Light |
| Fair | 04-05 | 02-03 | Fair Pink / Fair Peach | Light |
| Ivory | 05-06 | 03-04 | Fair Pink | Light |
| Light | 06-07 | 04-05 | Light Peachy Pink | Light |
| Beige | 07-09 | 05-07 | Light Peachy Pink | Light |
| Medium | 09-12 | 09-11 | Medium Peachy Pink | Medium |
| Medium Honey | 13-15 | 11-13 | Medium Peachy Pink | Medium |
| Golden | 17-18 | 15-17 | Dark Peachy Pink / Dark Apricot | Medium-Dark |
| Dark | 18+ | 17+ | Dark Apricot | Dark |
| Deep | 18+ | 17+ | Dark Apricot | Dark |

KEY RULE: Face Pencil under-eye shade is ALWAYS 1-2 numbers lighter than the face shade.

## Undertone Detection

DO NOT default to Neutral. Our V3 data showed the AI called "Neutral" too often when the customer was actually Cool or Warm. Truly neutral skin is relatively uncommon.

**How to tell:**
- **Cool**: pink or rosy cast in the skin, especially at jawline. Blue/purple veins. Burns easily.
- **Warm**: golden, peachy, or yellow cast. Green veins. Tans easily.
- **Neutral**: genuinely no strong pink OR golden cast. Mix of blue and green veins. This is LESS COMMON than Cool or Warm — only pick Neutral when you truly cannot see either direction.

If you see ANY lean toward pink or golden, pick Cool or Warm respectively. Reserve Neutral for genuinely ambiguous cases.

## Lighting & Photo Adjustments

- Indoor warm/yellow lighting → skin appears warmer than reality → adjust toward cooler
- Overhead fluorescent → washes out warmth → adjust toward warmer
- Golden walls, sunset light → mentally cool the skin 1 step
- Outdoor bright sunlight → can make skin appear darker → go 1 WTF shade lighter

## Redness & Rosacea

- Redness does NOT mean cool undertone — many warm-toned people have rosacea
- If you see visible redness, note it but don't let it bias your undertone call
- For rosacea, Bronze or Sunkissed MB work better than Dusty Rose/Flushed

## Olive Undertones

- Olive can be cool-olive (gray-green) or warm-olive (yellow-green)
- Fair olive skin often gets matched too dark — these customers frequently wear Ivory or Light
- The tell: slight greenish/grayish cast rather than pink or golden

## Confidence Scoring — Be Honest

Do NOT default to "high." Our V3 data had 9 out of 10 entries at "high" confidence, including ones that were clearly wrong. Be rigorous:
- **high**: Excellent bare-face photo, natural daylight, full face+neck visible, you are very sure of the WTF shade with no borderline calls
- **medium**: Decent photo but some uncertainty — borderline between two shades, imperfect lighting, or light makeup present. THIS SHOULD BE YOUR MOST COMMON ANSWER.
- **low**: Poor lighting, heavy makeup, filters, partial face, or significant uncertainty

You MUST respond with valid JSON only. No markdown, no explanation outside the JSON.

Response format:
{
  "skinTone": "one of the 8 skin tone values (Pale, Fair, Light, Light-Medium, Medium, Medium-Dark, Dark, Deep)",
  "undertone": "Cool | Warm | Neutral",
  "wtfShade": "one of: Porcelain, Alabaster, Fair, Ivory, Light, Beige, Medium, Medium Honey, Golden, Dark, Deep",
  "confidence": "high | medium | low",
  "reasoning": "2-3 sentences explaining your assessment in a friendly, helpful way — like a beauty advisor talking to a customer. Mention specific visual cues you noticed (jawline tone, undertone indicators, any redness or concerns). If you are borderline between two shades, say so and explain why you picked the lighter one."
}`;

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Extract base64 data and media type from data URL
    const match = image.match(
      /^data:(image\/(?:jpeg|png|gif|webp));base64,(.+)$/
    );
    if (!match) {
      return NextResponse.json(
        { error: "Invalid image format. Please provide a JPEG, PNG, or WebP image." },
        { status: 400 }
      );
    }

    const mediaType = match[1] as
      | "image/jpeg"
      | "image/png"
      | "image/gif"
      | "image/webp";
    const base64Data = match[2];

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64Data,
              },
            },
            {
              type: "text",
              text: "Analyze this selfie and determine the person's skin tone and undertone for Jones Road Beauty shade matching. Respond with JSON only.",
            },
          ],
        },
      ],
      system: SYSTEM_PROMPT,
    });

    // Extract text from response
    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "No analysis returned from AI" },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let analysis;
    try {
      // Strip any markdown code fences if present
      const cleanText = textBlock.text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      analysis = JSON.parse(cleanText);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response", raw: textBlock.text },
        { status: 500 }
      );
    }

    const skinTone = analysis.skinTone as SkinTone;
    const undertone = analysis.undertone as Undertone;
    const wtfShade = analysis.wtfShade as WtfShade;

    // V4: Use AI's direct WTF shade pick for product mapping
    const wtfProducts = wtfShadeProductMap[wtfShade];

    // If the AI returned a valid WTF shade, use the WTF-anchored lookup;
    // otherwise fall back to V3 skin-tone-based lookup for safety.
    const shades = wtfProducts
      ? {
          wtfShade,
          facePencilFace: wtfProducts.facePencilFace,
          facePencilEye: wtfProducts.facePencilEye,
          neutralizer: wtfProducts.neutralizer,
          tintedPowder: wtfProducts.tintedPowder,
        }
      : complexionShadesByTone[skinTone];

    // For Miracle Balm, use the skin tone from the WTF map if available,
    // otherwise use the AI's direct skin tone classification
    const mbSkinTone = wtfProducts?.skinTone ?? skinTone;
    const miracleBalmRecs = getMBShades(mbSkinTone);

    const complexionRecs = getComplexionRecs(skinTone, undertone);
    const heroComplexion = getHeroComplexionRec(skinTone, undertone);

    return NextResponse.json({
      analysis: {
        skinTone,
        undertone,
        wtfShade,
        confidence: analysis.confidence,
        reasoning: analysis.reasoning,
      },
      miracleBalm: miracleBalmRecs,
      complexion: {
        hero: heroComplexion,
        allOptions: complexionRecs,
        shades,
        needsNeutralizer: undertone !== "Warm",
      },
    });
  } catch (error) {
    console.error("Shade matching error:", error);
    return NextResponse.json(
      { error: "Failed to analyze image. Please try again." },
      { status: 500 }
    );
  }
}
