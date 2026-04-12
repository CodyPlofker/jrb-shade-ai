// Miracle Balm shade recommendations by skin tone × usage × undertone (V2)
// Source: 30,697 shade-match consultations + 2,735 Junip cross-references
// V2 changes: undertone-aware tint defaults, de-prioritized Magic/Happy Hour,
// specific product corrections based on satisfaction data

export type SkinTone =
  | "Pale"
  | "Fair"
  | "Light"
  | "Light-Medium"
  | "Medium"
  | "Medium-Dark"
  | "Dark"
  | "Deep";

export type Undertone = "Cool" | "Warm" | "Neutral";

export type MBUsage =
  | "Blush"
  | "Blush Alt"
  | "Bronzer"
  | "Highlighter"
  | "All-Over Tint"
  | "Tint Alt"
  | "Colorless Glow";

export type CoveragePreference = "Sheer" | "Light-Medium" | "Full";

export interface MBRecommendation {
  skinTone: SkinTone;
  usage: MBUsage;
  type: "Primary" | "Alt" | "—";
  shade: string;
  copy: string;
  undertone?: Undertone | null; // V2: null/undefined = all undertones
}

export interface ComplexionRecommendation {
  skinTone: SkinTone;
  undertone: Undertone;
  coverage: CoveragePreference;
  foundationStick: string;
  wtf: string;
  jetm: string;
  facePencil: string;
  neutralizer: string;
  heroProduct: string;
  notes: string;
}

