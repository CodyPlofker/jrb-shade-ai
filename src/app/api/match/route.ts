import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import {
  SkinTone,
  Undertone,
  getMBShades,
  getComplexionRecs,
  getHeroComplexionRec,
} from "@/lib/shade-data";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are a professional shade-matching expert for Jones Road Beauty cosmetics. You analyze selfie photos to determine skin tone and undertone for product shade recommendations.

Your job is to look at a customer's selfie and determine two things:
1. **Skin Tone** — one of exactly these 8 levels: Pale, Fair, Light, Light-Medium, Medium, Medium-Dark, Dark, Deep
2. **Undertone** — one of exactly these 3: Cool, Warm, Neutral

Guidelines for accurate analysis:
- Focus on the face and neck area for skin tone assessment
- Account for lighting conditions — indoor warm lighting can make skin appear warmer than it is
- Look at the jawline and forehead for the most accurate skin tone reading (these areas are less affected by sun exposure variations)
- For undertone: look at vein visibility (blue/purple = cool, green/olive = warm, mix = neutral), overall skin cast (pink/red = cool, yellow/golden/peach = warm, no strong cast = neutral)
- Olive skin is typically categorized as Warm or Neutral, depending on whether the olive cast leans yellow-green (warm) or gray-green (neutral)
- If you're between two skin tones, lean toward the lighter option — it's better to go slightly lighter than too dark with Miracle Balm
- Dark and Deep are distinct categories: Dark is rich brown tones, Deep is the deepest/richest complexions

Your confidence level should reflect:
- HIGH: clear photo, good lighting, face clearly visible
- MEDIUM: acceptable photo but some lighting issues, face partially obscured, or borderline between two categories
- LOW: poor lighting, blurry, face not clearly visible, or very unusual conditions

You MUST respond with valid JSON only. No markdown, no explanation outside the JSON.

Response format:
{
  "skinTone": "one of the 8 skin tone values",
  "undertone": "Cool | Warm | Neutral",
  "confidence": "high | medium | low",
  "reasoning": "2-3 sentences explaining your assessment in a friendly, helpful way — like a beauty advisor talking to a customer. Mention specific visual cues you noticed."
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

    // Look up shade recommendations
    const miracleBalmRecs = getMBShades(skinTone);
    const complexionRecs = getComplexionRecs(skinTone, undertone);
    const heroComplexion = getHeroComplexionRec(skinTone, undertone);

    return NextResponse.json({
      analysis: {
        skinTone,
        undertone,
        confidence: analysis.confidence,
        reasoning: analysis.reasoning,
      },
      miracleBalm: miracleBalmRecs,
      complexion: {
        hero: heroComplexion,
        allOptions: complexionRecs,
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
