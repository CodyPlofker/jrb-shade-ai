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

  // Split MB recs into primary and alternates
  const primaryMB = miracleBalm.filter((r) => r.type === "Primary");
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
        Complexion Products
      </h2>
      <p
        className="text-sm text-[var(--jrb-muted)] mb-5"
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        Your {analysis.skinTone.toLowerCase()}, {analysis.undertone.toLowerCase()}{" "}
        skin matches these products
      </p>

      {/* Hero recommendation */}
      {complexion.hero && (
        <div className="shade-card mb-4 border-[var(--jrb-gold)]">
          <p
            className="text-[10px] uppercase tracking-wider text-[var(--jrb-gold)] mb-2"
            style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
          >
            Recommended for you
          </p>
          {(() => {
            const product =
              complexionProducts[complexion.hero.heroProduct];
            if (!product) return null;
            return (
              <div>
                <p
                  className="text-lg font-medium text-[var(--jrb-brown)] mb-1"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  {product.name}
                </p>
                <p
                  className="text-sm text-[var(--jrb-muted)] mb-3 leading-relaxed"
                  style={{ fontFamily: "system-ui, sans-serif", fontWeight: 400 }}
                >
                  {product.description}
                </p>
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="jrb-button jrb-button-primary w-full text-center"
                >
                  Shop {product.name.split(" ").slice(-2).join(" ")}
                </a>
              </div>
            );
          })()}
        </div>
      )}

      {/* Coverage options toggle */}
      <button
        onClick={() => setShowAllCoverage(!showAllCoverage)}
        className="text-sm text-[var(--jrb-brown)] mb-4 flex items-center gap-1"
        style={{ fontFamily: "system-ui, sans-serif", fontWeight: 500 }}
      >
        <span
          className="transform transition-transform"
          style={{
            display: "inline-block",
            transform: showAllCoverage ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          ›
        </span>
        {showAllCoverage ? "Hide" : "See all"} coverage options
      </button>

      {showAllCoverage && (
        <div className="space-y-3 mb-6">
          {complexion.allOptions.map((opt) => {
            const product = complexionProducts[opt.heroProduct];
            if (!product) return null;
            return (
              <div
                key={opt.coverage}
                className="flex items-center justify-between p-3 rounded border border-[var(--jrb-border)]"
              >
                <div>
                  <p
                    className="text-[10px] uppercase tracking-wider text-[var(--jrb-muted)] mb-0.5"
                    style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
                  >
                    {opt.coverage} coverage
                  </p>
                  <p
                    className="text-sm font-medium text-[var(--jrb-brown)]"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                  >
                    {product.name}
                  </p>
                </div>
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="jrb-button jrb-button-secondary text-[10px] px-4 h-8"
                >
                  Shop
                </a>
              </div>
            );
          })}
        </div>
      )}

      {/* Neutralizer recommendation */}
      {complexion.needsNeutralizer && (
        <div className="p-4 rounded bg-[#f5f0ea] mb-6">
          <p
            className="text-[10px] uppercase tracking-wider text-[var(--jrb-muted)] mb-2"
            style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
          >
            Recommended add-on
          </p>
          <p
            className="text-sm font-medium text-[var(--jrb-brown)] mb-1"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            The Neutralizer
          </p>
          <p
            className="text-sm text-[var(--jrb-muted)] mb-3"
            style={{ fontFamily: "system-ui, sans-serif", fontWeight: 400 }}
          >
            With {analysis.undertone.toLowerCase()} undertones, a color-correcting
            neutralizer can help even out redness before your foundation.
          </p>
          <a
            href="https://jonesroadbeauty.com/products/the-neutralizer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-wider text-[var(--jrb-brown)] border-b border-[var(--jrb-brown)] pb-0.5 hover:text-[var(--jrb-gold)] hover:border-[var(--jrb-gold)] transition-colors"
            style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
          >
            Shop The Neutralizer
          </a>
        </div>
      )}

      {/* Face Pencil */}
      {complexionProducts["Face Pencil"] && (
        <div className="p-4 rounded bg-white border border-[var(--jrb-border)] mb-6">
          <p
            className="text-[10px] uppercase tracking-wider text-[var(--jrb-muted)] mb-2"
            style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
          >
            For targeted coverage
          </p>
          <p
            className="text-sm font-medium text-[var(--jrb-brown)] mb-1"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            The Face Pencil
          </p>
          <p
            className="text-sm text-[var(--jrb-muted)] mb-3"
            style={{ fontFamily: "system-ui, sans-serif", fontWeight: 400 }}
          >
            {complexionProducts["Face Pencil"].description}
          </p>
          <a
            href={complexionProducts["Face Pencil"].url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-wider text-[var(--jrb-brown)] border-b border-[var(--jrb-brown)] pb-0.5 hover:text-[var(--jrb-gold)] hover:border-[var(--jrb-gold)] transition-colors"
            style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
          >
            Shop The Face Pencil
          </a>
        </div>
      )}

      {/* Retry button */}
      <div className="section-divider" />
      <button onClick={onRetry} className="jrb-button jrb-button-secondary w-full">
        Try Again With a New Photo
      </button>
    </div>
  );
}