// Miracle Balm shade lookup table — V2
// Changes from V1:
// - All-Over Tint now varies by undertone (Cool→Dusty Rose, Neutral→Flushed/Chic, Warm→Bronze/Sunkissed)
// - Highlighter: Golden Hour replaces Magic Hour/Happy Hour (68% and 60% positive respectively)
// - Miami Beach recommended more broadly (92% positive)
// - Pinky Bronze excluded from Pale/Fair (gets "too dark" complaints)
export const miracleBalmShades: MBRecommendation[] = [
  // ── Pale ──
  { skinTone: "Pale", usage: "Blush", type: "Primary", shade: "Flushed", copy: "Flushed gives you a cool pink flush with a subtle sheen — just enough color to look naturally rosy, never overdone." },
  { skinTone: "Pale", usage: "Blush Alt", type: "Alt", shade: "Miami Beach", copy: "Miami Beach adds a warm, peachy coral flush — a great option if you want a sun-warmed glow instead of pink." },
  // V2: Removed Pinky Bronze for Pale — gets "too dark" feedback from Fair/Light customers
  { skinTone: "Pale", usage: "Bronzer", type: "Primary", shade: "Bronze", copy: "Bronze adds a soft, golden warmth that looks sun-touched without going too deep on fair complexions." },
  // V2: Golden Hour replaces Happy Hour (Happy Hour 60% positive → Golden Hour universally strong)
  { skinTone: "Pale", usage: "Highlighter", type: "Primary", shade: "Golden Hour", copy: "Golden Hour gives you a warm, golden glow — luminous highlight that catches light beautifully." },
  // V2: All-Over Tint now varies by undertone
  { skinTone: "Pale", usage: "All-Over Tint", type: "Primary", shade: "Dusty Rose", copy: "Dusty Rose is a cool, rosy pink that warms up your complexion with a sheer wash of color — like your skin on its best day.", undertone: "Cool" },
  { skinTone: "Pale", usage: "All-Over Tint", type: "Primary", shade: "Flushed", copy: "Flushed delivers a sheer, natural flush that evens things out and adds a quiet glow — effortless and universally flattering.", undertone: "Neutral" },
  { skinTone: "Pale", usage: "All-Over Tint", type: "Primary", shade: "Chic", copy: "Chic adds a warm, sophisticated tint that brings out the warmth in your complexion — subtle and elegant.", undertone: "Warm" },
  { skinTone: "Pale", usage: "Colorless Glow", type: "Primary", shade: "Au Naturel", copy: "Au Naturel gives you all the moisture and light-reflecting luminosity with zero color — just healthy, dewy skin." },

  // ── Fair ──
  { skinTone: "Fair", usage: "Blush", type: "Primary", shade: "Flushed", copy: "Flushed delivers a cool pink flush with a subtle sheen — the kind of color that looks like it came from within." },
  { skinTone: "Fair", usage: "Blush Alt", type: "Alt", shade: "Miami Beach", copy: "If you lean warmer or prefer a coral-peach flush over pink, Miami Beach gives you that sun-warmed glow." },
  // V2: Removed Pinky Bronze for Fair — gets "too dark" feedback
  { skinTone: "Fair", usage: "Bronzer", type: "Primary", shade: "Bronze", copy: "Bronze warms up your complexion with a soft, golden warmth — natural-looking that won't go muddy on lighter skin." },
  // V2: Golden Hour replaces Happy Hour
  { skinTone: "Fair", usage: "Highlighter", type: "Primary", shade: "Golden Hour", copy: "Golden Hour catches light with a warm, golden shimmer that enhances fair complexions beautifully." },
  // V2: Undertone-aware tint defaults
  { skinTone: "Fair", usage: "All-Over Tint", type: "Primary", shade: "Dusty Rose", copy: "Dusty Rose gives you a sheer, rosy wash that evens things out and adds a quiet glow — effortless, like you just got back from a walk.", undertone: "Cool" },
  { skinTone: "Fair", usage: "All-Over Tint", type: "Primary", shade: "Chic", copy: "Chic adds a warm, sophisticated tint — a subtle bronze wash that brings out the best in neutral skin.", undertone: "Neutral" },
  { skinTone: "Fair", usage: "All-Over Tint", type: "Primary", shade: "Bronze", copy: "Bronze gives your warm undertones a beautiful golden glow — like a sheer wash of sunlight.", undertone: "Warm" },
  { skinTone: "Fair", usage: "Tint Alt", type: "Alt", shade: "Flushed", copy: "If you want a lighter, pinker wash — Flushed adds a fresh, rosy tint that's universally flattering." },
  { skinTone: "Fair", usage: "Colorless Glow", type: "Primary", shade: "Au Naturel", copy: "Au Naturel delivers moisture and luminosity with no color at all — just your skin, but dewier." },

  // ── Light ──
  { skinTone: "Light", usage: "Blush", type: "Primary", shade: "Flushed", copy: "Flushed is a cool pink that gives you a natural-looking flush — the shade equivalent of a brisk morning walk." },
  { skinTone: "Light", usage: "Blush Alt", type: "Alt", shade: "Miami Beach", copy: "Miami Beach is your warm-weather option — a peachy, coral flush if you prefer warmth over pink." },
  { skinTone: "Light", usage: "Bronzer", type: "Primary", shade: "Bronze", copy: "Bronze has warm golden undertones that add a hint of sun — the right depth for light skin without going heavy." },
  // V2: Golden Hour replaces Magic Hour (Magic Hour 68% positive)
  { skinTone: "Light", usage: "Highlighter", type: "Primary", shade: "Golden Hour", copy: "Golden Hour gives you a warm, golden glow — like the last hour of sunlight on your cheekbones." },
  // V2: Undertone-aware tint defaults
  { skinTone: "Light", usage: "All-Over Tint", type: "Primary", shade: "Dusty Rose", copy: "Dusty Rose gives light skin a rosy, healthy warmth — a sheer wash that makes you look naturally put-together.", undertone: "Cool" },
  { skinTone: "Light", usage: "All-Over Tint", type: "Primary", shade: "Flushed", copy: "Flushed delivers a sheer, natural pink tint that evens out your skin and adds a quiet glow.", undertone: "Neutral" },
  { skinTone: "Light", usage: "All-Over Tint", type: "Primary", shade: "Sunkissed", copy: "Sunkissed gives warm-toned light skin a beautiful golden warmth — like a sheer wash of sunshine.", undertone: "Warm" },
  { skinTone: "Light", usage: "Tint Alt", type: "Alt", shade: "Chic", copy: "Chic adds a deeper, warmer dimension — a sophisticated bronze-tint if you want to look slightly sun-warmed." },
  { skinTone: "Light", usage: "Colorless Glow", type: "Primary", shade: "Au Naturel", copy: "Au Naturel is pure glow — all the moisture and light-reflecting finish with zero color commitment." },

  // ── Light-Medium ──
  { skinTone: "Light-Medium", usage: "Blush", type: "Primary", shade: "Flushed", copy: "Flushed gives you a cool pink flush that reads as naturally rosy on your skin tone — sheer and easy to wear." },
  { skinTone: "Light-Medium", usage: "Blush Alt", type: "Alt", shade: "Pinched Cheeks", copy: "If you want something warmer — Pinched Cheeks gives you the look of a genuine flush, like you just came in from the cold." },
  { skinTone: "Light-Medium", usage: "Bronzer", type: "Primary", shade: "Sunkissed", copy: "Sunkissed adds warm, golden dimension — like you caught a little sun on vacation. Just the right depth for your tone." },
  // V2: Golden Hour replaces Magic Hour
  { skinTone: "Light-Medium", usage: "Highlighter", type: "Primary", shade: "Golden Hour", copy: "Golden Hour gives you a warm, golden highlight that enhances your natural glow without sitting on top of your skin." },
  // V2: Undertone-aware tint defaults
  { skinTone: "Light-Medium", usage: "All-Over Tint", type: "Primary", shade: "Dusty Rose", copy: "Dusty Rose delivers a cool, rosy wash that gives your complexion a healthy, even glow — like your skin on its best day.", undertone: "Cool" },
  { skinTone: "Light-Medium", usage: "All-Over Tint", type: "Primary", shade: "Chic", copy: "Chic delivers a warm, sophisticated tint that complements neutral undertones beautifully — polished and effortless.", undertone: "Neutral" },
  { skinTone: "Light-Medium", usage: "All-Over Tint", type: "Primary", shade: "Sunkissed", copy: "Sunkissed enhances your warm undertones with a golden bronze wash — your skin, but sun-warmed and glowing.", undertone: "Warm" },
  { skinTone: "Light-Medium", usage: "Tint Alt", type: "Alt", shade: "Tawny", copy: "If you lean warmer or want more depth — Tawny adds a rich, warm tint that enhances golden and olive undertones beautifully." },
  { skinTone: "Light-Medium", usage: "Colorless Glow", type: "Primary", shade: "Au Naturel", copy: "Au Naturel gives you a dewy, luminous finish — all glow, no color. Perfect on its own or layered under another shade." },

  // ── Medium ──
  { skinTone: "Medium", usage: "Blush", type: "Primary", shade: "Flushed", copy: "Flushed gives you a cool pink pop — a fresh, subtle flush that shows up beautifully on medium complexions." },
  { skinTone: "Medium", usage: "Blush Alt", type: "Alt", shade: "Pinched Cheeks", copy: "Pinched Cheeks is warmer and more natural — if you prefer coral over pink, this one melts into medium skin like a real flush." },
  { skinTone: "Medium", usage: "Bronzer", type: "Primary", shade: "Sunkissed", copy: "Sunkissed warms up your complexion with golden-bronze depth — enough to sculpt and warm without looking heavy." },
  // V2: Golden Hour replaces Magic Hour
  { skinTone: "Medium", usage: "Highlighter", type: "Primary", shade: "Golden Hour", copy: "Golden Hour brings a warm, golden luminosity that catches light and enhances your skin's natural glow." },
  // V2: Undertone-aware tint defaults
  { skinTone: "Medium", usage: "All-Over Tint", type: "Primary", shade: "Chic", copy: "Chic delivers a warm, sophisticated tint that enhances cool-toned medium skin beautifully.", undertone: "Cool" },
  { skinTone: "Medium", usage: "All-Over Tint", type: "Primary", shade: "Tawny", copy: "Tawny is a rich, warm bronze tint that blends into your skin tone seamlessly — the definition of your skin, but better.", undertone: "Neutral" },
  { skinTone: "Medium", usage: "All-Over Tint", type: "Primary", shade: "Tawny", copy: "Tawny is a rich, warm bronze tint that blends beautifully with warm undertones — effortless and natural.", undertone: "Warm" },
  { skinTone: "Medium", usage: "Tint Alt", type: "Alt", shade: "Pinky Bronze", copy: "Pinky Bronze is a lighter, pinkish-bronze option — if you want a softer wash or something to brighten rather than deepen." },
  { skinTone: "Medium", usage: "Colorless Glow", type: "Primary", shade: "Au Naturel", copy: "Au Naturel gives your skin a dewy, healthy sheen — pure moisture and glow with nothing to overthink." },

  // ── Medium-Dark ──
  { skinTone: "Medium-Dark", usage: "Blush", type: "Primary", shade: "Pinched Cheeks", copy: "Pinched Cheeks gives you a genuine, natural flush — the kind that shows up as warmth on deeper skin without going chalky." },
  { skinTone: "Medium-Dark", usage: "Blush Alt", type: "Alt", shade: "Miami Beach", copy: "Miami Beach brings a warm, peachy coral flush — a great option if you prefer a brighter, sun-warmed pop of color." },
  { skinTone: "Medium-Dark", usage: "Bronzer", type: "Primary", shade: "Sunkissed", copy: "Sunkissed adds warm, golden definition — just enough to sculpt and warm your complexion naturally." },
  { skinTone: "Medium-Dark", usage: "Highlighter", type: "Primary", shade: "Golden Hour", copy: "Golden Hour is a warm, golden glow that catches light beautifully on deeper complexions — luminous, not ashy." },
  // V2: Undertone-aware tint defaults
  { skinTone: "Medium-Dark", usage: "All-Over Tint", type: "Primary", shade: "Tawny", copy: "Tawny melts into your skin tone with rich, warm depth — the effortless tint that makes you look polished.", undertone: "Cool" },
  { skinTone: "Medium-Dark", usage: "All-Over Tint", type: "Primary", shade: "Tawny", copy: "Tawny melts into your skin tone with rich, warm depth — the effortless tint that makes you look like you, polished.", undertone: "Neutral" },
  { skinTone: "Medium-Dark", usage: "All-Over Tint", type: "Primary", shade: "Sunkissed", copy: "Sunkissed gives a warm, golden-bronze wash — enhancing your natural warmth with sun-kissed depth.", undertone: "Warm" },
  { skinTone: "Medium-Dark", usage: "Tint Alt", type: "Alt", shade: "Cocoa Bronze", copy: "Cocoa Bronze adds a deeper, richer dimension if you want more sculpting power in your tint." },
  { skinTone: "Medium-Dark", usage: "Colorless Glow", type: "Primary", shade: "Au Naturel", copy: "Au Naturel gives your skin a gorgeous, dewy sheen — all the glow and moisture, no color to think about." },

  // ── Dark ──
  { skinTone: "Dark", usage: "Blush", type: "Primary", shade: "Cheeky", copy: "Cheeky is a rich berry that actually shows up on deeper complexions — vibrant color that reads as a true, dimensional flush." },
  { skinTone: "Dark", usage: "Blush Alt", type: "Alt", shade: "Miami Beach", copy: "Miami Beach brings a warm, coral pop — a brighter option if you want a peachy glow rather than berry tones." },
  { skinTone: "Dark", usage: "Bronzer", type: "Primary", shade: "Cocoa Bronze", copy: "Cocoa Bronze has the depth to actually sculpt and warm dark skin — a real bronzer that won't look ashy or gray." },
  { skinTone: "Dark", usage: "Highlighter", type: "Primary", shade: "Golden Hour", copy: "Golden Hour is a warm, golden glow that lights up dark complexions — highlight that looks like your skin is lit from within." },
  // V2: Undertone-aware tint defaults
  { skinTone: "Dark", usage: "All-Over Tint", type: "Primary", shade: "Cocoa Bronze", copy: "Cocoa Bronze adds a warm, rich depth across your complexion — enhancing your natural tone with a bronzed glow.", undertone: "Cool" },
  { skinTone: "Dark", usage: "All-Over Tint", type: "Primary", shade: "Sunkissed", copy: "Sunkissed adds a warm, bronze glow across your whole complexion — enhancing your natural depth with golden warmth.", undertone: "Neutral" },
  { skinTone: "Dark", usage: "All-Over Tint", type: "Primary", shade: "Sunkissed", copy: "Sunkissed adds a warm, golden-bronze glow that enhances your natural warmth beautifully.", undertone: "Warm" },
  { skinTone: "Dark", usage: "Colorless Glow", type: "Primary", shade: "Au Naturel", copy: "Au Naturel gives your skin a dewy, light-reflecting finish — pure moisture and radiance, letting your natural tone be the star." },

  // ── Deep ──
  { skinTone: "Deep", usage: "Blush", type: "Primary", shade: "Cheeky", copy: "Cheeky is a rich, multidimensional berry — one of the few shades vibrant enough to show up as a real blush on deep complexions." },
  { skinTone: "Deep", usage: "Blush Alt", type: "Alt", shade: "Miami Beach", copy: "Miami Beach adds a warm, coral-peach pop — a brighter, warmer alternative if you want something beyond berry." },
  { skinTone: "Deep", usage: "Bronzer", type: "Primary", shade: "Cocoa Bronze", copy: "Cocoa Bronze sculpts and warms the deepest skin tones — real depth and dimension that you can actually see." },
  { skinTone: "Deep", usage: "Highlighter", type: "Primary", shade: "Golden Hour", copy: "Golden Hour brings a warm, golden glow — rich, luminous highlight that makes deep skin look absolutely radiant." },
  // V2: Undertone-aware tint defaults
  { skinTone: "Deep", usage: "All-Over Tint", type: "Primary", shade: "Cocoa Bronze", copy: "Cocoa Bronze adds a warm, sculpting depth across your complexion — rich and luminous.", undertone: "Cool" },
  { skinTone: "Deep", usage: "All-Over Tint", type: "Primary", shade: "Cocoa Bronze", copy: "Cocoa Bronze enhances your natural richness with warm, sculpting depth.", undertone: "Neutral" },
  { skinTone: "Deep", usage: "All-Over Tint", type: "Primary", shade: "Sunkissed", copy: "Sunkissed adds a warm, golden bronze across your complexion — enhancing your natural richness with sun-warmed depth.", undertone: "Warm" },
  { skinTone: "Deep", usage: "Colorless Glow", type: "Primary", shade: "Au Naturel", copy: "Au Naturel is pure glow — dewy moisture and light-catching radiance that lets your natural skin tone do all the talking." },
];

