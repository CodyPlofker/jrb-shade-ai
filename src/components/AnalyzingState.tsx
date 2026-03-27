"use client";

interface AnalyzingStateProps {
  image: string | null;
}

export function AnalyzingState({ image }: AnalyzingStateProps) {
  return (
    <div className="w-full flex flex-col items-center">
      <h2
        className="text-2xl mb-6 text-center"
        style={{ fontWeight: 300 }}
      >
        Analyzing Your Skin Tone
      </h2>

      {/* Photo with overlay */}
      <div className="relative w-48 h-48 rounded-full overflow-hidden mb-8 border-2 border-[var(--jrb-border)]">
        {image && (
          <img
            src={image}
            alt="Analyzing"
            className="w-full h-full object-cover"
          />
        )}
        {/* Pulsing overlay */}
        <div className="absolute inset-0 bg-[var(--jrb-cream)] opacity-30 analyzing-pulse rounded-full" />
      </div>

      {/* Progress text */}
      <div className="text-center space-y-2">
        <p
          className="text-sm text-[var(--jrb-muted)] uppercase tracking-wider"
          style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
        >
          Reading your skin tone & undertone
        </p>
        <p className="text-sm text-[var(--jrb-muted)]" style={{ fontFamily: "system-ui, sans-serif" }}>
          This takes a few seconds...
        </p>
      </div>

      {/* Animated dots */}
      <div className="flex gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-[var(--jrb-gold)]"
            style={{
              animation: `pulse-ring 1.5s ease-in-out ${i * 0.3}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
