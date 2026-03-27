import { NextRequest } from "next/server";

export interface FeedbackEntry {
  id: string;
  timestamp: string;
  name: string;
  skinToneDetected: string;
  undertoneDetected: string;
  skinToneCorrect: string;
  undertoneCorrect: string;
  actualWtfShade: string;
  actualFacePencilShade: string;
  actualMiracleBalmShades: string;
  ethnicity: string;
  notes: string;
}

// In-memory store — resets on deploy, good enough for initial testing.
// Upgrade to Vercel KV or Blob when volume justifies it.
const feedbackStore: FeedbackEntry[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const entry: FeedbackEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      name: body.name || "",
      skinToneDetected: body.skinToneDetected || "",
      undertoneDetected: body.undertoneDetected || "",
      skinToneCorrect: body.skinToneCorrect || "",
      undertoneCorrect: body.undertoneCorrect || "",
      actualWtfShade: body.actualWtfShade || "",
      actualFacePencilShade: body.actualFacePencilShade || "",
      actualMiracleBalmShades: body.actualMiracleBalmShades || "",
      ethnicity: body.ethnicity || "",
      notes: body.notes || "",
    };

    feedbackStore.push(entry);

    // Also log to console so we can see it in Vercel logs
    console.log("[SHADE FEEDBACK]", JSON.stringify(entry, null, 2));

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
  return Response.json({
    count: feedbackStore.length,
    feedback: feedbackStore,
  });
}
