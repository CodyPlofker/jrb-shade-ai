"use client";

import { useState } from "react";
import { ShadeResult } from "@/app/page";
import {
  shadeSwatches,
  miracleBalmUrls,
  complexionProducts,
} from "@/lib/shade-data";

interface ResultsProps {
  result: ShadeResult;
  image: string | null;
  onRetry: () => void;
}

const usageLabels: Record<string, string> = {
  Blush: "Blush",
  "Blush Alt": "Blush Alternative",
  Bronzer: "Bronzer",
  Highlighter: "Highlighter",
  "All-Over Tint": "All-Over Tint",
  "Tint Alt": "Tint Alternative",
  "Colorless Glow": "Colorless Glow",
};

const usageIcons: Record<string, string> = {
  Blush: "cheeks",
  "Blush Alt": "cheeks",
  Bronzer: "sun",
  Highlighter: "sparkle",
  "All-Over Tint": "glow",
  "Tint Alt": "glow",
  "Colorless Glow": "drop",
};

function UsageIcon({ type }: { type: string }) {
  const icon = usageIcons[type] || "glow";
  const icons: Record<string, string> = {
    cheeks: "○",
    sun: "☀",
    sparkle: "✦",
    glow: "◐",
    drop: "◉",
  };
  return <span className="text-lg">{icons[icon]}</span>;
}

