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
        <a href="https://jonesroadbeauty.com">
          <svg width="160" height="15" viewBox="0 0 256 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <title>Jones Road</title>
            <g clipPath="url(#clip0_302_3878)">
              <path d="M0 20.26V14C0.920058 14.6837 2.0443 15.0361 3.19 15C5.49 15 6.92 13.82 6.92 11.5V0.710007H16.79V13.27C16.79 19.35 12.69 21.96 6.79 21.96C3.43 22 1 21.08 0 20.26Z" fill="currentColor"/>
              <path d="M34.2086 0C24.8886 0 19.3086 4.46 19.3086 10.81C19.3086 16.94 24.8886 22 34.1786 22C43.4686 22 49.0586 17 49.0586 10.85C49.0586 4.46 43.4686 0 34.2086 0ZM34.2086 15C33.6528 15.0452 33.0938 14.9708 32.5693 14.7816C32.0447 14.5925 31.5668 14.293 31.1678 13.9035C30.7689 13.514 30.458 13.0434 30.2563 12.5236C30.0546 12.0037 29.9667 11.4467 29.9986 10.89C29.9986 8.52 31.5986 7 34.1786 7C36.7586 7 38.3986 8.5 38.3986 10.87C38.4336 11.4292 38.3477 11.9894 38.1468 12.5125C37.9458 13.0355 37.6345 13.5091 37.2341 13.9011C36.8336 14.293 36.3534 14.594 35.8261 14.7836C35.2989 14.9733 34.7369 15.0471 34.1786 15H34.2086Z" fill="currentColor"/>
              <path d="M77.7791 0.700195V21.2602H65.8891L59.9991 9.9202V21.2602H51.6191V0.700195H63.7291L69.4391 11.9502V0.700195H77.7791Z" fill="currentColor"/>
              <path d="M102.689 15.1802V21.2602H81.5586V0.700195H102.629V6.7802H91.4286V8.6002H102.139V13.1802H91.4286V15.1802H102.689Z" fill="currentColor"/>
              <path d="M105.439 19.09V13.15C108.512 14.9609 112.013 15.9173 115.579 15.92C117.519 15.92 118.339 15.62 118.339 14.92C118.339 14.22 117.859 13.98 116.339 13.77L113.429 13.36C107.929 12.6 105.199 10.57 105.199 7.02002C105.199 3.02002 108.989 0.0200195 117.609 0.0200195C122.929 0.0200195 126.049 1.19002 127.689 2.02002V7.84002C125.025 6.62086 122.119 6.01923 119.189 6.08002C116.549 6.08002 115.849 6.46002 115.849 7.08002C115.849 7.55002 116.159 7.84002 117.979 8.02002L121.109 8.37002C126.209 8.93002 129.109 10.6 129.109 14.37C129.109 19.01 124.109 21.85 116.969 21.85C112.958 21.9439 108.994 20.9634 105.489 19.01" fill="currentColor"/>
              <path d="M153.07 10.92C154.95 10.92 155.99 10.13 155.99 8.72001C155.99 7.31001 154.99 6.67001 153.16 6.67001H149.88V10.92H153.07ZM155.07 21.26L149.91 13.15V21.26H140V0.710007H157.5C162.84 0.710007 166.18 3.41001 166.18 7.78001C166.243 9.2721 165.759 10.7359 164.821 11.8974C163.882 13.0588 162.552 13.8384 161.08 14.09L166.27 21.26H155.07Z" fill="currentColor"/>
              <path d="M183.051 0C173.731 0 168.141 4.46 168.141 10.81C168.141 16.94 173.731 22 183.001 22C192.271 22 197.881 17 197.881 10.85C197.891 4.46 192.301 0 183.051 0ZM183.051 15C182.499 15.0462 181.944 14.974 181.422 14.7884C180.9 14.6028 180.425 14.3079 180.026 13.9236C179.627 13.5393 179.316 13.0743 179.111 12.5598C178.907 12.0453 178.814 11.493 178.841 10.94C178.801 8.52 180.431 7 183.001 7C185.571 7 187.221 8.5 187.221 10.87C187.256 11.4292 187.17 11.9894 186.969 12.5125C186.768 13.0355 186.457 13.5091 186.056 13.9011C185.656 14.293 185.175 14.594 184.648 14.7836C184.121 14.9733 183.559 15.0471 183.001 15H183.051Z" fill="currentColor"/>
              <path d="M214.059 13.5102L211.909 6.1702L209.719 13.5102H214.059ZM215.429 18.1502H208.359L207.449 21.2602H197.789L204.789 0.700195H219.389L226.309 21.2602H216.379L215.429 18.1502Z" fill="currentColor"/>
              <path d="M241.11 0.699997H228V21.26H240.2C250.79 21.26 255.2 16.21 255.2 10.84C255.23 5.05 250.61 0.699997 241.11 0.699997ZM240.05 15.21H237.89V6.75H240.41C243.41 6.75 244.6 8.55 244.6 10.81C244.6 13.42 243.08 15.21 240.05 15.21Z" fill="currentColor"/>
            </g>
            <defs>
              <clipPath id="clip0_302_3878">
                <rect width="255.23" height="21.96" fill="white"/>
              </clipPath>
            </defs>
          </svg>
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
