import {
  getSketchPalettes,
  paletteToClassDef,
  sketchPalettes,
  sketchPalettesDark,
} from '../diagrams/sketch-styles';

export type ModuleTheme = {
  primaryColor: string;
  primaryTextColor: string;
  primaryBorderColor: string;
  secondaryColor: string;
  secondaryTextColor: string;
  secondaryBorderColor: string;
  tertiaryColor: string;
  tertiaryTextColor: string;
  lineColor: string;
  background: string;
  mainBkg: string;
  textColor: string;
  nodeBorder: string;
  clusterBkg: string;
  titleColor: string;
  edgeLabelBackground: string;
};

const BN_FONT =
  "var(--font-bn), 'Noto Sans Bengali', ui-sans-serif, system-ui, sans-serif";

function themeFromPalettes(isDark: boolean): ModuleTheme {
  const p = getSketchPalettes(isDark);
  return {
    primaryColor: p.blue.bg,
    primaryTextColor: p.blue.text,
    primaryBorderColor: p.blue.border,
    secondaryColor: p.green.bg,
    secondaryTextColor: p.green.text,
    secondaryBorderColor: p.green.border,
    tertiaryColor: p.amber.bg,
    tertiaryTextColor: p.amber.text,
    lineColor: isDark ? '#A5B4FC' : '#6366F1',
    background: isDark ? '#0F172A' : '#FFFFFF',
    mainBkg: isDark ? '#1E293B' : '#F8FAFC',
    textColor: isDark ? '#F1F5F9' : '#1E293B',
    nodeBorder: p.blue.border,
    clusterBkg: isDark ? '#1A1D24' : '#F1F5F9',
    titleColor: isDark ? '#F1F5F9' : '#1E293B',
    edgeLabelBackground: isDark ? '#1E293B' : '#FFFFFF',
  };
}

/** Excalidraw-aligned Mermaid themes (light pastel / dark low-contrast) */
export const moduleThemes: Record<string, ModuleTheme> = {
  default: themeFromPalettes(false),
  dark: themeFromPalettes(true),
};

export function getMermaidThemeVariables(isDark: boolean): Record<string, string> {
  const t = isDark ? moduleThemes.dark : moduleThemes.default;
  return {
    primaryColor: t.primaryColor,
    primaryTextColor: t.primaryTextColor,
    primaryBorderColor: t.primaryBorderColor,
    secondaryColor: t.secondaryColor,
    secondaryTextColor: t.secondaryTextColor,
    secondaryBorderColor: t.secondaryBorderColor,
    tertiaryColor: t.tertiaryColor,
    tertiaryTextColor: t.tertiaryTextColor,
    lineColor: t.lineColor,
    background: t.background,
    mainBkg: t.mainBkg,
    textColor: t.textColor,
    nodeBorder: t.nodeBorder,
    clusterBkg: t.clusterBkg,
    titleColor: t.titleColor,
    edgeLabelBackground: t.edgeLabelBackground,
    fontFamily: BN_FONT,
    fontSize: '14px',
  };
}

function buildClassDefs(isDark: boolean): Record<string, string> {
  const p = isDark ? sketchPalettesDark : sketchPalettes;
  return {
    input: paletteToClassDef(p.blue),
    process: paletteToClassDef(p.green),
    output: paletteToClassDef(p.amber),
    highlight: paletteToClassDef(p.rose),
    matrix: paletteToClassDef(p.violet),
    dim: paletteToClassDef(p.neutral),
    weight: paletteToClassDef(p.green),
    a: paletteToClassDef(p.blue),
    b: paletteToClassDef(p.green),
    c: paletteToClassDef(p.amber),
    out: paletteToClassDef(p.amber),
    train: paletteToClassDef(p.blue),
    model: paletteToClassDef(p.green),
    gpt: paletteToClassDef(p.amber),
    attn: paletteToClassDef(p.rose),
    mlp: paletteToClassDef(p.rose),
    block: paletteToClassDef(p.violet),
    data: paletteToClassDef(p.blue),
    lookup: paletteToClassDef(p.green),
    vector: paletteToClassDef(p.amber),
    scalar: paletteToClassDef(p.blue),
    embed: paletteToClassDef(p.violet),
    layer: paletteToClassDef(p.green),
    bad: paletteToClassDef(p.rose),
    good: paletteToClassDef(p.green),
    fail: paletteToClassDef(p.rose),
    success: paletteToClassDef(p.green),
    done: paletteToClassDef(p.green),
    next: paletteToClassDef(p.blue),
  };
}

export const excalidrawClassDefs = buildClassDefs(false);
const DARK_CLASSDEFS = buildClassDefs(true);

export function normalizeMermaidChart(chart: string, isDark: boolean): string {
  let result = chart;
  const defs = isDark ? DARK_CLASSDEFS : excalidrawClassDefs;

  result = result.replace(/classDef\s+(\w+)\s+[^\n]+/gi, (match, name: string) => {
    const key = name.toLowerCase();
    const style = defs[key];
    if (style) return `classDef ${name} ${style}`;
    if (/color:#fff(?:fff)?/i.test(match) || /color:#000(?:000)?/i.test(match)) {
      return `classDef ${name} ${defs.input}`;
    }
    return match;
  });

  // Charts with no classDef (Module index pages): inject readable defaults
  if (!/classDef\s+\w+/i.test(result) && /flowchart/i.test(result)) {
    result += `\n${mermaidClassDefs(isDark).trim()}`;
  }

  result = result.replace(/["'][\u{1F300}-\u{1F9FF}\u2600-\u27BF]\s*/gu, '"');
  return result;
}

export function mermaidClassDefs(isDark = false): string {
  const d = isDark ? DARK_CLASSDEFS : excalidrawClassDefs;
  return `
classDef input ${d.input}
classDef process ${d.process}
classDef output ${d.output}
classDef highlight ${d.highlight}
`;
}