// Complexion product recommendations by skin tone × undertone × coverage
// Source: jrb-complexion-quiz/quiz-logic.csv
export const complexionRecommendations: ComplexionRecommendation[] = [
  // Pale
  { skinTone: "Pale", undertone: "Cool", coverage: "Sheer", foundationStick: "FS-Pale-Cool-01", wtf: "WTF-Pale-Cool", jetm: "JETM-Pale-Cool", facePencil: "FP-Pale-Cool", neutralizer: "NTR-Pale-Cool", heroProduct: "JETM", notes: "Sheer coverage -> JETM hero. Cool undertone gets neutralizer recommendation." },
  { skinTone: "Pale", undertone: "Cool", coverage: "Light-Medium", foundationStick: "FS-Pale-Cool-01", wtf: "WTF-Pale-Cool", jetm: "JETM-Pale-Cool", facePencil: "FP-Pale-Cool", neutralizer: "NTR-Pale-Cool", heroProduct: "WTF", notes: "Light-Medium coverage -> WTF hero. Cool undertone gets neutralizer recommendation." },
  { skinTone: "Pale", undertone: "Cool", coverage: "Full", foundationStick: "FS-Pale-Cool-01", wtf: "WTF-Pale-Cool", jetm: "JETM-Pale-Cool", facePencil: "FP-Pale-Cool", neutralizer: "NTR-Pale-Cool", heroProduct: "Foundation Stick", notes: "Full coverage -> Foundation Stick hero. Cool undertone gets neutralizer recommendation." },
  { skinTone: "Pale", undertone: "Warm", coverage: "Sheer", foundationStick: "FS-Pale-Warm-01", wtf: "WTF-Pale-Warm", jetm: "JETM-Pale-Warm", facePencil: "FP-Pale-Warm", neutralizer: "N/A", heroProduct: "JETM", notes: "Sheer coverage -> JETM hero. Warm undertone typically does not need neutralizer." },
  { skinTone: "Pale", undertone: "Warm", coverage: "Light-Medium", foundationStick: "FS-Pale-Warm-01", wtf: "WTF-Pale-Warm", jetm: "JETM-Pale-Warm", facePencil: "FP-Pale-Warm", neutralizer: "N/A", heroProduct: "WTF", notes: "Light-Medium coverage -> WTF hero. Warm undertone typically does not need neutralizer." },
  { skinTone: "Pale", undertone: "Warm", coverage: "Full", foundationStick: "FS-Pale-Warm-01", wtf: "WTF-Pale-Warm", jetm: "JETM-Pale-Warm", facePencil: "FP-Pale-Warm", neutralizer: "N/A", heroProduct: "Foundation Stick", notes: "Full coverage -> Foundation Stick hero. Warm undertone typically does not need neutralizer." },
  { skinTone: "Pale", undertone: "Neutral", coverage: "Sheer", foundationStick: "FS-Pale-Neutral-01", wtf: "WTF-Pale-Neutral", jetm: "JETM-Pale-Neutral", facePencil: "FP-Pale-Neutral", neutralizer: "NTR-Pale-Neutral", heroProduct: "JETM", notes: "Sheer coverage -> JETM hero. Neutral undertone gets neutralizer recommendation." },
  { skinTone: "Pale", undertone: "Neutral", coverage: "Light-Medium", foundationStick: "FS-Pale-Neutral-01", wtf: "WTF-Pale-Neutral", jetm: "JETM-Pale-Neutral", facePencil: "FP-Pale-Neutral", neutralizer: "NTR-Pale-Neutral", heroProduct: "WTF", notes: "Light-Medium coverage -> WTF hero. Neutral undertone gets neutralizer recommendation." },
  { skinTone: "Pale", undertone: "Neutral", coverage: "Full", foundationStick: "FS-Pale-Neutral-01", wtf: "WTF-Pale-Neutral", jetm: "JETM-Pale-Neutral", facePencil: "FP-Pale-Neutral", neutralizer: "NTR-Pale-Neutral", heroProduct: "Foundation Stick", notes: "Full coverage -> Foundation Stick hero. Neutral undertone gets neutralizer recommendation." },

  // Fair
  { skinTone: "Fair", undertone: "Cool", coverage: "Sheer", foundationStick: "FS-Fair-Cool-01", wtf: "WTF-Fair-Cool", jetm: "JETM-Fair-Cool", facePencil: "FP-Fair-Cool", neutralizer: "NTR-Fair-Cool", heroProduct: "JETM", notes: "" },
  { skinTone: "Fair", undertone: "Cool", coverage: "Light-Medium", foundationStick: "FS-Fair-Cool-01", wtf: "WTF-Fair-Cool", jetm: "JETM-Fair-Cool", facePencil: "FP-Fair-Cool", neutralizer: "NTR-Fair-Cool", heroProduct: "WTF", notes: "" },
  { skinTone: "Fair", undertone: "Cool", coverage: "Full", foundationStick: "FS-Fair-Cool-01", wtf: "WTF-Fair-Cool", jetm: "JETM-Fair-Cool", facePencil: "FP-Fair-Cool", neutralizer: "NTR-Fair-Cool", heroProduct: "Foundation Stick", notes: "" },
  { skinTone: "Fair", undertone: "Warm", coverage: "Sheer", foundationStick: "FS-Fair-Warm-01", wtf: "WTF-Fair-Warm", jetm: "JETM-Fair-Warm", facePencil: "FP-Fair-Warm", neutralizer: "N/A", heroProduct: "JETM", notes: "" },
  { skinTone: "Fair", undertone: "Warm", coverage: "Light-Medium", foundationStick: "FS-Fair-Warm-01", wtf: "WTF-Fair-Warm", jetm: "JETM-Fair-Warm", facePencil: "FP-Fair-Warm", neutralizer: "N/A", heroProduct: "WTF", notes: "" },
  { skinTone: "Fair", undertone: "Warm", coverage: "Full", foundationStick: "FS-Fair-Warm-01", wtf: "WTF-Fair-Warm", jetm: "JETM-Fair-Warm", facePencil: "FP-Fair-Warm", neutralizer: "N/A", heroProduct: "Foundation Stick", notes: "" },
  { skinTone: "Fair", undertone: "Neutral", coverage: "Sheer", foundationStick: "FS-Fair-Neutral-01", wtf: "WTF-Fair-Neutral", jetm: "JETM-Fair-Neutral", facePencil: "FP-Fair-Neutral", neutralizer: "NTR-Fair-Neutral", heroProduct: "JETM", notes: "" },
  { skinTone: "Fair", undertone: "Neutral", coverage: "Light-Medium", foundationStick: "FS-Fair-Neutral-01", wtf: "WTF-Fair-Neutral", jetm: "JETM-Fair-Neutral", facePencil: "FP-Fair-Neutral", neutralizer: "NTR-Fair-Neutral", heroProduct: "WTF", notes: "" },
  { skinTone: "Fair", undertone: "Neutral", coverage: "Full", foundationStick: "FS-Fair-Neutral-01", wtf: "WTF-Fair-Neutral", jetm: "JETM-Fair-Neutral", facePencil: "FP-Fair-Neutral", neutralizer: "NTR-Fair-Neutral", heroProduct: "Foundation Stick", notes: "" },

  // Light
  { skinTone: "Light", undertone: "Cool", coverage: "Sheer", foundationStick: "FS-Light-Cool-01", wtf: "WTF-Light-Cool", jetm: "JETM-Light-Cool", facePencil: "FP-Light-Cool", neutralizer: "NTR-Light-Cool", heroProduct: "JETM", notes: "" },
  { skinTone: "Light", undertone: "Cool", coverage: "Light-Medium", foundationStick: "FS-Light-Cool-01", wtf: "WTF-Light-Cool", jetm: "JETM-Light-Cool", facePencil: "FP-Light-Cool", neutralizer: "NTR-Light-Cool", heroProduct: "WTF", notes: "" },
  { skinTone: "Light", undertone: "Cool", coverage: "Full", foundationStick: "FS-Light-Cool-01", wtf: "WTF-Light-Cool", jetm: "JETM-Light-Cool", facePencil: "FP-Light-Cool", neutralizer: "NTR-Light-Cool", heroProduct: "Foundation Stick", notes: "" },
  { skinTone: "Light", undertone: "Warm", coverage: "Sheer", foundationStick: "FS-Light-Warm-01", wtf: "WTF-Light-Warm", jetm: "JETM-Light-Warm", facePencil: "FP-Light-Warm", neutralizer: "N/A", heroProduct: "JETM", notes: "" },
  { skinTone: "Light", undertone: "Warm", coverage: "Light-Medium", foundationStick: "FS-Light-Warm-01", wtf: "WTF-Light-Warm", jetm: "JETM-Light-Warm", facePencil: "FP-Light-Warm", neutralizer: "N/A", heroProduct: "WTF", notes: "" },
  { skinTone: "Light", undertone: "Warm", coverage: "Full", foundationStick: "FS-Light-Warm-01", wtf: "WTF-Light-Warm", jetm: "JETM-Light-Warm", facePencil: "FP-Light-Warm", neutralizer: "N/A", heroProduct: "Foundation Stick", notes: "" },
  { skinTone: "Light", undertone: "Neutral", coverage: "Sheer", foundationStick: "FS-Light-Neutral-01", wtf: "WTF-Light-Neutral", jetm: "JETM-Light-Neutral", facePencil: "FP-Light-Neutral", neutralizer: "NTR-Light-Neutral", heroProduct: "JETM", notes: "" },
  { skinTone: "Light", undertone: "Neutral", coverage: "Light-Medium", foundationStick: "FS-Light-Neutral-01", wtf: "WTF-Light-Neutral", jetm: "JETM-Light-Neutral", facePencil: "FP-Light-Neutral", neutralizer: "NTR-Light-Neutral", heroProduct: "WTF", notes: "" },
  { skinTone: "Light", undertone: "Neutral", coverage: "Full", foundationStick: "FS-Light-Neutral-01", wtf: "WTF-Light-Neutral", jetm: "JETM-Light-Neutral", facePencil: "FP-Light-Neutral", neutralizer: "NTR-Light-Neutral", heroProduct: "Foundation Stick", notes: "" },

  // Light-Medium
  { skinTone: "Light-Medium", undertone: "Cool", coverage: "Sheer", foundationStick: "FS-LightMed-Cool-01", wtf: "WTF-LightMed-Cool", jetm: "JETM-LightMed-Cool", facePencil: "FP-LightMed-Cool", neutralizer: "NTR-LightMed-Cool", heroProduct: "JETM", notes: "" },
  { skinTone: "Light-Medium", undertone: "Cool", coverage: "Light-Medium", foundationStick: "FS-LightMed-Cool-01", wtf: "WTF-LightMed-Cool", jetm: "JETM-LightMed-Cool", facePencil: "FP-LightMed-Cool", neutralizer: "NTR-LightMed-Cool", heroProduct: "WTF", notes: "" },
  { skinTone: "Light-Medium", undertone: "Cool", coverage: "Full", foundationStick: "FS-LightMed-Cool-01", wtf: "WTF-LightMed-Cool", jetm: "JETM-LightMed-Cool", facePencil: "FP-LightMed-Cool", neutralizer: "NTR-LightMed-Cool", heroProduct: "Foundation Stick", notes: "" },
  { skinTone: "Light-Medium", undertone: "Warm", coverage: "Sheer", foundationStick: "FS-LightMed-Warm-01", wtf: "WTF-LightMed-Warm", jetm: "JETM-LightMed-Warm", facePencil: "FP-LightMed-Warm", neutralizer: "N/A", heroProduct: "JETM", notes: "" },
  { skinTone: "Light-Medium", undertone: "Warm", coverage: "Light-Medium", foundationStick: "FS-LightMed-Warm-01", wtf: "WTF-LightMed-Warm", jetm: "JETM-LightMed-Warm", facePencil: "FP-LightMed-Warm", neutralizer: "N/A", heroProduct: "WTF", notes: "" },
  { skinTone: "Light-Medium", undertone: "Warm", coverage: "Full", foundationStick: "FS-LightMed-Warm-01", wtf: "WTF-LightMed-Warm", jetm: "JETM-LightMed-Warm", facePencil: "FP-LightMed-Warm", neutralizer: "N/A", heroProduct: "Foundation Stick", notes: "" },
  { skinTone: "Light-Medium", undertone: "Neutral", coverage: "Sheer", foundationStick: "FS-LightMed-Neutral-01", wtf: "WTF-LightMed-Neutral", jetm: "JETM-LightMed-Neutral", facePencil: "FP-LightMed-Neutral", neutralizer: "NTR-LightMed-Neutral", heroProduct: "JETM", notes: "" },
  { skinTone: "Light-Medium", undertone: "Neutral", coverage: "Light-Medium", foundationStick: "FS-LightMed-Neutral-01", wtf: "WTF-LightMed-Neutral", jetm: "JETM-LightMed-Neutral", facePencil: "FP-LightMed-Neutral", neutralizer: "NTR-LightMed-Neutral", heroProduct: "WTF", notes: "" },
  { skinTone: "Light-Medium", undertone: "Neutral", coverage: "Full", foundationStick: "FS-LightMed-Neutral-01", wtf: "WTF-LightMed-Neutral", jetm: "JETM-LightMed-Neutral", facePencil: "FP-LightMed-Neutral", neutralizer: "NTR-LightMed-Neutral", heroProduct: "Foundation Stick", notes: "" },

  // Medium
  { skinTone: "Medium", undertone: "Cool", coverage: "Sheer", foundationStick: "FS-Medium-Cool-01", wtf: "WTF-Medium-Cool", jetm: "JETM-Medium-Cool", facePencil: "FP-Medium-Cool", neutralizer: "NTR-Medium-Cool", heroProduct: "JETM", notes: "" },
  { skinTone: "Medium", undertone: "Cool", coverage: "Light-Medium", foundationStick: "FS-Medium-Cool-01", wtf: "WTF-Medium-Cool", jetm: "JETM-Medium-Cool", facePencil: "FP-Medium-Cool", neutralizer: "NTR-Medium-Cool", heroProduct: "WTF", notes: "" },
  { skinTone: "Medium", undertone: "Cool", coverage: "Full", foundationStick: "FS-Medium-Cool-01", wtf: "WTF-Medium-Cool", jetm: "JETM-Medium-Cool", facePencil: "FP-Medium-Cool", neutralizer: "NTR-Medium-Cool", heroProduct: "Foundation Stick", notes: "" },
  { skinTone: "Medium", undertone: "Warm", coverage: "Sheer", foundationStick: "FS-Medium-Warm-01", wtf: "WTF-Medium-Warm", jetm: "JETM-Medium-Warm", facePencil: "FP-Medium-Warm", neutralizer: "N/A", heroProduct: "JETM", notes: "" },
  { skinTone: "Medium", undertone: "Warm", coverage: "Light-Medium", foundationStick: "FS-Medium-Warm-01", wtf: "WTF-Medium-Warm", jetm: "JETM-Medium-Warm", facePencil: "FP-Medium-Warm", neutralizer: "N/A", heroProduct: "WTF", notes: "" },
  { skinTone: "Medium", undertone: "Warm", coverage: "Full", foundationStick: "FS-Medium-Warm-01", wtf: "WTF-Medium-Warm", jetm: "JETM-Medium-Warm", facePencil: "FP-Medium-Warm", neutralizer: "N/A", heroProduct: "Foundation Stick", notes: "" },
  { skinTone: "Medium", undertone: "Neutral", coverage: "Sheer", foundationStick: "FS-Medium-Neutral-01", wtf: "WTF-Medium-Neutral", jetm: "JETM-Medium-Neutral", facePencil: "FP-Medium-Neutral", neutralizer: "NTR-Medium-Neutral", heroProduct: "JETM", notes: "" },
  { skinTone: "Medium", undertone: "Neutral", coverage: "Light-Medium", foundationStick: "FS-Medium-Neutral-01", wtf: "WTF-Medium-Neutral", jetm: "JETM-Medium-Neutral", facePencil: "FP-Medium-Neutral", neutralizer: "NTR-Medium-Neutral", heroProduct: "WTF", notes: "" },
  { skinTone: "Medium", undertone: "Neutral", coverage: "Full", foundationStick: "FS-Medium-Neutral-01", wtf: "WTF-Medium-Neutral", jetm: "JETM-Medium-Neutral", facePencil: "FP-Medium-Neutral", neutralizer: "NTR-Medium-Neutral", heroProduct: "Foundation Stick", notes: "" },

  // Medium-Dark
  { skinTone: "Medium-Dark", undertone: "Cool", coverage: "Sheer", foundationStick: "FS-MedDark-Cool-01", wtf: "WTF-MedDark-Cool", jetm: "JETM-MedDark-Cool", facePencil: "FP-MedDark-Cool", neutralizer: "NTR-MedDark-Cool", heroProduct: "JETM", notes: "" },
  { skinTone: "Medium-Dark", undertone: "Cool", coverage: "Light-Medium", foundationStick: "FS-MedDark-Cool-01", wtf: "WTF-MedDark-Cool", jetm: "JETM-MedDark-Cool", facePencil: "FP-MedDark-Cool", neutralizer: "NTR-MedDark-Cool", heroProduct: "WTF", notes: "" },
  { skinTone: "Medium-Dark", undertone: "Cool", coverage: "Full", foundationStick: "FS-MedDark-Cool-01", wtf: "WTF-MedDark-Cool", jetm: "JETM-MedDark-Cool", facePencil: "FP-MedDark-Cool", neutralizer: "NTR-MedDark-Cool", heroProduct: "Foundation Stick", notes: "" },
  { skinTone: "Medium-Dark", undertone: "Warm", coverage: "Sheer", foundationStick: "FS-MedDark-Warm-01", wtf: "WTF-MedDark-Warm", jetm: "JETM-MedDark-Warm", facePencil: "FP-MedDark-Warm", neutralizer: "N/A", heroProduct: "JETM", notes: "" },
  { skinTone: "Medium-Dark", undertone: "Warm", coverage: "Light-Medium", foundationStick: "FS-MedDark-Warm-01", wtf: "WTF-MedDark-Warm", jetm: "JETM-MedDark-Warm", facePencil: "FP-MedDark-Warm", neutralizer: "N/A", heroProduct: "WTF", notes: "" },
  { skinTone: "Medium-Dark", undertone: "Warm", coverage: "Full", foundationStick: "FS-MedDark-Warm-01", wtf: "WTF-MedDark-Warm", jetm: "JETM-MedDark-Warm", facePencil: "FP-MedDark-Warm", neutralizer: "N/A", heroProduct: "Foundation Stick", notes: "" },
  { skinTone: "Medium-Dark", undertone: "Neutral", coverage: "Sheer", foundationStick: "FS-MedDark-Neutral-01", wtf: "WTF-MedDark-Neutral", jetm: "JETM-MedDark-Neutral", facePencil: "FP-MedDark-Neutral", neutralizer: "NTR-MedDark-Neutral", heroProduct: "JETM", notes: "" },
  { skinTone: "Medium-Dark", undertone: "Neutral", coverage: "Light-Medium", foundationStick: "FS-MedDark-Neutral-01", wtf: "WTF-MedDark-Neutral", jetm: "JETM-MedDark-Neutral", facePencil: "FP-MedDark-Neutral", neutralizer: "NTR-MedDark-Neutral", heroProduct: "WTF", notes: "" },
  { skinTone: "Medium-Dark", undertone: "Neutral", coverage: "Full", foundationStick: "FS-MedDark-Neutral-01", wtf: "WTF-MedDark-Neutral", jetm: "JETM-MedDark-Neutral", facePencil: "FP-MedDark-Neutral", neutralizer: "NTR-MedDark-Neutral", heroProduct: "Foundation Stick", notes: "" },

  // Dark
  { skinTone: "Dark", undertone: "Cool", coverage: "Sheer", foundationStick: "FS-Dark-Cool-01", wtf: "WTF-Dark-Cool", jetm: "JETM-Dark-Cool", facePencil: "FP-Dark-Cool", neutralizer: "NTR-Dark-Cool", heroProduct: "JETM", notes: "" },
  { skinTone: "Dark", undertone: "Cool", coverage: "Light-Medium", foundationStick: "FS-Dark-Cool-01", wtf: "WTF-Dark-Cool", jetm: "JETM-Dark-Cool", facePencil: "FP-Dark-Cool", neutralizer: "NTR-Dark-Cool", heroProduct: "WTF", notes: "" },
  { skinTone: "Dark", undertone: "Cool", coverage: "Full", foundationStick: "FS-Dark-Cool-01", wtf: "WTF-Dark-Cool", jetm: "JETM-Dark-Cool", facePencil: "FP-Dark-Cool", neutralizer: "NTR-Dark-Cool", heroProduct: "Foundation Stick", notes: "" },
  { skinTone: "Dark", undertone: "Warm", coverage: "Sheer", foundationStick: "FS-Dark-Warm-01", wtf: "WTF-Dark-Warm", jetm: "JETM-Dark-Warm", facePencil: "FP-Dark-Warm", neutralizer: "N/A", heroProduct: "JETM", notes: "" },
  { skinTone: "Dark", undertone: "Warm", coverage: "Light-Medium", foundationStick: "FS-Dark-Warm-01", wtf: "WTF-Dark-Warm", jetm: "JETM-Dark-Warm", facePencil: "FP-Dark-Warm", neutralizer: "N/A", heroProduct: "WTF", notes: "" },
  { skinTone: "Dark", undertone: "Warm", coverage: "Full", foundationStick: "FS-Dark-Warm-01", wtf: "WTF-Dark-Warm", jetm: "JETM-Dark-Warm", facePencil: "FP-Dark-Warm", neutralizer: "N/A", heroProduct: "Foundation Stick", notes: "" },
  { skinTone: "Dark", undertone: "Neutral", coverage: "Sheer", foundationStick: "FS-Dark-Neutral-01", wtf: "WTF-Dark-Neutral", jetm: "JETM-Dark-Neutral", facePencil: "FP-Dark-Neutral", neutralizer: "NTR-Dark-Neutral", heroProduct: "JETM", notes: "" },
  { skinTone: "Dark", undertone: "Neutral", coverage: "Light-Medium", foundationStick: "FS-Dark-Neutral-01", wtf: "WTF-Dark-Neutral", jetm: "JETM-Dark-Neutral", facePencil: "FP-Dark-Neutral", neutralizer: "NTR-Dark-Neutral", heroProduct: "WTF", notes: "" },
  { skinTone: "Dark", undertone: "Neutral", coverage: "Full", foundationStick: "FS-Dark-Neutral-01", wtf: "WTF-Dark-Neutral", jetm: "JETM-Dark-Neutral", facePencil: "FP-Dark-Neutral", neutralizer: "NTR-Dark-Neutral", heroProduct: "Foundation Stick", notes: "" },

  // Deep
  { skinTone: "Deep", undertone: "Cool", coverage: "Sheer", foundationStick: "FS-Deep-Cool-01", wtf: "WTF-Deep-Cool", jetm: "JETM-Deep-Cool", facePencil: "FP-Deep-Cool", neutralizer: "NTR-Deep-Cool", heroProduct: "JETM", notes: "" },
  { skinTone: "Deep", undertone: "Cool", coverage: "Light-Medium", foundationStick: "FS-Deep-Cool-01", wtf: "WTF-Deep-Cool", jetm: "JETM-Deep-Cool", facePencil: "FP-Deep-Cool", neutralizer: "NTR-Deep-Cool", heroProduct: "WTF", notes: "" },
  { skinTone: "Deep", undertone: "Cool", coverage: "Full", foundationStick: "FS-Deep-Cool-01", wtf: "WTF-Deep-Cool", jetm: "JETM-Deep-Cool", facePencil: "FP-Deep-Cool", neutralizer: "NTR-Deep-Cool", heroProduct: "Foundation Stick", notes: "" },
  { skinTone: "Deep", undertone: "Warm", coverage: "Sheer", foundationStick: "FS-Deep-Warm-01", wtf: "WTF-Deep-Warm", jetm: "JETM-Deep-Warm", facePencil: "FP-Deep-Warm", neutralizer: "N/A", heroProduct: "JETM", notes: "" },
  { skinTone: "Deep", undertone: "Warm", coverage: "Light-Medium", foundationStick: "FS-Deep-Warm-01", wtf: "WTF-Deep-Warm", jetm: "JETM-Deep-Warm", facePencil: "FP-Deep-Warm", neutralizer: "N/A", heroProduct: "WTF", notes: "" },
  { skinTone: "Deep", undertone: "Warm", coverage: "Full", foundationStick: "FS-Deep-Warm-01", wtf: "WTF-Deep-Warm", jetm: "JETM-Deep-Warm", facePencil: "FP-Deep-Warm", neutralizer: "N/A", heroProduct: "Foundation Stick", notes: "" },
  { skinTone: "Deep", undertone: "Neutral", coverage: "Sheer", foundationStick: "FS-Deep-Neutral-01", wtf: "WTF-Deep-Neutral", jetm: "JETM-Deep-Neutral", facePencil: "FP-Deep-Neutral", neutralizer: "NTR-Deep-Neutral", heroProduct: "JETM", notes: "" },
  { skinTone: "Deep", undertone: "Neutral", coverage: "Light-Medium", foundationStick: "FS-Deep-Neutral-01", wtf: "WTF-Deep-Neutral", jetm: "JETM-Deep-Neutral", facePencil: "FP-Deep-Neutral", neutralizer: "NTR-Deep-Neutral", heroProduct: "WTF", notes: "" },
  { skinTone: "Deep", undertone: "Neutral", coverage: "Full", foundationStick: "FS-Deep-Neutral-01", wtf: "WTF-Deep-Neutral", jetm: "JETM-Deep-Neutral", facePencil: "FP-Deep-Neutral", neutralizer: "NTR-Deep-Neutral", heroProduct: "Foundation Stick", notes: "" },
];