export function Results({ result, image, onRetry }: ResultsProps) {
  const [showAllCoverage, setShowAllCoverage] = useState(false);
  const { analysis, miracleBalm, complexion } = result;

  // Split MB recs into primary and alternates, with Tint always first
  const usagePriority = ["All-Over Tint", "Blush", "Bronzer", "Highlighter", "Colorless Glow"];
  const primaryMB = miracleBalm
    .filter((r) => r.type === "Primary")
    .sort((a, b) => {
      const aIdx = usagePriority.indexOf(a.usage);
      const bIdx = usagePriority.indexOf(b.usage);
      return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
    });
  const altMB = miracleBalm.filter((r) => r.type === "Alt");

  const confidenceColor = {
    high: "text-green-700 bg-green-50 border-green-200",
    medium: "text-amber-700 bg-amber-50 border-amber-200",
    low: "text-red-700 bg-red-50 border-red-200",
  }[analysis.confidence] || "text-gray-700 bg-gray-50 border-gray-200";

  return (
    <div className="w-full">
      {/* Your Analysis */}
      <div className="text-center mb-8">
        <h1 className="text-3xl mb-2" style={{ fontWeight: 300 }}>
          Your Shade Match
        </h1>
      </div>

      {/* Profile card */}
      <div className="flex items-start gap-4 mb-6 p-4 rounded bg-white border border-[var(--jrb-border)]">
        {image && (
          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border border-[var(--jrb-border)]">
            <img
              src={image}
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
              {analysis.skinTone}
            </span>
            <span className="text-[var(--jrb-muted)]">·</span>
            <span
              className="text-sm uppercase tracking-wider text-[var(--jrb-muted)]"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              {analysis.undertone} undertone
            </span>
          </div>
          <p
            className="text-sm text-[var(--jrb-brown)] leading-relaxed"
            style={{ fontFamily: "system-ui, sans-serif", fontWeight: 400 }}
          >
            {analysis.reasoning}
          </p>
          <div className="mt-2">
            <span
              className={`inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${confidenceColor}`}
              style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
            >
              {analysis.confidence} confidence
            </span>
          </div>
        </div>
      </div>

      {/* MIRACLE BALM SECTION */}
      <div className="section-divider" />
      <h2 className="text-2xl mb-1" style={{ fontWeight: 300 }}>
        Miracle Balm
      </h2>
      <p
        className="text-sm text-[var(--jrb-muted)] mb-5"
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        Your personalized shades for every use
      </p>

      {/* Primary recommendations */}
      <div className="space-y-3 mb-6">
        {primaryMB.map((rec) => (
          <div key={rec.usage} className="shade-card">
            <div className="flex items-start gap-3">
              <div
                className="shade-swatch"
                style={{
                  backgroundColor: shadeSwatches[rec.shade] || "#ccc",
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <UsageIcon type={rec.usage} />
                  <span
                    className="text-[10px] uppercase tracking-wider text-[var(--jrb-muted)]"
                    style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
                  >
                    {usageLabels[rec.usage] || rec.usage}
                  </span>
                </div>
                <p
                  className="text-base font-medium text-[var(--jrb-brown)] mb-1"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  {rec.shade}
                </p>
                <p
                  className="text-sm text-[var(--jrb-muted)] leading-relaxed"
                  style={{ fontFamily: "system-ui, sans-serif", fontWeight: 400 }}
                >
                  {rec.copy}
                </p>
                <a
                  href={miracleBalmUrls[rec.shade] || "https://jonesroadbeauty.com/products/miracle-balm"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-[10px] uppercase tracking-wider text-[var(--jrb-brown)] border-b border-[var(--jrb-brown)] pb-0.5 hover:text-[var(--jrb-gold)] hover:border-[var(--jrb-gold)] transition-colors"
                  style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
                >
                  Shop {rec.shade}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alternate shades */}
      {altMB.length > 0 && (
        <>
          <p
            className="text-xs uppercase tracking-wider text-[var(--jrb-muted)] mb-3"
            style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
          >
            Also consider
          </p>
          <div className="space-y-3 mb-6">
            {altMB.map((rec) => (
              <div
                key={rec.usage}
                className="flex items-center gap-3 p-3 rounded border border-dashed border-[var(--jrb-border)]"
              >
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0 border border-[var(--jrb-border)]"
                  style={{
                    backgroundColor: shadeSwatches[rec.shade] || "#ccc",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <span
                    className="text-sm font-medium text-[var(--jrb-brown)]"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                  >
                    {rec.shade}
                  </span>
                  <span className="text-[var(--jrb-muted)] mx-1">·</span>
                  <span
                    className="text-xs text-[var(--jrb-muted)]"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                  >
                    {usageLabels[rec.usage] || rec.usage}
                  </span>
                </div>
                <a
                  href={miracleBalmUrls[rec.shade] || "https://jonesroadbeauty.com/products/miracle-balm"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase tracking-wider text-[var(--jrb-brown)] hover:text-[var(--jrb-gold)] transition-colors flex-shrink-0"
                  style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
                >
                  Shop
                </a>
              </div>
            ))}
          </div>
        </>
      )}

      {/* COMPLEXION SECTION */}
      <div className="section-divider" />
      <h2 className="text-2xl mb-1" style={{ fontWeight: 300 }}>
        Your Complexion Routine
      </h2>
      <p
        className="text-sm text-[var(--jrb-muted)] mb-5"
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        Based on your {analysis.skinTone.toLowerCase()},{" "}
        {analysis.undertone.toLowerCase()} skin — here&apos;s your full routine
      </p>

      <div className="space-y-3 mb-6">
        {/* Step 1: Base */}
        {complexion.shades && (
          <div className="shade-card">
            <div className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs text-white"
                style={{ background: "var(--jrb-brown)", fontFamily: "system-ui, sans-serif", fontWeight: 700 }}
              >
                1
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[10px] uppercase tracking-wider text-[var(--jrb-muted)] mb-1"
                  style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
                >
                  Base — sheer to light-medium coverage
                </p>
                <p
                  className="text-base font-medium text-[var(--jrb-brown)] mb-0.5"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  Just Enough Tinted Moisturizer or What The Foundation
                </p>
                <p
                  className="text-base font-semibold text-[var(--jrb-brown)] mb-2"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  Shade: {complexion.shades.wtfShade}
                </p>
                <p
                  className="text-sm text-[var(--jrb-muted)] leading-relaxed mb-3"
                  style={{ fontFamily: "system-ui, sans-serif", fontWeight: 400 }}
                >
                  JETM for a lighter, dewier finish. WTF for more coverage and hydration.
                  Both in the same shade — pick based on how much coverage you want.
                </p>
                <div className="flex gap-2">
                  <a
                    href="https://jonesroadbeauty.com/products/just-enough-tinted-moisturizer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] uppercase tracking-wider text-[var(--jrb-brown)] border-b border-[var(--jrb-brown)] pb-0.5 hover:text-[var(--jrb-gold)] hover:border-[var(--jrb-gold)] transition-colors"
                    style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
                  >
                    Shop JETM
                  </a>
                  <span className="text-[var(--jrb-muted)]">·</span>
                  <a
                    href="https://jonesroadbeauty.com/products/what-the-foundation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] uppercase tracking-wider text-[var(--jrb-brown)] border-b border-[var(--jrb-brown)] pb-0.5 hover:text-[var(--jrb-gold)] hover:border-[var(--jrb-gold)] transition-colors"
                    style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
                  >
                    Shop WTF
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Face Pencil */}
        {complexion.shades && (
          <div className="shade-card">
            <div className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs text-white"
                style={{ background: "var(--jrb-brown)", fontFamily: "system-ui, sans-serif", fontWeight: 700 }}
              >
                2
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[10px] uppercase tracking-wider text-[var(--jrb-muted)] mb-1"
                  style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
                >
                  Conceal — targeted coverage
                </p>
                <p
                  className="text-base font-medium text-[var(--jrb-brown)] mb-0.5"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  The Face Pencil
                </p>
                <div className="flex gap-4 mb-2">
                  <div>
                    <p
                      className="text-[10px] uppercase tracking-wider text-[var(--jrb-muted)]"
                      style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
                    >
                      Face
                    </p>
                    <p
                      className="text-base font-semibold text-[var(--jrb-brown)]"
                      style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                      Shade {complexion.shades.facePencilFace}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-[10px] uppercase tracking-wider text-[var(--jrb-muted)]"
                      style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
                    >
                      Under Eye
                    </p>
                    <p
                      className="text-base font-semibold text-[var(--jrb-brown)]"
                      style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                      Shade {complexion.shades.facePencilEye}
                    </p>
                  </div>
                </div>
                <p
                  className="text-sm text-[var(--jrb-muted)] leading-relaxed mb-3"
                  style={{ fontFamily: "system-ui, sans-serif", fontWeight: 400 }}
                >
                  Use the face shade for redness, spots, and blemishes. The lighter
                  under-eye shade brightens dark circles.
                </p>
                <a
                  href="https://jonesroadbeauty.com/products/the-face-pencil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase tracking-wider text-[var(--jrb-brown)] border-b border-[var(--jrb-brown)] pb-0.5 hover:text-[var(--jrb-gold)] hover:border-[var(--jrb-gold)] transition-colors"
                  style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
                >
                  Shop The Face Pencil
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Neutralizer (if needed) */}
        {complexion.needsNeutralizer && complexion.shades?.neutralizer && (
          <div className="shade-card" style={{ background: "#f5f0ea", borderColor: "transparent" }}>
            <div className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs text-white"
                style={{ background: "var(--jrb-gold)", fontFamily: "system-ui, sans-serif", fontWeight: 700 }}
              >
                +
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[10px] uppercase tracking-wider text-[var(--jrb-gold)] mb-1"
                  style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
                >
                  Color correct — use before face pencil
                </p>
                <p
                  className="text-base font-medium text-[var(--jrb-brown)] mb-0.5"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  The Neutralizer Pencil
                </p>
                <p
                  className="text-base font-semibold text-[var(--jrb-brown)] mb-2"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  Shade: {complexion.shades.neutralizer}
                </p>
                <p
                  className="text-sm text-[var(--jrb-muted)] leading-relaxed mb-3"
                  style={{ fontFamily: "system-ui, sans-serif", fontWeight: 400 }}
                >
                  Apply under your Face Pencil on dark circles and discoloration.
                  The peachy tone cancels blue and purple undertones.
                </p>
                <a
                  href="https://jonesroadbeauty.com/products/the-neutralizer-pencil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase tracking-wider text-[var(--jrb-brown)] border-b border-[var(--jrb-brown)] pb-0.5 hover:text-[var(--jrb-gold)] hover:border-[var(--jrb-gold)] transition-colors"
                  style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
                >
                  Shop Neutralizer Pencil
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Step 3/4: Tinted Face Powder */}
        {complexion.shades && (
          <div className="shade-card">
            <div className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs text-white"
                style={{ background: "var(--jrb-brown)", fontFamily: "system-ui, sans-serif", fontWeight: 700 }}
              >
                3
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[10px] uppercase tracking-wider text-[var(--jrb-muted)] mb-1"
                  style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
                >
                  Set — optional finishing step
                </p>
                <p
                  className="text-base font-medium text-[var(--jrb-brown)] mb-0.5"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  Tinted Face Powder
                </p>
                <p
                  className="text-base font-semibold text-[var(--jrb-brown)] mb-2"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  Shade: {complexion.shades.tintedPowder}
                </p>
                <p
                  className="text-sm text-[var(--jrb-muted)] leading-relaxed mb-3"
                  style={{ fontFamily: "system-ui, sans-serif", fontWeight: 400 }}
                >
                  Sets your base, controls shine, and extends wear. Light dusting on the T-zone is all you need.
                </p>
                <a
                  href="https://jonesroadbeauty.com/products/tinted-face-powder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase tracking-wider text-[var(--jrb-brown)] border-b border-[var(--jrb-brown)] pb-0.5 hover:text-[var(--jrb-gold)] hover:border-[var(--jrb-gold)] transition-colors"
                  style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
                >
                  Shop Face Powder
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="section-divider" />
      <div className="space-y-3">
        <a
          href="/feedback"
          className="jrb-button w-full block text-center"
        >
          Give Feedback on Your Match
        </a>
        <button onClick={onRetry} className="jrb-button jrb-button-secondary w-full">
          Try Again With a New Photo
        </button>
      </div>
    </div>
  );
}
