/** Excalidraw-style fill and stroke vocabulary */
export type SketchFillStyle = 'solid' | 'hachure' | 'cross-hatch';
export type SketchStrokeStyle = 'solid' | 'dashed' | 'dotted';

export type SketchPalette = {
  bg: string;
  border: string;
  text: string;
  hatch: string;
};

/**
 * Vivid pastel palettes — colorful enough to scan quickly,
 * still light enough for dark (#1E293B) labels.
 */
export const sketchPalettes: Record<string, SketchPalette> = {
  blue: { bg: '#C7D2FE', border: '#4338CA', text: '#1E1B4B', hatch: '#4F46E5' },
  green: { bg: '#A7F3D0', border: '#047857', text: '#064E3B', hatch: '#059669' },
  amber: { bg: '#FDE68A', border: '#B45309', text: '#78350F', hatch: '#D97706' },
  rose: { bg: '#FECDD3', border: '#BE123C', text: '#881337', hatch: '#E11D48' },
  violet: { bg: '#DDD6FE', border: '#6D28D9', text: '#4C1D95', hatch: '#7C3AED' },
  neutral: { bg: '#E2E8F0', border: '#475569', text: '#1E293B', hatch: '#64748B' },
};

/** Dark UI chrome — still uses vivid pastels + dark text for node readability */
export const sketchPalettesDark: Record<string, SketchPalette> = {
  blue: { bg: '#A5B4FC', border: '#818CF8', text: '#1E1B4B', hatch: '#6366F1' },
  green: { bg: '#6EE7B7', border: '#34D399', text: '#064E3B', hatch: '#10B981' },
  amber: { bg: '#FCD34D', border: '#FBBF24', text: '#78350F', hatch: '#F59E0B' },
  rose: { bg: '#FDA4AF', border: '#FB7185', text: '#881337', hatch: '#F43F5E' },
  violet: { bg: '#C4B5FD', border: '#A78BFA', text: '#4C1D95', hatch: '#8B5CF6' },
  neutral: { bg: '#CBD5E1', border: '#94A3B8', text: '#1E293B', hatch: '#64748B' },
};

export function getSketchPalettes(isDark = false): Record<string, SketchPalette> {
  return isDark ? sketchPalettesDark : sketchPalettes;
}

/**
 * Mermaid classDef → fill style
 * solid = start/data, hachure = process/steps, cross-hatch = result/highlight
 */
export const mermaidSketchStyles: Record<
  string,
  { fill: SketchFillStyle; stroke: SketchStrokeStyle; palette: keyof typeof sketchPalettes }
> = {
  input: { fill: 'solid', stroke: 'solid', palette: 'blue' },
  process: { fill: 'hachure', stroke: 'solid', palette: 'green' },
  output: { fill: 'cross-hatch', stroke: 'solid', palette: 'amber' },
  highlight: { fill: 'cross-hatch', stroke: 'solid', palette: 'rose' },
  matrix: { fill: 'hachure', stroke: 'solid', palette: 'violet' },
  dim: { fill: 'solid', stroke: 'dashed', palette: 'neutral' },
  weight: { fill: 'hachure', stroke: 'solid', palette: 'green' },
  a: { fill: 'solid', stroke: 'solid', palette: 'blue' },
  b: { fill: 'hachure', stroke: 'solid', palette: 'green' },
  c: { fill: 'cross-hatch', stroke: 'solid', palette: 'amber' },
  out: { fill: 'cross-hatch', stroke: 'solid', palette: 'amber' },
  train: { fill: 'hachure', stroke: 'solid', palette: 'blue' },
  model: { fill: 'hachure', stroke: 'solid', palette: 'green' },
  gpt: { fill: 'cross-hatch', stroke: 'solid', palette: 'amber' },
  attn: { fill: 'hachure', stroke: 'solid', palette: 'rose' },
  mlp: { fill: 'cross-hatch', stroke: 'solid', palette: 'rose' },
  block: { fill: 'hachure', stroke: 'solid', palette: 'violet' },
  data: { fill: 'solid', stroke: 'solid', palette: 'blue' },
  lookup: { fill: 'hachure', stroke: 'solid', palette: 'green' },
  vector: { fill: 'cross-hatch', stroke: 'solid', palette: 'amber' },
  scalar: { fill: 'solid', stroke: 'solid', palette: 'blue' },
  embed: { fill: 'hachure', stroke: 'solid', palette: 'violet' },
  layer: { fill: 'hachure', stroke: 'solid', palette: 'green' },
  bad: { fill: 'cross-hatch', stroke: 'solid', palette: 'rose' },
  good: { fill: 'hachure', stroke: 'solid', palette: 'green' },
  fail: { fill: 'cross-hatch', stroke: 'solid', palette: 'rose' },
  success: { fill: 'hachure', stroke: 'solid', palette: 'green' },
  done: { fill: 'hachure', stroke: 'solid', palette: 'green' },
  next: { fill: 'solid', stroke: 'dashed', palette: 'blue' },
  next1: { fill: 'solid', stroke: 'solid', palette: 'blue' },
  next2: { fill: 'hachure', stroke: 'solid', palette: 'green' },
  next3: { fill: 'cross-hatch', stroke: 'solid', palette: 'amber' },
  next4: { fill: 'hachure', stroke: 'solid', palette: 'violet' },
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
  const tokens = className.split(/\s+/).filter(Boolean);
  const skip = new Set(['node', 'default', 'flowchart-label', 'label', 'clickable']);
  const keys = Object.keys(mermaidSketchStyles).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (skip.has(key)) continue;
    if (tokens.includes(key)) return mermaidSketchStyles[key];
  }
  return mermaidSketchStyles.input;
}
