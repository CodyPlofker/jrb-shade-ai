"use client";

import { useState, useCallback } from "react";
import { CameraCapture } from "@/components/CameraCapture";
import { AnalyzingState } from "@/components/AnalyzingState";
import { Results } from "@/components/Results";
import { ShadeResult } from "@/lib/types";

const SKIN_TONE_OPTIONS = ["Yes", "Too Light", "Too Dark", "Way Off"];
const UNDERTONE_OPTIONS = [
  "Yes",
  "Should be Cool",
  "Should be Warm",
  "Should be Neutral",
];

type Step = "photo" | "analyzing" | "review" | "submitted";

export default function Home() {
  const [step, setStep] = useState<Step>("photo");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<ShadeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackSkipped, setFeedbackSkipped] = useState(false);

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

      if (!res.ok) throw new Error("Failed to analyze image");

      const data: ShadeResult = await res.json();
      setAiResult(data);
      setStep("review");
    } catch {
      setError("Failed to analyze your photo. Please try again.");
      setStep("photo");
    }
  }, []);

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
      const thumbnail = capturedImage
        ? await resizeImage(capturedImage, 200)
        : null;

      const payload = {
        ...form,
        skinToneDetected: aiResult?.analysis.skinTone || "",
        undertoneDetected: aiResult?.analysis.undertone || "",
        confidence: aiResult?.analysis.confidence || "",
        reasoning: aiResult?.analysis.reasoning || "",
        recommendedMBShades:
          aiResult?.miracleBalm
            .filter((r) => r.type === "Primary")
            .map((r) => `${r.usage}: ${r.shade}`)
            .join(", ") || "",
        recommendedWtfShade: aiResult?.complexion.shades?.wtfShade || "",
        recommendedFacePencil: aiResult?.complexion.shades
          ? `Face: ${aiResult.complexion.shades.facePencilFace}, Eye: ${aiResult.complexion.shades.facePencilEye}`
          : "",
        recommendedFoundationStick:
          aiResult?.complexion.shades?.foundationStickShade || "",
        imageData: thumbnail,
        version: "v4",
      };

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit feedback");
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
    setFeedbackSkipped(false);
    setForm({
      name: "",
      skinToneCorrect: "",
      undertoneCorrect: "",
      actualWtfShade: "",
      actualFacePencilShade: "",
      actualMiracleBalmShades: "",
      ethnicity: "",
      notes: "",
    });
    setStep("photo");
    setError(null);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="max-w-lg w-full">

          {step === "photo" && (
            <CameraCapture onCapture={handleCapture} error={error} />
          )}

          {step === "analyzing" && (
            <AnalyzingState image={capturedImage} />
          )}

          {step === "review" && aiResult && (
            <>
              {/* Rich results display */}
              <Results
                result={aiResult}
                image={capturedImage}
                onRetry={handleRetake}
              />

              {/* Inline Feedback Form */}
              {!feedbackSkipped && (
                <>
                  <div className="section-divider" />
                  <div className="text-center mb-6">
                    <h2 className="text-2xl mb-1" style={{ fontWeight: 300 }}>
                      How Did We Do?
                    </h2>
                    <p
                      className="text-sm text-[var(--jrb-muted)]"
                      style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                      Your feedback trains the AI. Takes 2 minutes.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <FormSection>
                      <Label htmlFor="name">Your Name</Label>
                      <InputField
                        id="name"
                        placeholder="e.g. Sarah"
                        value={form.name}
                        onChange={(v) => update("name", v)}
                        required
                      />
                    </FormSection>

                    <FormSection>
                      <p
                        className="text-[10px] uppercase tracking-wider font-semibold mb-4 text-[var(--jrb-muted)]"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                      >
                        Accuracy Check
                      </p>

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

                    <FormSection>
                      <p
                        className="text-[10px] uppercase tracking-wider font-semibold mb-2 text-[var(--jrb-muted)]"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                      >
                        What Shade Do You Actually Wear?
                      </p>
                      <p
                        className="text-xs mb-4 text-[var(--jrb-muted)]"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                      >
                        Fill in whichever products you know your shade for.
                      </p>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="actualWtfShade">
                            JETM / WTF shade
                          </Label>
                          <InputField
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
                          <InputField
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
                          <InputField
                            id="actualMiracleBalmShades"
                            placeholder='e.g. "Dusty Rose, Sunkissed"'
                            value={form.actualMiracleBalmShades}
                            onChange={(v) =>
                              update("actualMiracleBalmShades", v)
                            }
                          />
                        </div>
                      </div>
                    </FormSection>

                    <FormSection>
                      <Label htmlFor="ethnicity">
                        Ethnicity / background?
                      </Label>
                      <p
                        className="text-xs mb-3 text-[var(--jrb-muted)]"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                      >
                        Optional — helps identify training data gaps.
                      </p>
                      <InputField
                        id="ethnicity"
                        placeholder="Optional"
                        value={form.ethnicity}
                        onChange={(v) => update("ethnicity", v)}
                      />
                    </FormSection>

                    <FormSection>
                      <Label htmlFor="notes">Any other notes?</Label>
                      <TextareaField
                        id="notes"
                        placeholder="Lighting conditions, makeup on/off, anything else..."
                        value={form.notes}
                        onChange={(v) => update("notes", v)}
                      />
                    </FormSection>

                    {error && (
                      <p
                        className="text-sm mb-4 text-center"
                        style={{ color: "#c44", fontFamily: "system-ui, sans-serif" }}
                      >
                        {error}
                      </p>
                    )}

                    <div className="space-y-3 mb-8">
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
                        onClick={() => setFeedbackSkipped(true)}
                        className="jrb-button jrb-button-secondary w-full"
                      >
                        Skip Feedback
                      </button>
                    </div>
                  </form>
                </>
              )}

              {feedbackSkipped && (
                <div className="text-center mt-4 mb-8">
                  <button
                    onClick={handleRetake}
                    className="jrb-button jrb-button-secondary"
                  >
                    Try Again With a New Photo
                  </button>
                </div>
              )}
            </>
          )}

          {step === "submitted" && (
            <div className="text-center py-16">
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
              <h2 className="text-3xl mb-3" style={{ fontWeight: 300 }}>
                Thank you{form.name ? `, ${form.name}` : ""}
              </h2>
              <p
                className="text-sm mb-8 text-[var(--jrb-muted)]"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                Your feedback helps us make the shade matcher smarter for everyone.
              </p>
              <button onClick={handleRetake} className="jrb-button jrb-button-secondary">
                Try Another Photo
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────── */

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
            <path d="M0 20.26V14C0.920058 14.6837 2.0443 15.0361 3.19 15C5.49 15 6.92 13.82 6.92 11.5V0.710007H16.79V13.27C16.79 19.35 12.69 21.96 6.79 21.96C3.43 22 1 21.08 0 20.26Z" fill="currentColor" />
            <path d="M34.2086 0C24.8886 0 19.3086 4.46 19.3086 10.81C19.3086 16.94 24.8886 22 34.1786 22C43.4686 22 49.0586 17 49.0586 10.85C49.0586 4.46 43.4686 0 34.2086 0ZM34.2086 15C33.6528 15.0452 33.0938 14.9708 32.5693 14.7816C32.0447 14.5925 31.5668 14.293 31.1678 13.9035C30.7689 13.514 30.458 13.0434 30.2563 12.5236C30.0546 12.0037 29.9667 11.4467 29.9986 10.89C29.9986 8.52 31.5986 7 34.1786 7C36.7586 7 38.3986 8.5 38.3986 10.87C38.4336 11.4292 38.3477 11.9894 38.1468 12.5125C37.9458 13.0355 37.6345 13.5091 37.2341 13.9011C36.8336 14.293 36.3534 14.594 35.8261 14.7836C35.2989 14.9733 34.7369 15.0471 34.1786 15H34.2086Z" fill="currentColor" />
            <path d="M77.7791 0.700195V21.2602H65.8891L59.9991 9.9202V21.2602H51.6191V0.700195H63.7291L69.4391 11.9502V0.700195H77.7791Z" fill="currentColor" />
            <path d="M102.689 15.1802V21.2602H81.5586V0.700195H102.629V6.7802H91.4286V8.6002H102.139V13.1802H91.4286V15.1802H102.689Z" fill="currentColor" />
            <path d="M105.439 19.09V13.15C108.512 14.9609 112.013 15.9173 115.579 15.92C117.519 15.92 118.339 15.62 118.339 14.92C118.339 14.22 117.859 13.98 116.339 13.77L113.429 13.36C107.929 12.6 105.199 10.57 105.199 7.02002C105.199 3.02002 108.989 0.0200195 117.609 0.0200195C122.929 0.0200195 126.049 1.19002 127.689 2.02002V7.84002C125.025 6.62086 122.119 6.01923 119.189 6.08002C116.549 6.08002 115.849 6.46002 115.849 7.08002C115.849 7.55002 116.159 7.84002 117.979 8.02002L121.109 8.37002C126.209 8.93002 129.109 10.6 129.109 14.37C129.109 19.01 124.109 21.85 116.969 21.85C112.958 21.9439 108.994 20.9634 105.489 19.01" fill="currentColor" />
            <path d="M153.07 10.92C154.95 10.92 155.99 10.13 155.99 8.72001C155.99 7.31001 154.99 6.67001 153.16 6.67001H149.88V10.92H153.07ZM155.07 21.26L149.91 13.15V21.26H140V0.710007H157.5C162.84 0.710007 166.18 3.41001 166.18 7.78001C166.243 9.2721 165.759 10.7359 164.821 11.8974C163.882 13.0588 162.552 13.8384 161.08 14.09L166.27 21.26H155.07Z" fill="currentColor" />
            <path d="M183.051 0C173.731 0 168.141 4.46 168.141 10.81C168.141 16.94 173.731 22 183.001 22C192.271 22 197.881 17 197.881 10.85C197.891 4.46 192.301 0 183.051 0ZM183.051 15C182.499 15.0462 181.944 14.974 181.422 14.7884C180.9 14.6028 180.425 14.3079 180.026 13.9236C179.627 13.5393 179.316 13.0743 179.111 12.5598C178.907 12.0453 178.814 11.493 178.841 10.94C178.801 8.52 180.431 7 183.001 7C185.571 7 187.221 8.5 187.221 10.87C187.256 11.4292 187.17 11.9894 186.969 12.5125C186.768 13.0355 186.457 13.5091 186.056 13.9011C185.656 14.293 185.175 14.594 184.648 14.7836C184.121 14.9733 183.559 15.0471 183.001 15H183.051Z" fill="currentColor" />
            <path d="M214.059 13.5102L211.909 6.1702L209.719 13.5102H214.059ZM215.429 18.1502H208.359L207.449 21.2602H197.789L204.789 0.700195H219.389L226.309 21.2602H216.379L215.429 18.1502Z" fill="currentColor" />
            <path d="M241.11 0.699997H228V21.26H240.2C250.79 21.26 255.2 16.21 255.2 10.84C255.23 5.05 250.61 0.699997 241.11 0.699997ZM240.05 15.21H237.89V6.75H240.41C243.41 6.75 244.6 8.55 244.6 10.81C244.6 13.42 243.08 15.21 240.05 15.21Z" fill="currentColor" />
          </g>
          <defs>
            <clipPath id="clip0_302_3878">
              <rect width="255.23" height="21.96" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </a>
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono tracking-wider text-[var(--jrb-muted)] bg-[#f0f0f0] px-2 py-0.5 rounded">
        V4 BETA
      </span>
    </header>
  );
}

function FormSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 pb-6" style={{ borderBottom: "1px solid var(--jrb-border)" }}>
      {children}
    </div>
  );
}

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-semibold mb-2 uppercase tracking-wider"
      style={{ fontFamily: "system-ui, sans-serif", color: "var(--jrb-brown)", letterSpacing: "0.08em" }}
    >
      {children}
    </label>
  );
}

function InputField({
  id, placeholder, value, onChange, required,
}: {
  id: string; placeholder: string; value: string; onChange: (v: string) => void; required?: boolean;
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
      style={{ fontFamily: "system-ui, sans-serif", border: "1px solid var(--jrb-border)", background: "#fff", color: "var(--jrb-black)", transition: "border-color 0.2s" }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--jrb-brown)")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--jrb-border)")}
    />
  );
}

function RadioGroup({
  name, options, value, onChange, required,
}: {
  name: string; options: string[]; value: string; onChange: (v: string) => void; required?: boolean;
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
              border: selected ? "1px solid var(--jrb-brown)" : "1px solid var(--jrb-border)",
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

function TextareaField({
  id, placeholder, value, onChange,
}: {
  id: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <textarea
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      className="w-full px-4 py-3 text-sm rounded-sm outline-none resize-y"
      style={{ fontFamily: "system-ui, sans-serif", border: "1px solid var(--jrb-border)", background: "#fff", color: "var(--jrb-black)", transition: "border-color 0.2s" }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--jrb-brown)")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--jrb-border)")}
    />
  );
}
