import { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const FEEDBACK_KEY = "shade-feedback";

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
  imageData?: string;
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
      imageData: body.imageData || undefined,
    };

    // Save to Redis — each entry stored as a hash member keyed by ID
    await redis.hset(FEEDBACK_KEY, { [entry.id]: JSON.stringify(entry) });

    // Also log to Vercel function logs as backup
    const logEntry = { ...entry };
    delete logEntry.imageData; // Don't log base64 to console
    console.log("=== SHADE FEEDBACK ===");
    console.log(JSON.stringify(logEntry, null, 2));
    console.log("=== END ===");

    return Response.json({ success: true, id: entry.id }, { status: 201 });
  } catch (error) {
    console.error("Feedback save error:", error);
    return Response.json(
      { error: "Failed to save feedback" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allData = await redis.hgetall(FEEDBACK_KEY);

    if (!allData || Object.keys(allData).length === 0) {
      return Response.json({ count: 0, feedback: [] });
    }

    const entries: FeedbackEntry[] = Object.values(allData).map((v) => {
      if (typeof v === "string") return JSON.parse(v);
      return v as FeedbackEntry;
    });

    // Sort newest first
    entries.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    // Strip image data from list view to keep response small
    const cleaned = entries.map((e) => {
      const { imageData, ...rest } = e;
      return rest;
    });

    return Response.json({
      count: cleaned.length,
      feedback: cleaned,
    });
  } catch (error) {
    console.error("Feedback read error:", error);
    return Response.json(
      { error: "Failed to read feedback" },
      { status: 500 }
    );
  }
}