// V2: Updated lookup — now takes undertone for MB tint recommendations
export function getMBShades(skinTone: SkinTone, undertone?: Undertone): MBRecommendation[] {
  return miracleBalmShades.filter((s) => {
    if (s.skinTone !== skinTone || s.shade === "—") return false;
    // If the entry has an undertone filter, only include if it matches
    if (s.undertone && undertone && s.undertone !== undertone) return false;
    return true;
  });
}

export function getComplexionRecs(
  skinTone: SkinTone,
  undertone: Undertone
): ComplexionRecommendation[] {
  return complexionRecommendations.filter(
    (r) => r.skinTone === skinTone && r.undertone === undertone
  );
}

export function getHeroComplexionRec(
  skinTone: SkinTone,
  undertone: Undertone
): ComplexionRecommendation | undefined {
  return complexionRecommendations.find(
    (r) =>
      r.skinTone === skinTone &&
      r.undertone === undertone &&
      r.coverage === "Sheer"
  );
}

// Product display info for the complexion line
export const complexionProducts: Record<
  string,
  { name: string; description: string; url: string; image: string }
> = {
  JETM: {
    name: "Just Enough Tinted Moisturizer",
    description:
      "Sheer, dewy coverage that evens out skin tone while letting your natural skin show through.",
    url: "https://jonesroadbeauty.com/products/just-enough-tinted-moisturizer",
    image: "/images/jetm.jpg",
  },
  WTF: {
    name: "What The Foundation",
    description:
      "Light-to-medium buildable coverage in a moisture-rich, skin-like formula.",
    url: "https://jonesroadbeauty.com/products/what-the-foundation",
    image: "/images/wtf.jpg",
  },
  "Foundation Stick": {
    name: "The Foundation Stick",
    description:
      "Full coverage in a portable stick format — blend with fingers for a skin-like finish.",
    url: "https://jonesroadbeauty.com/products/the-foundation-stick",
    image: "/images/foundation-stick.jpg",
  },
  "Face Pencil": {
    name: "The Face Pencil",
    description:
      "Targeted coverage for spots, dark circles, and redness — buildable and blendable.",
    url: "https://jonesroadbeauty.com/products/the-face-pencil",
    image: "/images/face-pencil.jpg",
  },
  Neutralizer: {
    name: "The Neutralizer",
    description:
      "Color-correcting balm that cancels redness and evens skin tone before foundation.",
    url: "https://jonesroadbeauty.com/products/the-neutralizer",
    image: "/images/neutralizer.jpg",
  },
};

