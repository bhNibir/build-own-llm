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

/** Excalidraw-inspired: light pastel fills, dark text, visible sketch strokes */
export const moduleThemes: Record<string, ModuleTheme> = {
  default: {
    primaryColor: '#E7F5FF',
    primaryTextColor: '#1E293B',
    primaryBorderColor: '#1971C2',
    secondaryColor: '#E6FCF5',
    secondaryTextColor: '#1E293B',
    secondaryBorderColor: '#099268',
    tertiaryColor: '#FFF9DB',
    tertiaryTextColor: '#1E293B',
    lineColor: '#495057',
    background: '#FFFEF9',
    mainBkg: '#FFFEF9',
    textColor: '#1E293B',
    nodeBorder: '#495057',
    clusterBkg: '#F8F9FA',
    titleColor: '#1E293B',
    edgeLabelBackground: '#FFFEF9',
  },
  dark: {
    primaryColor: '#1E3A5F',
    primaryTextColor: '#E7F5FF',
    primaryBorderColor: '#74C0FC',
    secondaryColor: '#1A3D34',
    secondaryTextColor: '#C3FAE8',
    secondaryBorderColor: '#63E6BE',
    tertiaryColor: '#3D3319',
    tertiaryTextColor: '#FFF3BF',
    lineColor: '#ADB5BD',
    background: '#1A1B1E',
    mainBkg: '#25262B',
    textColor: '#E9ECEF',
    nodeBorder: '#ADB5BD',
    clusterBkg: '#2C2E33',
    titleColor: '#E9ECEF',
    edgeLabelBackground: '#25262B',
  },
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
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    fontSize: '14px',
  };
}

/** Excalidraw-style classDef presets — always dark text on light fill */
export const excalidrawClassDefs: Record<string, string> = {
  input: 'fill:#E7F5FF,color:#1E293B,stroke:#1971C2,stroke-width:2px',
  process: 'fill:#E6FCF5,color:#1E293B,stroke:#099268,stroke-width:2px',
  output: 'fill:#FFF9DB,color:#1E293B,stroke:#F08C00,stroke-width:2px',
  highlight: 'fill:#FFE3E3,color:#1E293B,stroke:#E03131,stroke-width:2px',
  matrix: 'fill:#F3F0FF,color:#1E293B,stroke:#7950F2,stroke-width:2px',
  dim: 'fill:#F1F3F5,color:#495057,stroke:#868E96,stroke-width:2px',
  weight: 'fill:#E6FCF5,color:#1E293B,stroke:#099268,stroke-width:2px',
  a: 'fill:#E7F5FF,color:#1E293B,stroke:#1971C2,stroke-width:2px',
  b: 'fill:#E6FCF5,color:#1E293B,stroke:#099268,stroke-width:2px',
  c: 'fill:#FFF9DB,color:#1E293B,stroke:#F08C00,stroke-width:2px',
  out: 'fill:#FFF9DB,color:#1E293B,stroke:#F08C00,stroke-width:2px',
  train: 'fill:#E7F5FF,color:#1E293B,stroke:#1971C2,stroke-width:2px',
  model: 'fill:#E6FCF5,color:#1E293B,stroke:#099268,stroke-width:2px',
  gpt: 'fill:#FFF9DB,color:#1E293B,stroke:#F08C00,stroke-width:2px',
  attn: 'fill:#FFF0F6,color:#1E293B,stroke:#C2255C,stroke-width:2px',
  mlp: 'fill:#FFE8F0,color:#1E293B,stroke:#D6336C,stroke-width:2px',
  block: 'fill:#F3F0FF,color:#1E293B,stroke:#7950F2,stroke-width:2px',
  data: 'fill:#E7F5FF,color:#1E293B,stroke:#1971C2,stroke-width:2px',
  lookup: 'fill:#E6FCF5,color:#1E293B,stroke:#099268,stroke-width:2px',
  vector: 'fill:#FFF9DB,color:#1E293B,stroke:#F08C00,stroke-width:2px',
  done: 'fill:#E6FCF5,color:#1E293B,stroke:#099268,stroke-width:2px',
  next: 'fill:#E7F5FF,color:#1E293B,stroke:#1971C2,stroke-width:2px',
};

const DARK_CLASSDEFS: Record<string, string> = {
  input: 'fill:#1E3A5F,color:#E7F5FF,stroke:#74C0FC,stroke-width:2px',
  process: 'fill:#1A3D34,color:#C3FAE8,stroke:#63E6BE,stroke-width:2px',
  output: 'fill:#3D3319,color:#FFF3BF,stroke:#FFD43B,stroke-width:2px',
  highlight: 'fill:#4A1D1D,color:#FFE3E3,stroke:#FF6B6B,stroke-width:2px',
  matrix: 'fill:#2D2640,color:#E5DBFF,stroke:#9775FA,stroke-width:2px',
  dim: 'fill:#2C2E33,color:#CED4DA,stroke:#868E96,stroke-width:2px',
  weight: 'fill:#1A3D34,color:#C3FAE8,stroke:#63E6BE,stroke-width:2px',
};

/** Upgrade legacy saturated classDefs to readable Excalidraw-style */
export function normalizeMermaidChart(chart: string, isDark: boolean): string {
  let result = chart;

  // Replace old white-text-on-saturated-fill classDefs
  result = result.replace(
    /classDef\s+(\w+)\s+fill:#[0-9A-Fa-f]{3,8},color:#fff,stroke:#[0-9A-Fa-f]{3,8}/gi,
    (_match, name: string) => {
      const defs = isDark ? { ...excalidrawClassDefs, ...DARK_CLASSDEFS } : excalidrawClassDefs;
      const style = defs[name.toLowerCase()] ?? defs.input;
      return `classDef ${name} ${style}`;
    },
  );

  // Strip emoji from node labels for readability (optional cleanup)
  result = result.replace(/["'][\u{1F300}-\u{1F9FF}\u2600-\u27BF]\s*/gu, '"');

  return result;
}

export const mermaidClassDefs = `
classDef input fill:#E7F5FF,color:#1E293B,stroke:#1971C2,stroke-width:2px
classDef process fill:#E6FCF5,color:#1E293B,stroke:#099268,stroke-width:2px
classDef output fill:#FFF9DB,color:#1E293B,stroke:#F08C00,stroke-width:2px
classDef highlight fill:#FFE3E3,color:#1E293B,stroke:#E03131,stroke-width:2px
`;
