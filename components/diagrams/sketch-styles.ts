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
 * Excalidraw rule: fill = same hue as border, lower contrast.
 * Light = pale tint of border. Dark = deep muted version of border.
 * Stroke on boxes = solid; connectors = dashed/dotted per diagram.
 */
export const sketchPalettes: Record<string, SketchPalette> = {
  blue: { bg: '#E8EAF8', border: '#6366F1', text: '#1E1B4B', hatch: '#6366F1' },
  green: { bg: '#E6F6EE', border: '#10B981', text: '#064E3B', hatch: '#10B981' },
  amber: { bg: '#FEF3E0', border: '#F59E0B', text: '#78350F', hatch: '#F59E0B' },
  rose: { bg: '#FDE8EC', border: '#F43F5E', text: '#881337', hatch: '#F43F5E' },
  violet: { bg: '#EEE8FA', border: '#8B5CF6', text: '#4C1D95', hatch: '#8B5CF6' },
  neutral: { bg: '#F1F3F5', border: '#868E96', text: '#1E293B', hatch: '#868E96' },
};

/** Dark — matches Excalidraw low-contrast fills + bright borders */
export const sketchPalettesDark: Record<string, SketchPalette> = {
  blue: { bg: '#252647', border: '#6D70C6', text: '#E8EAF8', hatch: '#6D70C6' },
  green: { bg: '#0A2E22', border: '#22C55E', text: '#D1FAE5', hatch: '#22C55E' },
  amber: { bg: '#451A03', border: '#F59E0B', text: '#FEF3C7', hatch: '#F59E0B' },
  rose: { bg: '#3F0A14', border: '#FB7185', text: '#FFE4E6', hatch: '#FB7185' },
  violet: { bg: '#2E1A4A', border: '#A78BFA', text: '#EDE9FE', hatch: '#A78BFA' },
  neutral: { bg: '#1A1D24', border: '#94A3B8', text: '#E2E8F0', hatch: '#94A3B8' },
};

export function getSketchPalettes(isDark = false): Record<string, SketchPalette> {
  return isDark ? sketchPalettesDark : sketchPalettes;
}

/** Mermaid classDef name → sketch fill + stroke (box stroke; edges use dashed separately) */
export const mermaidSketchStyles: Record<
  string,
  { fill: SketchFillStyle; stroke: SketchStrokeStyle; palette: keyof typeof sketchPalettes }
> = {
  input: { fill: 'solid', stroke: 'solid', palette: 'blue' },
  process: { fill: 'solid', stroke: 'solid', palette: 'green' },
  output: { fill: 'solid', stroke: 'solid', palette: 'amber' },
  highlight: { fill: 'hachure', stroke: 'solid', palette: 'rose' },
  matrix: { fill: 'solid', stroke: 'solid', palette: 'violet' },
  dim: { fill: 'solid', stroke: 'dotted', palette: 'neutral' },
  weight: { fill: 'solid', stroke: 'solid', palette: 'green' },
  a: { fill: 'solid', stroke: 'solid', palette: 'blue' },
  b: { fill: 'solid', stroke: 'solid', palette: 'green' },
  c: { fill: 'solid', stroke: 'solid', palette: 'amber' },
  out: { fill: 'solid', stroke: 'solid', palette: 'amber' },
  train: { fill: 'solid', stroke: 'solid', palette: 'blue' },
  model: { fill: 'solid', stroke: 'solid', palette: 'green' },
  gpt: { fill: 'solid', stroke: 'solid', palette: 'amber' },
  attn: { fill: 'hachure', stroke: 'solid', palette: 'rose' },
  mlp: { fill: 'solid', stroke: 'solid', palette: 'rose' },
  block: { fill: 'solid', stroke: 'solid', palette: 'violet' },
  data: { fill: 'solid', stroke: 'solid', palette: 'blue' },
  lookup: { fill: 'solid', stroke: 'solid', palette: 'green' },
  vector: { fill: 'solid', stroke: 'solid', palette: 'amber' },
  scalar: { fill: 'solid', stroke: 'solid', palette: 'blue' },
  embed: { fill: 'solid', stroke: 'solid', palette: 'violet' },
  layer: { fill: 'solid', stroke: 'solid', palette: 'green' },
  bad: { fill: 'solid', stroke: 'dashed', palette: 'rose' },
  good: { fill: 'solid', stroke: 'solid', palette: 'green' },
  fail: { fill: 'solid', stroke: 'dashed', palette: 'rose' },
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
  const tokens = className.split(/\s+/).filter(Boolean);
  const skip = new Set(['node', 'default', 'flowchart-label', 'label', 'clickable']);
  const keys = Object.keys(mermaidSketchStyles).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (skip.has(key)) continue;
    if (tokens.includes(key)) return mermaidSketchStyles[key];
  }
  return mermaidSketchStyles.input;
}

/** Build Mermaid classDef string from palette */
export function paletteToClassDef(p: SketchPalette): string {
  return `fill:${p.bg},color:${p.text},stroke:${p.border},stroke-width:2px`;
}