// Miracle Balm product URLs by shade name
export const miracleBalmUrls: Record<string, string> = {
  Flushed: "https://jonesroadbeauty.com/products/miracle-balm?variant=flushed",
  "Miami Beach":
    "https://jonesroadbeauty.com/products/miracle-balm?variant=miami-beach",
  "Pinched Cheeks":
    "https://jonesroadbeauty.com/products/miracle-balm?variant=pinched-cheeks",
  Cheeky: "https://jonesroadbeauty.com/products/miracle-balm?variant=cheeky",
  "Pinky Bronze":
    "https://jonesroadbeauty.com/products/miracle-balm?variant=pinky-bronze",
  Bronze: "https://jonesroadbeauty.com/products/miracle-balm?variant=bronze",
  Sunkissed:
    "https://jonesroadbeauty.com/products/miracle-balm?variant=sunkissed",
  "Cocoa Bronze":
    "https://jonesroadbeauty.com/products/miracle-balm?variant=cocoa-bronze",
  "Happy Hour":
    "https://jonesroadbeauty.com/products/miracle-balm?variant=happy-hour",
  "Magic Hour":
    "https://jonesroadbeauty.com/products/miracle-balm?variant=magic-hour",
  "Golden Hour":
    "https://jonesroadbeauty.com/products/miracle-balm?variant=golden-hour",
  "Dusty Rose":
    "https://jonesroadbeauty.com/products/miracle-balm?variant=dusty-rose",
  Chic: "https://jonesroadbeauty.com/products/miracle-balm?variant=chic",
  Tawny: "https://jonesroadbeauty.com/products/miracle-balm?variant=tawny",
  "Au Naturel":
    "https://jonesroadbeauty.com/products/miracle-balm?variant=au-naturel",
};

