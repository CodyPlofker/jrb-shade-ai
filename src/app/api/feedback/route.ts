import { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

let _redis: Redis | null = null;
function getRedis() {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return _redis;
}

const FEEDBACK_KEY = "shade-feedback-entries";

export interface FeedbackEntry {
  id: string;
  timestamp: string;
  name: string;
  skinToneDetected: string;
  undertoneDetected: string;
  confidence: string;
  reasoning: string;
  skinToneCorrect: string;
  undertoneCorrect: string;
  recommendedMBShades: string;
  recommendedWtfShade: string;
  recommendedFacePencil: string;
  actualWtfShade: string;
  actualFacePencilShade: string;
  actualMiracleBalmShades: string;
  ethnicity: string;
  notes: string;
  hasImage: boolean;
  version?: string;
  recommendedFoundationStick?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const entry: FeedbackEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      name: body.name || "",
      skinToneDetected: body.skinToneDetected || "",
      undertoneDetected: body.undertoneDetected || "",
      confidence: body.confidence || "",
      reasoning: body.reasoning || "",
      skinToneCorrect: body.skinToneCorrect || "",
      undertoneCorrect: body.undertoneCorrect || "",
      recommendedMBShades: body.recommendedMBShades || "",
      recommendedWtfShade: body.recommendedWtfShade || "",
      recommendedFacePencil: body.recommendedFacePencil || "",
      actualWtfShade: body.actualWtfShade || "",
      actualFacePencilShade: body.actualFacePencilShade || "",
      actualMiracleBalmShades: body.actualMiracleBalmShades || "",
      ethnicity: body.ethnicity || "",
      notes: body.notes || "",
      hasImage: !!body.imageData,
      version: body.version || "",
      recommendedFoundationStick: body.recommendedFoundationStick || "",
    };

    // Save entry to Redis list (push to front)
    await getRedis().lpush(FEEDBACK_KEY, entry);

    // If there's an image, store it separately keyed by ID
    if (body.imageData) {
      await getRedis().set(`shade-feedback-image:${entry.id}`, body.imageData);
    }

    // Also log to Vercel function logs as backup
    console.log("=== SHADE FEEDBACK ===");
    console.log(JSON.stringify(entry, null, 2));
    console.log("=== END ===");

    return Response.json({ success: true, id: entry.id }, { status: 201 });
  } catch (error) {
    console.error("Feedback save error:", error);
    return Response.json(
      { error: "Failed to save feedback", detail: String(error) },
      { status: 500 }
    );
  }
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  try {
    // Get all entries from the list
    const entries = await getRedis().lrange<FeedbackEntry>(FEEDBACK_KEY, 0, -1);

    return Response.json(
      { count: entries.length, feedback: entries },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error("Feedback read error:", error);
    return Response.json(
      { error: "Failed to read feedback", detail: String(error) },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
