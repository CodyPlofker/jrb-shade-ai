"use client";

import { useState, useCallback } from "react";
import { CameraCapture } from "@/components/CameraCapture";
import { AnalyzingState } from "@/components/AnalyzingState";
import { shadeSwatches } from "@/lib/shade-data";

interface AIResult {
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
    shades?: {
      wtfShade: string;
      facePencilFace: string;
      facePencilEye: string;
      neutralizer: string;
      tintedPowder: string;
    };
    needsNeutralizer: boolean;
  };
}

const SKIN_TONE_OPTIONS = [
  "Yes",
  "Too Light",
  "Too Dark",
  "Way Off",
];

const UNDERTONE_OPTIONS = [
  "Yes",
  "Should be Cool",
  "Should be Warm",
  "Should be Neutral",
];

type Step = "photo" | "analyzing" | "review" | "submitted";

export default function FeedbackPage() {
  const [step, setStep] = useState<Step>("photo");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    skinToneCorrect: "",
    undertoneCorrect: "",
    actualWtfShade: "",
    actualFacePencilShade: "",
    actualMiracleBalmShades: "",
    ethnicity: "",
    notes: "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const handleCapture = useCallback(async (imageData: string) => {
    setCapturedImage(imageData);
    setStep("analyzing");
    setError(null);

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      if (!res.ok) {
        throw new Error("Failed to analyze image");
      }

      const data: AIResult = await res.json();
      setAiResult(data);
      setStep("review");
    } catch {
      setError("Failed to analyze your photo. Please try again.");
      setStep("photo");
    }
  }, []);

  // Resize image to thumbnail for storage
  function resizeImage(dataUrl: string, maxSize: number): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        } else {
          resolve(dataUrl);
        }
      };
      img.src = dataUrl;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Resize image to ~200px thumbnail for storage
      const thumbnail = capturedImage
        ? await resizeImage(capturedImage, 200)
        : null;

      const payload = {
        ...form,
        skinToneDetected: aiResult?.analysis.skinTone || "",
        undertoneDetected: aiResult?.analysis.undertone || "",
        confidence: aiResult?.analysis.confidence || "",
        reasoning: aiResult?.analysis.reasoning || "",
        recommendedMBShades: aiResult?.miracleBalm
          .filter((r) => r.type === "Primary")
          .map((r) => `${r.usage}: ${r.shade}`)
          .join(", ") || "",
        recommendedWtfShade: aiResult?.complexion.shades?.wtfShade || "",
        recommendedFacePencil: aiResult?.complexion.shades
          ? `Face: ${aiResult.complexion.shades.facePencilFace}, Eye: ${aiResult.complexion.shades.facePencilEye}`
          : "",
        imageData: thumbnail,
        version: "v2",
      };

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to submit feedback");
      }

      setStep("submitted");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleRetake() {
    setCapturedImage(null);
    setAiResult(null);
    setStep("photo");
    setError(null);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="max-w-lg w-full">

          {/* STEP 1: Take Photo */}
          {step === "photo" && (
            <CameraCapture onCapture={handleCapture} error={error} />
          )}

          {/* STEP 2: Analyzing */}
          {step === "analyzing" && (
            <AnalyzingState image={capturedImage} />
          )}

          {/* STEP 3: Review Results + Feedback Form */}
          {step === "review" && aiResult && (
            <>
              {/* AI Results Summary */}
              <div className="text-center mb-6">
                <h1
                  className="text-3xl mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Review Your Match
                </h1>
                <p
                  className="text-sm"
                  style={{
                    color: "var(--jrb-muted)",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  See what the AI recommended, then tell us how it did.
                </p>
              </div>

              {/* Profile card with photo */}
              <div className="flex items-start gap-4 mb-6 p-4 rounded bg-white border border-[var(--jrb-border)]">
                {capturedImage && (
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border border-[var(--jrb-border)]">
                    <img
                      src={capturedImage}
                      alt="Your photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className="text-sm font-semibold uppercase tracking-wider text-[var(--jrb-brown)]"
                      style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                      {aiResult.analysis.skinTone}
                    </span>
                    <span className="text-[var(--jrb-muted)]">·</span>
                    <span
                      className="text-sm uppercase tracking-wider text-[var(--jrb-muted)]"
                      style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                      {aiResult.analysis.undertone} undertone
                    </span>
                  </div>
                  <p
                    className="text-sm text-[var(--jrb-brown)] leading-relaxed"
                    style={{ fontFamily: "system-ui, sans-serif", fontWeight: 400 }}
                  >
                    {aiResult.analysis.reasoning}
                  </p>
                </div>
              </div>

              {/* AI Recommended Shades - Miracle Balm */}
              <div className="mb-6 p-4 rounded border border-[var(--jrb-border)] bg-[#faf8f5]">
                <p
                  className="text-[10px] uppercase tracking-wider text-[var(--jrb-gold)] mb-3"
                  style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
                >
                  AI Recommended — Miracle Balm
                </p>
                <div className="space-y-2">
                  {aiResult.miracleBalm
                    .filter((r) => r.type === "Primary")
                    .map((rec) => (
                      <div key={rec.usage} className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full flex-shrink-0 border border-[var(--jrb-border)]"
                          style={{ backgroundColor: shadeSwatches[rec.shade] || "#ccc" }}
                        />
                        <span
                          className="text-sm text-[var(--jrb-brown)]"
                          style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                          <strong>{rec.shade}</strong>
                          <span className="text-[var(--jrb-muted)]"> · {rec.usage}</span>
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* AI Recommended Shades - Complexion */}
              {aiResult.complexion.shades && (
                <div className="mb-8 p-4 rounded border border-[var(--jrb-border)] bg-[#faf8f5]">
                  <p
                    className="text-[10px] uppercase tracking-wider text-[var(--jrb-gold)] mb-3"
                    style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
                  >
                    AI Recommended — Complexion
                  </p>
                  <div className="space-y-2 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
                    <div className="text-[var(--jrb-brown)]">
                      <strong>JETM / WTF:</strong> {aiResult.complexion.shades.wtfShade}
                    </div>
                    <div className="text-[var(--jrb-brown)]">
                      <strong>Face Pencil:</strong> {aiResult.complexion.shades.facePencilFace} (face) / {aiResult.complexion.shades.facePencilEye} (under eye)
                    </div>
                    {aiResult.complexion.shades.neutralizer && (
                      <div className="text-[var(--jrb-brown)]">
                        <strong>Neutralizer:</strong> {aiResult.complexion.shades.neutralizer}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div
                className="mb-8 text-center"
                style={{ borderTop: "1px solid var(--jrb-border)", paddingTop: "24px" }}
              >
                <h2
                  className="text-xl mb-1"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Now Tell Us How It Did
                </h2>
                <p
                  className="text-sm"
                  style={{
                    color: "var(--jrb-muted)",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  Your feedback helps the AI get smarter.
                </p>
              </div>

              {/* Feedback Form */}
              <form onSubmit={handleSubmit}>
                {/* Your Name */}
                <FormSection>
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Sarah"
                    value={form.name}
                    onChange={(v) => update("name", v)}
                    required
                  />
                </FormSection>

                {/* Accuracy */}
                <FormSection>
                  <SectionHeading>Accuracy Check</SectionHeading>

                  <div className="mb-5">
                    <Label>
                      Was the skin tone correct?{" "}
                      <span className="normal-case font-normal text-[var(--jrb-muted)]">
                        (AI said: {aiResult.analysis.skinTone})
                      </span>
                    </Label>
                    <RadioGroup
                      name="skinToneCorrect"
                      options={SKIN_TONE_OPTIONS}
                      value={form.skinToneCorrect}
                      onChange={(v) => update("skinToneCorrect", v)}
                      required
                    />
                  </div>

                  <div>
                    <Label>
                      Was the undertone correct?{" "}
                      <span className="normal-case font-normal text-[var(--jrb-muted)]">
                        (AI said: {aiResult.analysis.undertone})
                      </span>
                    </Label>
                    <RadioGroup
                      name="undertoneCorrect"
                      options={UNDERTONE_OPTIONS}
                      value={form.undertoneCorrect}
                      onChange={(v) => update("undertoneCorrect", v)}
                      required
                    />
                  </div>
                </FormSection>

                {/* Actual shades */}
                <FormSection>
                  <SectionHeading>What Shade Do You Actually Wear?</SectionHeading>
                  <p
                    className="text-xs mb-4"
                    style={{
                      color: "var(--jrb-muted)",
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
                    Fill in whichever products you know your shade for.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="actualWtfShade">
                        WTF / Just Enough Tinted Moisturizer shade
                      </Label>
                      <Input
                        id="actualWtfShade"
                        placeholder={`e.g. "${aiResult.complexion.shades?.wtfShade || "Beige"}" or different`}
                        value={form.actualWtfShade}
                        onChange={(v) => update("actualWtfShade", v)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="actualFacePencilShade">
                        Face Pencil shade
                      </Label>
                      <Input
                        id="actualFacePencilShade"
                        placeholder='e.g. "08", "13"'
                        value={form.actualFacePencilShade}
                        onChange={(v) => update("actualFacePencilShade", v)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="actualMiracleBalmShades">
                        Miracle Balm shades you use
                      </Label>
                      <Input
                        id="actualMiracleBalmShades"
                        placeholder='e.g. "Dusty Rose, Sunkissed"'
                        value={form.actualMiracleBalmShades}
                        onChange={(v) => update("actualMiracleBalmShades", v)}
                      />
                    </div>
                  </div>
                </FormSection>

                {/* Demographics */}
                <FormSection>
                  <Label htmlFor="ethnicity">
                    What&apos;s your ethnicity / background?
                  </Label>
                  <p
                    className="text-xs mb-3"
                    style={{
                      color: "var(--jrb-muted)",
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
                    Optional — helps us identify gaps in training data for specific
                    demographics.
                  </p>
                  <Input
                    id="ethnicity"
                    placeholder="Optional"
                    value={form.ethnicity}
                    onChange={(v) => update("ethnicity", v)}
                  />
                </FormSection>

                {/* Notes */}
                <FormSection>
                  <Label htmlFor="notes">Any other notes?</Label>
                  <Textarea
                    id="notes"
                    placeholder="Anything else we should know — lighting conditions, makeup on/off, etc."
                    value={form.notes}
                    onChange={(v) => update("notes", v)}
                  />
                </FormSection>

                {/* Error */}
                {error && (
                  <p
                    className="text-sm mb-4 text-center"
                    style={{
                      color: "#c44",
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
                    {error}
                  </p>
                )}

                {/* Buttons */}
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="jrb-button jrb-button-primary w-full"
                    style={{ opacity: submitting ? 0.6 : 1 }}
                  >
                    {submitting ? "Submitting..." : "Submit Feedback"}
                  </button>
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="jrb-button jrb-button-secondary w-full"
                  >
                    Retake Photo
                  </button>
                </div>
              </form>
            </>
          )}

          {/* STEP 4: Submitted */}
          {step === "submitted" && (
            <div className="text-center py-12">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ background: "var(--jrb-light-gold)" }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--jrb-brown)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2
                className="text-2xl mb-3"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Thank you, {form.name || "friend"}
              </h2>
              <p
                className="text-sm mb-8"
                style={{
                  color: "var(--jrb-muted)",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                Your feedback helps us make the shade matcher smarter for everyone.
              </p>
              <button
                onClick={handleRetake}
                className="jrb-button jrb-button-secondary"
              >
                Submit another
              </button>
            </div>
          )}

          {/* Back link */}
          <div className="text-center mt-6 mb-8">
            <a
              href="/"
              className="text-xs underline"
              style={{
                color: "var(--jrb-muted)",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Back to shade matcher
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Shared sub-components ──────────────────────────────── */

function Header() {
  return (
    <header className="flex items-center justify-center py-5 px-4 border-b border-[var(--jrb-border)] relative">
      <a href="/">
        <svg
          width="160"
          height="15"
          viewBox="0 0 256 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Jones Road</title>
          <g clipPath="url(#clip0_302_3878)">
            <path
              d="M0 20.26V14C0.920058 14.6837 2.0443 15.0361 3.19 15C5.49 15 6.92 13.82 6.92 11.5V0.710007H16.79V13.27C16.79 19.35 12.69 21.96 6.79 21.96C3.43 22 1 21.08 0 20.26Z"
              fill="currentColor"
            />
            <path
              d="M34.2086 0C24.8886 0 19.3086 4.46 19.3086 10.81C19.3086 16.94 24.8886 22 34.1786 22C43.4686 22 49.0586 17 49.0586 10.85C49.0586 4.46 43.4686 0 34.2086 0ZM34.2086 15C33.6528 15.0452 33.0938 14.9708 32.5693 14.7816C32.0447 14.5925 31.5668 14.293 31.1678 13.9035C30.7689 13.514 30.458 13.0434 30.2563 12.5236C30.0546 12.0037 29.9667 11.4467 29.9986 10.89C29.9986 8.52 31.5986 7 34.1786 7C36.7586 7 38.3986 8.5 38.3986 10.87C38.4336 11.4292 38.3477 11.9894 38.1468 12.5125C37.9458 13.0355 37.6345 13.5091 37.2341 13.9011C36.8336 14.293 36.3534 14.594 35.8261 14.7836C35.2989 14.9733 34.7369 15.0471 34.1786 15H34.2086Z"
              fill="currentColor"
            />
            <path
              d="M77.7791 0.700195V21.2602H65.8891L59.9991 9.9202V21.2602H51.6191V0.700195H63.7291L69.4391 11.9502V0.700195H77.7791Z"
              fill="currentColor"
            />
            <path
              d="M102.689 15.1802V21.2602H81.5586V0.700195H102.629V6.7802H91.4286V8.6002H102.139V13.1802H91.4286V15.1802H102.689Z"
              fill="currentColor"
            />
            <path
              d="M105.439 19.09V13.15C108.512 14.9609 112.013 15.9173 115.579 15.92C117.519 15.92 118.339 15.62 118.339 14.92C118.339 14.22 117.859 13.98 116.339 13.77L113.429 13.36C107.929 12.6 105.199 10.57 105.199 7.02002C105.199 3.02002 108.989 0.0200195 117.609 0.0200195C122.929 0.0200195 126.049 1.19002 127.689 2.02002V7.84002C125.025 6.62086 122.119 6.01923 119.189 6.08002C116.549 6.08002 115.849 6.46002 115.849 7.08002C115.849 7.55002 116.159 7.84002 117.979 8.02002L121.109 8.37002C126.209 8.93002 129.109 10.6 129.109 14.37C129.109 19.01 124.109 21.85 116.969 21.85C112.958 21.9439 108.994 20.9634 105.489 19.01"
              fill="currentColor"
            />
            <path
              d="M153.07 10.92C154.95 10.92 155.99 10.13 155.99 8.72001C155.99 7.31001 154.99 6.67001 153.16 6.67001H149.88V10.92H153.07ZM155.07 21.26L149.91 13.15V21.26H140V0.710007H157.5C162.84 0.710007 166.18 3.41001 166.18 7.78001C166.243 9.2721 165.759 10.7359 164.821 11.8974C163.882 13.0588 162.552 13.8384 161.08 14.09L166.27 21.26H155.07Z"
              fill="currentColor"
            />
            <path
              d="M183.051 0C173.731 0 168.141 4.46 168.141 10.81C168.141 16.94 173.731 22 183.001 22C192.271 22 197.881 17 197.881 10.85C197.891 4.46 192.301 0 183.051 0ZM183.051 15C182.499 15.0462 181.944 14.974 181.422 14.7884C180.9 14.6028 180.425 14.3079 180.026 13.9236C179.627 13.5393 179.316 13.0743 179.111 12.5598C178.907 12.0453 178.814 11.493 178.841 10.94C178.801 8.52 180.431 7 183.001 7C185.571 7 187.221 8.5 187.221 10.87C187.256 11.4292 187.17 11.9894 186.969 12.5125C186.768 13.0355 186.457 13.5091 186.056 13.9011C185.656 14.293 185.175 14.594 184.648 14.7836C184.121 14.9733 183.559 15.0471 183.001 15H183.051Z"
              fill="currentColor"
            />
            <path
              d="M214.059 13.5102L211.909 6.1702L209.719 13.5102H214.059ZM215.429 18.1502H208.359L207.449 21.2602H197.789L204.789 0.700195H219.389L226.309 21.2602H216.379L215.429 18.1502Z"
              fill="currentColor"
            />
            <path
              d="M241.11 0.699997H228V21.26H240.2C250.79 21.26 255.2 16.21 255.2 10.84C255.23 5.05 250.61 0.699997 241.11 0.699997ZM240.05 15.21H237.89V6.75H240.41C243.41 6.75 244.6 8.55 244.6 10.81C244.6 13.42 243.08 15.21 240.05 15.21Z"
              fill="currentColor"
            />
          </g>
          <defs>
            <clipPath id="clip0_302_3878">
              <rect width="255.23" height="21.96" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </a>
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono tracking-wider text-[var(--jrb-muted)] bg-[#f0f0f0] px-2 py-0.5 rounded">V2 TEST</span>
    </header>
  );
}

function FormSection({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mb-6 pb-6"
      style={{ borderBottom: "1px solid var(--jrb-border)" }}
    >
      {children}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-xl mb-1"
      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
    >
      {children}
    </h2>
  );
}

function Label({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-semibold mb-2 uppercase tracking-wider"
      style={{
        fontFamily: "system-ui, sans-serif",
        color: "var(--jrb-brown)",
        letterSpacing: "0.08em",
      }}
    >
      {children}
    </label>
  );
}

function Input({
  id,
  placeholder,
  value,
  onChange,
  required,
}: {
  id: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <input
      id={id}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full px-4 py-3 text-sm rounded-sm outline-none"
      style={{
        fontFamily: "system-ui, sans-serif",
        border: "1px solid var(--jrb-border)",
        background: "#fff",
        color: "var(--jrb-black)",
        transition: "border-color 0.2s",
      }}
      onFocus={(e) =>
        (e.currentTarget.style.borderColor = "var(--jrb-brown)")
      }
      onBlur={(e) =>
        (e.currentTarget.style.borderColor = "var(--jrb-border)")
      }
    />
  );
}

function RadioGroup({
  name,
  options,
  value,
  onChange,
  required,
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <label
            key={opt}
            className="cursor-pointer px-4 py-2 text-xs rounded-sm transition-all"
            style={{
              fontFamily: "system-ui, sans-serif",
              border: selected
                ? "1px solid var(--jrb-brown)"
                : "1px solid var(--jrb-border)",
              background: selected ? "var(--jrb-brown)" : "#fff",
              color: selected ? "#fff" : "var(--jrb-black)",
              letterSpacing: "0.02em",
            }}
          >
            <input
              type="radio"
              name={name}
              value={opt}
              checked={selected}
              onChange={() => onChange(opt)}
              required={required}
              className="sr-only"
            />
            {opt}
          </label>
        );
      })}
    </div>
  );
}

function Textarea({
  id,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <textarea
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      className="w-full px-4 py-3 text-sm rounded-sm outline-none resize-y"
      style={{
        fontFamily: "system-ui, sans-serif",
        border: "1px solid var(--jrb-border)",
        background: "#fff",
        color: "var(--jrb-black)",
        transition: "border-color 0.2s",
      }}
      onFocus={(e) =>
        (e.currentTarget.style.borderColor = "var(--jrb-brown)")
      }
      onBlur={(e) =>
        (e.currentTarget.style.borderColor = "var(--jrb-border)")
      }
    />
  );
}
