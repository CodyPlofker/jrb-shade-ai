import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";

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
}

// Use /tmp for persistence within a single serverless function lifecycle
// Plus console.log as a permanent backup in Vercel function logs
const FEEDBACK_FILE = path.join("/tmp", "shade-feedback.json");

async function readFeedback(): Promise<FeedbackEntry[]> {
  try {
    const data = await fs.readFile(FEEDBACK_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeFeedback(entries: FeedbackEntry[]): Promise<void> {
  await fs.writeFile(FEEDBACK_FILE, JSON.stringify(entries, null, 2));
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
    };

    // Always log to Vercel function logs — this is the permanent record
    console.log("=== SHADE FEEDBACK SUBMISSION ===");
    console.log(JSON.stringify(entry, null, 2));
    // Log image separately (base64 thumbnail) so we can retrieve it from logs if needed
    if (body.imageData) {
      console.log("=== FEEDBACK IMAGE (base64 thumbnail) ===");
      console.log(body.imageData);
      console.log("=== END IMAGE ===");
    }
    console.log("=== END FEEDBACK ===");

    // Also save to /tmp file for GET retrieval within same function lifecycle
    const existing = await readFeedback();
    existing.push(entry);
    await writeFeedback(existing);

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
  const entries = await readFeedback();
  entries.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return Response.json({
    count: entries.length,
    feedback: entries,
    note: "Entries persist in /tmp within a function lifecycle. All submissions are also permanently logged to Vercel function logs (vercel logs --follow).",
  });
}
