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
