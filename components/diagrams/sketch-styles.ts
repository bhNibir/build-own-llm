/** Excalidraw-style fill and stroke vocabulary */
export type SketchFillStyle = 'solid' | 'hachure' | 'cross-hatch';
export type SketchStrokeStyle = 'solid' | 'dashed' | 'dotted';

export type SketchPalette = {
  bg: string;
  border: string;
  text: string;
  hatch: string;
};

export const sketchPalettes: Record<string, SketchPalette> = {
  blue: { bg: '#E7F5FF', border: '#1971C2', text: '#1E293B', hatch: '#1971C2' },
  green: { bg: '#E6FCF5', border: '#099268', text: '#1E293B', hatch: '#099268' },
  amber: { bg: '#FFF9DB', border: '#F08C00', text: '#1E293B', hatch: '#F08C00' },
  rose: { bg: '#FFE3E3', border: '#E03131', text: '#1E293B', hatch: '#E03131' },
  violet: { bg: '#F3F0FF', border: '#7950F2', text: '#1E293B', hatch: '#7950F2' },
  neutral: { bg: '#F8F9FA', border: '#495057', text: '#1E293B', hatch: '#868E96' },
};

/** Mermaid classDef name → sketch fill + stroke */
export const mermaidSketchStyles: Record<
  string,
  { fill: SketchFillStyle; stroke: SketchStrokeStyle; palette: keyof typeof sketchPalettes }
> = {
  input: { fill: 'solid', stroke: 'solid', palette: 'blue' },
  process: { fill: 'hachure', stroke: 'dashed', palette: 'green' },
  output: { fill: 'cross-hatch', stroke: 'solid', palette: 'amber' },
  highlight: { fill: 'cross-hatch', stroke: 'dotted', palette: 'rose' },
  matrix: { fill: 'hachure', stroke: 'solid', palette: 'violet' },
  dim: { fill: 'solid', stroke: 'dotted', palette: 'neutral' },
  weight: { fill: 'hachure', stroke: 'dashed', palette: 'green' },
  a: { fill: 'solid', stroke: 'solid', palette: 'blue' },
  b: { fill: 'hachure', stroke: 'dashed', palette: 'green' },
  c: { fill: 'cross-hatch', stroke: 'solid', palette: 'amber' },
  out: { fill: 'cross-hatch', stroke: 'solid', palette: 'amber' },
  train: { fill: 'solid', stroke: 'dashed', palette: 'blue' },
  model: { fill: 'hachure', stroke: 'solid', palette: 'green' },
  gpt: { fill: 'cross-hatch', stroke: 'solid', palette: 'amber' },
  attn: { fill: 'hachure', stroke: 'dotted', palette: 'rose' },
  mlp: { fill: 'cross-hatch', stroke: 'dashed', palette: 'rose' },
  block: { fill: 'hachure', stroke: 'solid', palette: 'violet' },
  data: { fill: 'solid', stroke: 'dotted', palette: 'blue' },
  lookup: { fill: 'hachure', stroke: 'solid', palette: 'green' },
  vector: { fill: 'cross-hatch', stroke: 'solid', palette: 'amber' },
  done: { fill: 'solid', stroke: 'solid', palette: 'green' },
  next: { fill: 'hachure', stroke: 'dashed', palette: 'blue' },
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
