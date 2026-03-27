// Miracle Balm shade recommendations by skin tone × usage
// Source: jrb-miracle-balm-quiz/shade-recommendation-copy-table.csv

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

// Miracle Balm shade lookup table
export const miracleBalmShades: MBRecommendation[] = [
  // Pale
  { skinTone: "Pale", usage: "Blush", type: "Primary", shade: "Flushed", copy: "Flushed gives you a cool pink flush with a subtle sheen — just enough color to look naturally rosy, never overdone." },
  { skinTone: "Pale", usage: "Bronzer", type: "Primary", shade: "Pinky Bronze", copy: "Pinky Bronze adds a soft, pinkish warmth that looks sun-touched without going too deep on fair complexions." },
  { skinTone: "Pale", usage: "Highlighter", type: "Primary", shade: "Happy Hour", copy: "Happy Hour is a cool, sheer pink with silver shimmer — the lightest glow that catches light without looking heavy." },
  { skinTone: "Pale", usage: "All-Over Tint", type: "Primary", shade: "Dusty Rose", copy: "Dusty Rose is a cool, rosy pink that warms up your complexion with a sheer wash of color — like your skin on its best day." },
  { skinTone: "Pale", usage: "Colorless Glow", type: "Primary", shade: "Au Naturel", copy: "Au Naturel gives you all the moisture and light-reflecting luminosity with zero color — just healthy, dewy skin." },

  // Fair
  { skinTone: "Fair", usage: "Blush", type: "Primary", shade: "Flushed", copy: "Flushed delivers a cool pink flush with a subtle sheen — the kind of color that looks like it came from within." },
  { skinTone: "Fair", usage: "Blush Alt", type: "Alt", shade: "Miami Beach", copy: "If you lean warmer or prefer a coral-peach flush over pink, Miami Beach gives you that sun-warmed glow." },
  { skinTone: "Fair", usage: "Bronzer", type: "Primary", shade: "Pinky Bronze", copy: "Pinky Bronze warms up your complexion with a soft, pinkish bronze — natural-looking warmth that won't go muddy on lighter skin." },
  { skinTone: "Fair", usage: "Highlighter", type: "Primary", shade: "Happy Hour", copy: "Happy Hour catches light with a cool, sheer shimmer that enhances fair complexions without overwhelming them." },
  { skinTone: "Fair", usage: "All-Over Tint", type: "Primary", shade: "Dusty Rose", copy: "Dusty Rose gives you a sheer, rosy wash that evens things out and adds a quiet glow — effortless, like you just got back from a walk." },
  { skinTone: "Fair", usage: "Tint Alt", type: "Alt", shade: "Chic", copy: "If you want a warmer, slightly deeper wash — Chic adds a sophisticated warmth that doubles as a subtle bronze tint." },
  { skinTone: "Fair", usage: "Colorless Glow", type: "Primary", shade: "Au Naturel", copy: "Au Naturel delivers moisture and luminosity with no color at all — just your skin, but dewier." },

  // Light
  { skinTone: "Light", usage: "Blush", type: "Primary", shade: "Flushed", copy: "Flushed is a cool pink that gives you a natural-looking flush — the shade equivalent of a brisk morning walk." },
  { skinTone: "Light", usage: "Blush Alt", type: "Alt", shade: "Miami Beach", copy: "Miami Beach is your warm-weather option — a peachy, coral flush if you prefer warmth over pink." },
  { skinTone: "Light", usage: "Bronzer", type: "Primary", shade: "Bronze", copy: "Bronze has warm golden undertones that add a hint of sun — the right depth for light skin without going heavy." },
  { skinTone: "Light", usage: "Highlighter", type: "Primary", shade: "Magic Hour", copy: "Magic Hour is a warm, golden glow — like the last hour of sunlight on your cheekbones." },
  { skinTone: "Light", usage: "All-Over Tint", type: "Primary", shade: "Dusty Rose", copy: "Dusty Rose gives light skin a rosy, healthy warmth — a sheer wash that makes you look naturally put-together." },
  { skinTone: "Light", usage: "Tint Alt", type: "Alt", shade: "Chic", copy: "Chic adds a deeper, warmer dimension — a sophisticated bronze-tint if you want to look slightly sun-warmed." },
  { skinTone: "Light", usage: "Colorless Glow", type: "Primary", shade: "Au Naturel", copy: "Au Naturel is pure glow — all the moisture and light-reflecting finish with zero color commitment." },

  // Light-Medium
  { skinTone: "Light-Medium", usage: "Blush", type: "Primary", shade: "Flushed", copy: "Flushed gives you a cool pink flush that reads as naturally rosy on your skin tone — sheer and easy to wear." },
  { skinTone: "Light-Medium", usage: "Blush Alt", type: "Alt", shade: "Pinched Cheeks", copy: "If you want something warmer — Pinched Cheeks gives you the look of a genuine flush, like you just came in from the cold." },
  { skinTone: "Light-Medium", usage: "Bronzer", type: "Primary", shade: "Sunkissed", copy: "Sunkissed adds warm, golden dimension — like you caught a little sun on vacation. Just the right depth for your tone." },
  { skinTone: "Light-Medium", usage: "Highlighter", type: "Primary", shade: "Magic Hour", copy: "Magic Hour gives you a warm, golden highlight that enhances your natural glow without sitting on top of your skin." },
  { skinTone: "Light-Medium", usage: "All-Over Tint", type: "Primary", shade: "Dusty Rose", copy: "Dusty Rose delivers a cool, rosy wash that gives your complexion a healthy, even glow — like your skin on its best day." },
  { skinTone: "Light-Medium", usage: "Tint Alt", type: "Alt", shade: "Tawny", copy: "If you lean warmer or want more depth — Tawny adds a rich, warm tint that enhances golden and olive undertones beautifully." },
  { skinTone: "Light-Medium", usage: "Colorless Glow", type: "Primary", shade: "Au Naturel", copy: "Au Naturel gives you a dewy, luminous finish — all glow, no color. Perfect on its own or layered under another shade." },

  // Medium
  { skinTone: "Medium", usage: "Blush", type: "Primary", shade: "Flushed", copy: "Flushed gives you a cool pink pop — a fresh, subtle flush that shows up beautifully on medium complexions." },
  { skinTone: "Medium", usage: "Blush Alt", type: "Alt", shade: "Pinched Cheeks", copy: "Pinched Cheeks is warmer and more natural — if you prefer coral over pink, this one melts into medium skin like a real flush." },
  { skinTone: "Medium", usage: "Bronzer", type: "Primary", shade: "Sunkissed", copy: "Sunkissed warms up your complexion with golden-bronze depth — enough to sculpt and warm without looking heavy." },
  { skinTone: "Medium", usage: "Highlighter", type: "Primary", shade: "Magic Hour", copy: "Magic Hour brings a warm, golden luminosity that catches light and enhances your skin's natural glow." },
  { skinTone: "Medium", usage: "All-Over Tint", type: "Primary", shade: "Tawny", copy: "Tawny is a rich, warm bronze tint that blends into your skin tone seamlessly — the definition of your skin, but better." },
  { skinTone: "Medium", usage: "Tint Alt", type: "Alt", shade: "Pinky Bronze", copy: "Pinky Bronze is a lighter, pinkish-bronze option — if you want a softer wash or something to brighten rather than deepen." },
  { skinTone: "Medium", usage: "Colorless Glow", type: "Primary", shade: "Au Naturel", copy: "Au Naturel gives your skin a dewy, healthy sheen — pure moisture and glow with nothing to overthink." },

  // Medium-Dark
  { skinTone: "Medium-Dark", usage: "Blush", type: "Primary", shade: "Pinched Cheeks", copy: "Pinched Cheeks gives you a genuine, natural flush — the kind that shows up as warmth on deeper skin without going chalky." },
  { skinTone: "Medium-Dark", usage: "Blush Alt", type: "Alt", shade: "Miami Beach", copy: "Miami Beach brings a warm, peachy coral flush — a great option if you prefer a brighter, sun-warmed pop of color." },
  { skinTone: "Medium-Dark", usage: "Bronzer", type: "Primary", shade: "Sunkissed", copy: "Sunkissed adds warm, golden definition — just enough to sculpt and warm your complexion naturally." },
  { skinTone: "Medium-Dark", usage: "Highlighter", type: "Primary", shade: "Golden Hour", copy: "Golden Hour is a warm, golden glow that catches light beautifully on deeper complexions — luminous, not ashy." },
  { skinTone: "Medium-Dark", usage: "All-Over Tint", type: "Primary", shade: "Tawny", copy: "Tawny melts into your skin tone with rich, warm depth — the effortless tint that makes you look like you, polished." },
  { skinTone: "Medium-Dark", usage: "Tint Alt", type: "Alt", shade: "Sunkissed", copy: "Sunkissed gives a lighter, golden-bronze wash if you want something a touch brighter or more of a warm glow." },
  { skinTone: "Medium-Dark", usage: "Colorless Glow", type: "Primary", shade: "Au Naturel", copy: "Au Naturel gives your skin a gorgeous, dewy sheen — all the glow and moisture, no color to think about." },

  // Dark
  { skinTone: "Dark", usage: "Blush", type: "Primary", shade: "Cheeky", copy: "Cheeky is a rich berry that actually shows up on deeper complexions — vibrant color that reads as a true, dimensional flush." },
  { skinTone: "Dark", usage: "Blush Alt", type: "Alt", shade: "Miami Beach", copy: "Miami Beach brings a warm, coral pop — a brighter option if you want a peachy glow rather than berry tones." },
  { skinTone: "Dark", usage: "Bronzer", type: "Primary", shade: "Cocoa Bronze", copy: "Cocoa Bronze has the depth to actually sculpt and warm dark skin — a real bronzer that won't look ashy or gray." },
  { skinTone: "Dark", usage: "Highlighter", type: "Primary", shade: "Golden Hour", copy: "Golden Hour is a warm, golden glow that lights up dark complexions — highlight that looks like your skin is lit from within." },
  { skinTone: "Dark", usage: "All-Over Tint", type: "Primary", shade: "Sunkissed", copy: "Sunkissed adds a warm, bronze glow across your whole complexion — enhancing your natural depth with golden warmth." },
  { skinTone: "Dark", usage: "Colorless Glow", type: "Primary", shade: "Au Naturel", copy: "Au Naturel gives your skin a dewy, light-reflecting finish — pure moisture and radiance, letting your natural tone be the star." },

  // Deep
  { skinTone: "Deep", usage: "Blush", type: "Primary", shade: "Cheeky", copy: "Cheeky is a rich, multidimensional berry — one of the few shades vibrant enough to show up as a real blush on deep complexions." },
  { skinTone: "Deep", usage: "Blush Alt", type: "Alt", shade: "Miami Beach", copy: "Miami Beach adds a warm, coral-peach pop — a brighter, warmer alternative if you want something beyond berry." },
  { skinTone: "Deep", usage: "Bronzer", type: "Primary", shade: "Cocoa Bronze", copy: "Cocoa Bronze sculpts and warms the deepest skin tones — real depth and dimension that you can actually see." },
  { skinTone: "Deep", usage: "Highlighter", type: "Primary", shade: "Golden Hour", copy: "Golden Hour brings a warm, golden glow — rich, luminous highlight that makes deep skin look absolutely radiant." },
  { skinTone: "Deep", usage: "All-Over Tint", type: "Primary", shade: "Sunkissed", copy: "Sunkissed adds a warm, golden bronze across your complexion — enhancing your natural richness with sun-warmed depth." },
  { skinTone: "Deep", usage: "Colorless Glow", type: "Primary", shade: "Au Naturel", copy: "Au Naturel is pure glow — dewy moisture and light-catching radiance that lets your natural skin tone do all the talking." },
];

