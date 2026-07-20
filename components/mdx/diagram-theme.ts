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

/** Vivid pastel fills, dark text — easy to scan */
export const moduleThemes: Record<string, ModuleTheme> = {
  default: {
    primaryColor: '#C7D2FE',
    primaryTextColor: '#1E1B4B',
    primaryBorderColor: '#4338CA',
    secondaryColor: '#A7F3D0',
    secondaryTextColor: '#064E3B',
    secondaryBorderColor: '#047857',
    tertiaryColor: '#FDE68A',
    tertiaryTextColor: '#78350F',
    lineColor: '#4338CA',
    background: '#FFFFFF',
    mainBkg: '#F8FAFC',
    textColor: '#1E293B',
    nodeBorder: '#4338CA',
    clusterBkg: '#E0E7FF',
    titleColor: '#1E293B',
    edgeLabelBackground: '#FFFFFF',
  },
  dark: {
    primaryColor: '#A5B4FC',
    primaryTextColor: '#1E1B4B',
    primaryBorderColor: '#818CF8',
    secondaryColor: '#6EE7B7',
    secondaryTextColor: '#064E3B',
    secondaryBorderColor: '#34D399',
    tertiaryColor: '#FCD34D',
    tertiaryTextColor: '#78350F',
    lineColor: '#A5B4FC',
    background: '#0F172A',
    mainBkg: '#A5B4FC',
    textColor: '#1E293B',
    nodeBorder: '#818CF8',
    clusterBkg: '#334155',
    titleColor: '#F1F5F9',
    edgeLabelBackground: '#1E293B',
  },
};

export function getMermaidThemeVariables(isDark: boolean): Record<string, string> {
  const light = moduleThemes.default;
  const dark = moduleThemes.dark;
  const t = isDark ? dark : light;
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
    mainBkg: light.mainBkg,
    textColor: light.textColor,
    nodeBorder: t.nodeBorder,
    clusterBkg: isDark ? dark.clusterBkg : light.clusterBkg,
    titleColor: isDark ? dark.titleColor : light.titleColor,
    edgeLabelBackground: t.edgeLabelBackground,
    fontFamily: BN_FONT,
    fontSize: '14px',
  };
}

export const excalidrawClassDefs: Record<string, string> = {
  input: 'fill:#C7D2FE,color:#1E1B4B,stroke:#4338CA,stroke-width:2.5px',
  process: 'fill:#A7F3D0,color:#064E3B,stroke:#047857,stroke-width:2.5px',
  output: 'fill:#FDE68A,color:#78350F,stroke:#B45309,stroke-width:2.5px',
  highlight: 'fill:#FECDD3,color:#881337,stroke:#BE123C,stroke-width:2.5px',
  matrix: 'fill:#DDD6FE,color:#4C1D95,stroke:#6D28D9,stroke-width:2.5px',
  dim: 'fill:#E2E8F0,color:#475569,stroke:#64748B,stroke-width:2px',
  weight: 'fill:#A7F3D0,color:#064E3B,stroke:#047857,stroke-width:2.5px',
  a: 'fill:#C7D2FE,color:#1E1B4B,stroke:#4338CA,stroke-width:2.5px',
  b: 'fill:#A7F3D0,color:#064E3B,stroke:#047857,stroke-width:2.5px',
  c: 'fill:#FDE68A,color:#78350F,stroke:#B45309,stroke-width:2.5px',
  out: 'fill:#FDE68A,color:#78350F,stroke:#B45309,stroke-width:2.5px',
  train: 'fill:#C7D2FE,color:#1E1B4B,stroke:#4338CA,stroke-width:2.5px',
  model: 'fill:#A7F3D0,color:#064E3B,stroke:#047857,stroke-width:2.5px',
  gpt: 'fill:#FDE68A,color:#78350F,stroke:#B45309,stroke-width:2.5px',
  attn: 'fill:#FECDD3,color:#881337,stroke:#BE123C,stroke-width:2.5px',
  mlp: 'fill:#FBCFE8,color:#831843,stroke:#DB2777,stroke-width:2.5px',
  block: 'fill:#DDD6FE,color:#4C1D95,stroke:#6D28D9,stroke-width:2.5px',
  data: 'fill:#C7D2FE,color:#1E1B4B,stroke:#4338CA,stroke-width:2.5px',
  lookup: 'fill:#A7F3D0,color:#064E3B,stroke:#047857,stroke-width:2.5px',
  vector: 'fill:#FDE68A,color:#78350F,stroke:#B45309,stroke-width:2.5px',
  scalar: 'fill:#C7D2FE,color:#1E1B4B,stroke:#4338CA,stroke-width:2.5px',
  embed: 'fill:#DDD6FE,color:#4C1D95,stroke:#6D28D9,stroke-width:2.5px',
  layer: 'fill:#A7F3D0,color:#064E3B,stroke:#047857,stroke-width:2.5px',
  bad: 'fill:#FECDD3,color:#881337,stroke:#BE123C,stroke-width:2.5px',
  good: 'fill:#A7F3D0,color:#064E3B,stroke:#047857,stroke-width:2.5px',
  fail: 'fill:#FECDD3,color:#881337,stroke:#BE123C,stroke-width:2.5px',
  success: 'fill:#A7F3D0,color:#064E3B,stroke:#047857,stroke-width:2.5px',
  done: 'fill:#A7F3D0,color:#064E3B,stroke:#047857,stroke-width:2.5px',
  next: 'fill:#C7D2FE,color:#1E1B4B,stroke:#4338CA,stroke-width:2.5px',
};