// V2: Complexion shade names by skin tone — updated with undertone-aware Face Pencil
// Changes from V1:
// - Face Pencil ranges shifted 1 shade lighter (data shows "too dark" > "too light" complaints)
// - FP 01 for Fair → FP 02 (FP 01 gets "too light" 70 mentions)
// - WTF for Dark → Almond/Cinnamon instead of Deep (Deep has 33% low ratings)
// - Tinted Face Powder for Medium-Dark → Medium (Dark had 40% low ratings)
// - Neutralizer for Light skin → Fair Pink (Light Peachy Pink gets "too pink")
export interface ComplexionShadeMap {
  wtfShade: string;
  facePencilFace: string;
  facePencilEye: string;
  neutralizer: string;
  tintedPowder: string;
  foundationStickShade: string; // V3: undertone-aware FS shade (confirmed names from quiz-logic.html)
}

// V2+V3: Undertone-aware shade map — returns different FP ranges for cool vs warm (V2)
// and undertone-aware Foundation Stick shades (V3)
export function getComplexionShades(skinTone: SkinTone, undertone: Undertone): ComplexionShadeMap {
  const base = complexionShadesByTone[skinTone];

  // V3: Always apply undertone-aware Foundation Stick shade
  const foundationStickShade = foundationStickByTone[skinTone][undertone];

  // V2 Rec #4: Undertone differentiation for FP ranges (Light and Light-Medium)
  if (skinTone === "Light") {
    if (undertone === "Cool") {
      return { ...base, facePencilFace: "06-07", facePencilEye: "04-05", foundationStickShade };
    } else if (undertone === "Warm") {
      return { ...base, facePencilFace: "07-08", facePencilEye: "05-06", foundationStickShade };
    }
    // Neutral gets base FP, just update FS
    return { ...base, foundationStickShade };
  }

  if (skinTone === "Light-Medium") {
    if (undertone === "Cool") {
      return { ...base, facePencilFace: "07-09", facePencilEye: "05-07", foundationStickShade };
    } else if (undertone === "Warm") {
      return { ...base, facePencilFace: "08-10", facePencilEye: "06-08", foundationStickShade };
    }
    // Neutral gets base FP, just update FS
    return { ...base, foundationStickShade };
  }

  return { ...base, foundationStickShade };
}

