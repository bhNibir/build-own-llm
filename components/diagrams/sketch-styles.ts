/** Excalidraw-style fill and stroke vocabulary */
export type SketchFillStyle = 'solid' | 'hachure' | 'cross-hatch';
export type SketchStrokeStyle = 'solid' | 'dashed' | 'dotted';

export type SketchPalette = {
  bg: string;
  border: string;
  text: string;
  hatch: string;
};

/** Light-mode pastel palettes (default) */
export const sketchPalettes: Record<string, SketchPalette> = {
  blue: { bg: '#E7F5FF', border: '#1971C2', text: '#1E293B', hatch: '#1971C2' },
  green: { bg: '#E6FCF5', border: '#099268', text: '#1E293B', hatch: '#099268' },
  amber: { bg: '#FFF9DB', border: '#F08C00', text: '#1E293B', hatch: '#F08C00' },
  rose: { bg: '#FFE3E3', border: '#E03131', text: '#1E293B', hatch: '#E03131' },
  violet: { bg: '#F3F0FF', border: '#7950F2', text: '#1E293B', hatch: '#7950F2' },
  neutral: { bg: '#F8F9FA', border: '#495057', text: '#1E293B', hatch: '#868E96' },
};

/** Dark-mode palettes — saturated fills + light text for Mermaid/SketchBox */
export const sketchPalettesDark: Record<string, SketchPalette> = {
  blue: { bg: '#1E1B4B', border: '#818CF8', text: '#E0E7FF', hatch: '#818CF8' },
  green: { bg: '#064E3B', border: '#34D399', text: '#D1FAE5', hatch: '#34D399' },
  amber: { bg: '#78350F', border: '#FBBF24', text: '#FEF3C7', hatch: '#FBBF24' },
  rose: { bg: '#881337', border: '#FB7185', text: '#FFE4E6', hatch: '#FB7185' },
  violet: { bg: '#4C1D95', border: '#A78BFA', text: '#EDE9FE', hatch: '#A78BFA' },
  neutral: { bg: '#1E293B', border: '#94A3B8', text: '#CBD5E1', hatch: '#94A3B8' },
};

export function getSketchPalettes(isDark = false): Record<string, SketchPalette> {
  return isDark ? sketchPalettesDark : sketchPalettes;
}

/** Mermaid classDef name → sketch fill + stroke */
export const mermaidSketchStyles: Record<
  string,
  { fill: SketchFillStyle; stroke: SketchStrokeStyle; palette: keyof typeof sketchPalettes }
> = {
  input: { fill: 'solid', stroke: 'solid', palette: 'blue' },
  process: { fill: 'solid', stroke: 'solid', palette: 'green' },
  output: { fill: 'solid', stroke: 'solid', palette: 'amber' },
  highlight: { fill: 'solid', stroke: 'solid', palette: 'rose' },
  matrix: { fill: 'solid', stroke: 'solid', palette: 'violet' },
  dim: { fill: 'solid', stroke: 'solid', palette: 'neutral' },
  weight: { fill: 'solid', stroke: 'solid', palette: 'green' },
  a: { fill: 'solid', stroke: 'solid', palette: 'blue' },
  b: { fill: 'solid', stroke: 'solid', palette: 'green' },
  c: { fill: 'solid', stroke: 'solid', palette: 'amber' },
  out: { fill: 'solid', stroke: 'solid', palette: 'amber' },
  train: { fill: 'solid', stroke: 'solid', palette: 'blue' },
  model: { fill: 'solid', stroke: 'solid', palette: 'green' },
  gpt: { fill: 'solid', stroke: 'solid', palette: 'amber' },
  attn: { fill: 'solid', stroke: 'solid', palette: 'rose' },
  mlp: { fill: 'solid', stroke: 'solid', palette: 'rose' },
  block: { fill: 'solid', stroke: 'solid', palette: 'violet' },
  data: { fill: 'solid', stroke: 'solid', palette: 'blue' },
  lookup: { fill: 'solid', stroke: 'solid', palette: 'green' },
  vector: { fill: 'solid', stroke: 'solid', palette: 'amber' },
  scalar: { fill: 'solid', stroke: 'solid', palette: 'blue' },
  embed: { fill: 'solid', stroke: 'solid', palette: 'violet' },
  layer: { fill: 'solid', stroke: 'solid', palette: 'green' },
  bad: { fill: 'solid', stroke: 'solid', palette: 'rose' },
  good: { fill: 'solid', stroke: 'solid', palette: 'green' },
  fail: { fill: 'solid', stroke: 'solid', palette: 'rose' },
  success: { fill: 'solid', stroke: 'solid', palette: 'green' },
  done: { fill: 'solid', stroke: 'solid', palette: 'green' },
  next: { fill: 'solid', stroke: 'solid', palette: 'blue' },
  next1: { fill: 'solid', stroke: 'solid', palette: 'blue' },
  next2: { fill: 'solid', stroke: 'solid', palette: 'green' },
  next3: { fill: 'solid', stroke: 'solid', palette: 'amber' },
  next4: { fill: 'solid', stroke: 'solid', palette: 'violet' },
};

export function strokeDasharray(style: SketchStrokeStyle): string | null {
  switch (style) {
    case 'dashed':
      return '8 5';
    case 'dotted':
      return '2 4';
    default:
      return null;
  }
}

export function sketchStrokeClass(style: SketchStrokeStyle): string {
  switch (style) {
    case 'dashed':
      return 'border-dashed';
    case 'dotted':
      return 'border-dotted';
    default:
      return 'border-solid';
  }
}

export function sketchFillClass(fill: SketchFillStyle, palette: keyof typeof sketchPalettes): string {
  if (fill === 'hachure') return `sketch-fill-hachure sketch-palette-${palette}`;
  if (fill === 'cross-hatch') return `sketch-fill-cross sketch-palette-${palette}`;
  return `sketch-fill-solid sketch-palette-${palette}`;
}

export function getSketchStyleForClass(className: string) {
  for (const key of Object.keys(mermaidSketchStyles)) {
    if (className.split(/\s+/).includes(key)) {
      return mermaidSketchStyles[key];
    }
  }
  return mermaidSketchStyles.input;
}