const DARK_CLASSDEFS: Record<string, string> = {
  // Same vivid pastels + dark text as light — readable in dark page chrome
  input: 'fill:#A5B4FC,color:#1E1B4B,stroke:#818CF8,stroke-width:2.5px',
  process: 'fill:#6EE7B7,color:#064E3B,stroke:#34D399,stroke-width:2.5px',
  output: 'fill:#FCD34D,color:#78350F,stroke:#FBBF24,stroke-width:2.5px',
  highlight: 'fill:#FDA4AF,color:#881337,stroke:#FB7185,stroke-width:2.5px',
  matrix: 'fill:#C4B5FD,color:#4C1D95,stroke:#A78BFA,stroke-width:2.5px',
  dim: 'fill:#CBD5E1,color:#1E293B,stroke:#94A3B8,stroke-width:2px',
  weight: 'fill:#6EE7B7,color:#064E3B,stroke:#34D399,stroke-width:2.5px',
  a: 'fill:#A5B4FC,color:#1E1B4B,stroke:#818CF8,stroke-width:2.5px',
  b: 'fill:#6EE7B7,color:#064E3B,stroke:#34D399,stroke-width:2.5px',
  c: 'fill:#FCD34D,color:#78350F,stroke:#FBBF24,stroke-width:2.5px',
  out: 'fill:#FCD34D,color:#78350F,stroke:#FBBF24,stroke-width:2.5px',
  train: 'fill:#A5B4FC,color:#1E1B4B,stroke:#818CF8,stroke-width:2.5px',
  model: 'fill:#6EE7B7,color:#064E3B,stroke:#34D399,stroke-width:2.5px',
  gpt: 'fill:#FCD34D,color:#78350F,stroke:#FBBF24,stroke-width:2.5px',
  attn: 'fill:#FDA4AF,color:#881337,stroke:#FB7185,stroke-width:2.5px',
  mlp: 'fill:#F9A8D4,color:#831843,stroke:#F472B6,stroke-width:2.5px',
  block: 'fill:#C4B5FD,color:#4C1D95,stroke:#A78BFA,stroke-width:2.5px',
  data: 'fill:#A5B4FC,color:#1E1B4B,stroke:#818CF8,stroke-width:2.5px',
  lookup: 'fill:#6EE7B7,color:#064E3B,stroke:#34D399,stroke-width:2.5px',
  vector: 'fill:#FCD34D,color:#78350F,stroke:#FBBF24,stroke-width:2.5px',
  scalar: 'fill:#A5B4FC,color:#1E1B4B,stroke:#818CF8,stroke-width:2.5px',
  embed: 'fill:#C4B5FD,color:#4C1D95,stroke:#A78BFA,stroke-width:2.5px',
  layer: 'fill:#6EE7B7,color:#064E3B,stroke:#34D399,stroke-width:2.5px',
  bad: 'fill:#FDA4AF,color:#881337,stroke:#FB7185,stroke-width:2.5px',
  good: 'fill:#6EE7B7,color:#064E3B,stroke:#34D399,stroke-width:2.5px',
  fail: 'fill:#FDA4AF,color:#881337,stroke:#FB7185,stroke-width:2.5px',
  success: 'fill:#6EE7B7,color:#064E3B,stroke:#34D399,stroke-width:2.5px',
  done: 'fill:#6EE7B7,color:#064E3B,stroke:#34D399,stroke-width:2.5px',
  next: 'fill:#A5B4FC,color:#1E1B4B,stroke:#818CF8,stroke-width:2.5px',
};

export function normalizeMermaidChart(chart: string, isDark: boolean): string {
  let result = chart;
  const defs = isDark ? { ...excalidrawClassDefs, ...DARK_CLASSDEFS } : excalidrawClassDefs;

  result = result.replace(/classDef\s+(\w+)\s+[^\n]+/gi, (match, name: string) => {
    const key = name.toLowerCase();
    const style = defs[key];
    if (style) return `classDef ${name} ${style}`;
    if (/color:#fff(?:fff)?/i.test(match) || /color:#000(?:000)?/i.test(match)) {
      return `classDef ${name} ${defs.input}`;
    }
    return match;
  });

  if (!/classDef\s+\w+/i.test(result) && /flowchart/i.test(result)) {
    result += `\n${mermaidClassDefs.trim()}`;
  }

  result = result.replace(/["'][\u{1F300}-\u{1F9FF}\u2600-\u27BF]\s*/gu, '"');
  return result;
}

export const mermaidClassDefs = `
classDef input fill:#C7D2FE,color:#1E1B4B,stroke:#4338CA,stroke-width:2.5px
classDef process fill:#A7F3D0,color:#064E3B,stroke:#047857,stroke-width:2.5px
classDef output fill:#FDE68A,color:#78350F,stroke:#B45309,stroke-width:2.5px
classDef highlight fill:#FECDD3,color:#881337,stroke:#BE123C,stroke-width:2.5px
`;