// V3: Foundation Stick shades — confirmed names from quiz-logic.html (April 2026)
// Undertone-aware; getComplexionShades() overrides foundationStickShade for Cool/Warm
// Default stored here = Neutral. Cool and Warm are set in getComplexionShades().
export const foundationStickByTone: Record<SkinTone, Record<"Cool" | "Warm" | "Neutral", string>> = {
  "Pale":         { Cool: "Pale Alabaster", Warm: "Bisque",       Neutral: "Alabaster" },
  "Fair":         { Cool: "Porcelain",      Warm: "Warm Linen",   Neutral: "Neutral Fair" },
  "Light":        { Cool: "Fair",           Warm: "Sand",         Neutral: "Ivory" },
  "Light-Medium": { Cool: "Beige",          Warm: "Warm Beige",   Neutral: "Neutral Beige" },
  "Medium":       { Cool: "Medium",         Warm: "Warm Medium",  Neutral: "Neutral Medium" },
  "Medium-Dark":  { Cool: "Medium Honey",   Warm: "Warm Honey",   Neutral: "Neutral Honey" },
  "Dark":         { Cool: "Pecan",          Warm: "Golden",       Neutral: "Hazelnut" },
  "Deep":         { Cool: "Almond",         Warm: "Almond",       Neutral: "Almond" },
};