// Complexion product recommendations by skin tone × undertone × coverage
// Source: jrb-complexion-quiz/quiz-logic.csv
// Note: The CSV uses placeholder SKU codes (e.g., "FS-Pale-Cool-01"). We store the hero product logic.
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

// Lookup helpers
export function getMBShades(skinTone: SkinTone): MBRecommendation[] {
  return miracleBalmShades.filter(
    (s) => s.skinTone === skinTone && s.shade !== "—"
  );
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
  // Default to sheer/JETM as the hero when no coverage preference is given
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

// Real complexion shade names by skin tone (from CX agent recommendations)
export interface ComplexionShadeMap {
  wtfShade: string;
  facePencilFace: string;
  facePencilEye: string;
  neutralizer: string;
  tintedPowder: string;
}

export const complexionShadesByTone: Record<SkinTone, ComplexionShadeMap> = {
  Pale: {
    wtfShade: "Porcelain",
    facePencilFace: "03-04",
    facePencilEye: "02-03",
    neutralizer: "Fair Pink",
    tintedPowder: "Light",
  },
  Fair: {
    wtfShade: "Fair",
    facePencilFace: "05",
    facePencilEye: "03-04",
    neutralizer: "Fair Pink / Fair Peach",
    tintedPowder: "Light",
  },
  Light: {
    wtfShade: "Light",
    facePencilFace: "07-08",
    facePencilEye: "04-06",
    neutralizer: "Light Peachy Pink",
    tintedPowder: "Light",
  },
  "Light-Medium": {
    wtfShade: "Beige",
    facePencilFace: "08-10",
    facePencilEye: "06-09",
    neutralizer: "Light Peachy Pink",
    tintedPowder: "Light",
  },
  Medium: {
    wtfShade: "Medium",
    facePencilFace: "09-12",
    facePencilEye: "09-11",
    neutralizer: "Medium Peachy Pink",
    tintedPowder: "Medium",
  },
  "Medium-Dark": {
    wtfShade: "Medium Honey",
    facePencilFace: "13-15",
    facePencilEye: "11-13",
    neutralizer: "Medium Peachy Pink",
    tintedPowder: "Medium",
  },
  Dark: {
    wtfShade: "Rich",
    facePencilFace: "17-18",
    facePencilEye: "15-17",
    neutralizer: "Dark Apricot",
    tintedPowder: "Medium-Dark",
  },
  Deep: {
    wtfShade: "Espresso",
    facePencilFace: "18",
    facePencilEye: "17",
    neutralizer: "Dark Apricot",
    tintedPowder: "Dark",
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
