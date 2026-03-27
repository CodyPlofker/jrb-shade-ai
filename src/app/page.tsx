"use client";

import { useState, useRef, useCallback } from "react";
import { CameraCapture } from "@/components/CameraCapture";
import { Results } from "@/components/Results";
import { AnalyzingState } from "@/components/AnalyzingState";

export interface ShadeResult {
  analysis: {
    skinTone: string;
    undertone: string;
    confidence: string;
    reasoning: string;
  };
  miracleBalm: Array<{
    skinTone: string;
    usage: string;
    type: string;
    shade: string;
    copy: string;
  }>;
  complexion: {
    hero: {
      heroProduct: string;
      neutralizer: string;
      coverage: string;
    } | null;
    allOptions: Array<{
      coverage: string;
      heroProduct: string;
      neutralizer: string;
    }>;
    needsNeutralizer: boolean;
  };
}

type AppState = "camera" | "analyzing" | "results";

export default function Home() {
  const [state, setState] = useState<AppState>("camera");
  const [result, setResult] = useState<ShadeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const handleCapture = useCallback(async (imageData: string) => {
    setCapturedImage(imageData);
    setState("analyzing");
    setError(null);

    abortRef.current = new AbortController();

    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to analyze image");
      }

      const data = await response.json();
      setResult(data);
      setState("results");
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setState("camera");
    }
  }, []);

  const handleRetry = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setResult(null);
    setError(null);
    setCapturedImage(null);
    setState("camera");
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center py-5 px-4 border-b border-[var(--jrb-border)]">
        <a
          href="https://jonesroadbeauty.com"
          className="text-[var(--jrb-brown)] tracking-[0.2em] text-sm uppercase"
          style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
        >
          Jones Road Beauty
        </a>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center px-4 py-8 max-w-lg mx-auto w-full">
        {state === "camera" && (
          <CameraCapture onCapture={handleCapture} error={error} />
        )}
        {state === "analyzing" && (
          <AnalyzingState image={capturedImage} />
        )}
        {state === "results" && result && (
          <Results
            result={result}
            image={capturedImage}
            onRetry={handleRetry}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 text-center">
        <p
          className="text-xs text-[var(--jrb-muted)]"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          AI shade matching is a guide, not a guarantee. For best results, use a
          well-lit selfie with no makeup.
        </p>
      </footer>
    </div>
  );
}