export const complexionShadesByTone: Record<SkinTone, ComplexionShadeMap> = {
  Pale: {
    wtfShade: "Porcelain",
    // V2: Shifted 1 lighter — was 03-04, now 02-03
    facePencilFace: "02-03",
    facePencilEye: "01-02",
    neutralizer: "Fair Pink",
    tintedPowder: "Light",
    foundationStickShade: "Alabaster", // Neutral default; getComplexionShades() overrides for Cool/Warm
  },
  Fair: {
    wtfShade: "Fair",
    // V2: FP 01 gets "too light" (70 mentions) → recommend 04 instead of 05
    facePencilFace: "04",
    facePencilEye: "02-03",
    neutralizer: "Fair Pink / Fair Peach",
    tintedPowder: "Light",
    foundationStickShade: "Neutral Fair",
  },
  Light: {
    wtfShade: "Light",
    // V2: Shifted 1 lighter — was 07-08, now 06-07 (neutral default; cool/warm handled by getComplexionShades)
    facePencilFace: "06-07",
    facePencilEye: "04-05",
    // V2: Changed from Light Peachy Pink → Fair Pink (Light Peachy Pink gets "too pink")
    neutralizer: "Fair Pink",
    tintedPowder: "Light",
    foundationStickShade: "Ivory",
  },
  "Light-Medium": {
    wtfShade: "Beige",
    // V2: Shifted 1 lighter — was 08-10, now 07-09
    facePencilFace: "07-09",
    facePencilEye: "05-07",
    neutralizer: "Light Peachy Pink",
    tintedPowder: "Light",
    foundationStickShade: "Neutral Beige",
  },
  Medium: {
    wtfShade: "Medium",
    // V2: Shifted 1 lighter — was 09-12, now 08-11
    facePencilFace: "08-11",
    facePencilEye: "07-09",
    neutralizer: "Medium Peachy Pink",
    tintedPowder: "Medium",
    foundationStickShade: "Neutral Medium",
  },
  "Medium-Dark": {
    wtfShade: "Medium Honey",
    // V2: Shifted 1 lighter — was 13-15, now 12-14
    facePencilFace: "12-14",
    facePencilEye: "10-12",
    neutralizer: "Medium Peachy Pink",
    tintedPowder: "Medium",
    foundationStickShade: "Neutral Honey",
  },
  Dark: {
    // V2: Changed from Rich/Deep → Almond (Almond 4.70 avg vs Deep 33% low ratings)
    // V3: FP ranges corrected from Octane AI ground truth data (was 17-18 face / 15-17 eye — too light)
    // Octane data: Dark Neutral = FP 20 face / FP 18 eye; Dark Warm = FP 21 face / FP 20 eye
    wtfShade: "Almond",
    facePencilFace: "19-21",
    facePencilEye: "17-19",
    neutralizer: "Dark Apricot",
    tintedPowder: "Medium",
    foundationStickShade: "Hazelnut",
  },
  Deep: {
    // V2: Changed from Espresso → Cinnamon (Cinnamon 4.86 avg)
    // V3: FP ranges corrected from Octane AI ground truth (was FP 18 face / FP 17 eye — way too light)
    // Octane data: Deep Neutral = FP 25 face / FP 23 eye; Dark/Deep = FP 20 face / FP 19 eye
    wtfShade: "Cinnamon",
    facePencilFace: "23-25",
    facePencilEye: "21-23",
    neutralizer: "N/A",
    tintedPowder: "Dark",
    foundationStickShade: "Almond",
  },
};

// Shade color swatches for visual display
export const shadeSwatches: Record<string, string> = {
  Flushed: "#d4838c",
  "Miami Beach": "#e8a07a",
  "Pinched Cheeks": "#c97b6b",
  Cheeky: "#8b3a5c",
  "Pinky Bronze": "#c49a7e",
  Bronze: "#b08050",
  Sunkissed: "#c89860",
  "Cocoa Bronze": "#6b4530",
  "Happy Hour": "#e8c8c0",
  "Magic Hour": "#d4a868",
  "Golden Hour": "#c89040",
  "Dusty Rose": "#c8868a",
  Chic: "#a87860",
  Tawny: "#a07048",
  "Au Naturel": "#e8d8c8",
};
