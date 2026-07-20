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

/** Modern pastel fills, dark text — high contrast */
export const moduleThemes: Record<string, ModuleTheme> = {
  default: {
    primaryColor: '#EEF2FF',
    primaryTextColor: '#1E1B4B',
    primaryBorderColor: '#4F46E5',
    secondaryColor: '#ECFDF5',
    secondaryTextColor: '#064E3B',
    secondaryBorderColor: '#059669',
    tertiaryColor: '#FFFBEB',
    tertiaryTextColor: '#78350F',
    lineColor: '#4F46E5',
    background: '#FFFFFF',
    mainBkg: '#F8FAFC',
    textColor: '#1E293B',
    nodeBorder: '#4F46E5',
    clusterBkg: '#F1F5F9',
    titleColor: '#1E293B',
    edgeLabelBackground: '#FFFFFF',
  },
  dark: {
    primaryColor: '#1E1B4B',
    primaryTextColor: '#E0E7FF',
    primaryBorderColor: '#818CF8',
    secondaryColor: '#064E3B',
    secondaryTextColor: '#D1FAE5',
    secondaryBorderColor: '#34D399',
    tertiaryColor: '#78350F',
    tertiaryTextColor: '#FEF3C7',
    lineColor: '#A5B4FC',
    background: '#0F172A',
    mainBkg: '#1E293B',
    textColor: '#F1F5F9',
    nodeBorder: '#818CF8',
    clusterBkg: '#334155',
    titleColor: '#F1F5F9',
    edgeLabelBackground: '#1E293B',
  },
};

export function getMermaidThemeVariables(isDark: boolean): Record<string, string> {
  // Node fills stay pastel with dark text in both themes (readable Module 1/2 diagrams).
  // Only chrome (lines, edge label bg) follows dark mode.
  const light = moduleThemes.default;
  const dark = moduleThemes.dark;
  return {
    primaryColor: light.primaryColor,
    primaryTextColor: light.primaryTextColor,
    primaryBorderColor: light.primaryBorderColor,
    secondaryColor: light.secondaryColor,
    secondaryTextColor: light.secondaryTextColor,
    secondaryBorderColor: light.secondaryBorderColor,
    tertiaryColor: light.tertiaryColor,
    tertiaryTextColor: light.tertiaryTextColor,
    lineColor: isDark ? dark.lineColor : light.lineColor,
    background: isDark ? dark.background : light.background,
    mainBkg: light.mainBkg,
    textColor: light.textColor,
    nodeBorder: light.nodeBorder,
    clusterBkg: isDark ? dark.clusterBkg : light.clusterBkg,
    titleColor: isDark ? dark.titleColor : light.titleColor,
    edgeLabelBackground: isDark ? dark.edgeLabelBackground : light.edgeLabelBackground,
    fontFamily: BN_FONT,
    fontSize: '14px',
  };
}

export const excalidrawClassDefs: Record<string, string> = {
  input: 'fill:#EEF2FF,color:#1E1B4B,stroke:#4F46E5,stroke-width:2px',
  process: 'fill:#ECFDF5,color:#064E3B,stroke:#059669,stroke-width:2px',
  output: 'fill:#FFFBEB,color:#78350F,stroke:#D97706,stroke-width:2px',
  highlight: 'fill:#FFF1F2,color:#881337,stroke:#E11D48,stroke-width:2px',
  matrix: 'fill:#F5F3FF,color:#4C1D95,stroke:#7C3AED,stroke-width:2px',
  dim: 'fill:#F8FAFC,color:#475569,stroke:#94A3B8,stroke-width:2px',
  weight: 'fill:#ECFDF5,color:#064E3B,stroke:#059669,stroke-width:2px',
  a: 'fill:#EEF2FF,color:#1E1B4B,stroke:#4F46E5,stroke-width:2px',
  b: 'fill:#ECFDF5,color:#064E3B,stroke:#059669,stroke-width:2px',
  c: 'fill:#FFFBEB,color:#78350F,stroke:#D97706,stroke-width:2px',
  out: 'fill:#FFFBEB,color:#78350F,stroke:#D97706,stroke-width:2px',
  train: 'fill:#EEF2FF,color:#1E1B4B,stroke:#4F46E5,stroke-width:2px',
  model: 'fill:#ECFDF5,color:#064E3B,stroke:#059669,stroke-width:2px',
  gpt: 'fill:#FFFBEB,color:#78350F,stroke:#D97706,stroke-width:2px',
  attn: 'fill:#FFF1F2,color:#881337,stroke:#E11D48,stroke-width:2px',
  mlp: 'fill:#FDF2F8,color:#831843,stroke:#DB2777,stroke-width:2px',
  block: 'fill:#F5F3FF,color:#4C1D95,stroke:#7C3AED,stroke-width:2px',
  data: 'fill:#EEF2FF,color:#1E1B4B,stroke:#4F46E5,stroke-width:2px',
  lookup: 'fill:#ECFDF5,color:#064E3B,stroke:#059669,stroke-width:2px',
  vector: 'fill:#FFFBEB,color:#78350F,stroke:#D97706,stroke-width:2px',
  scalar: 'fill:#EEF2FF,color:#1E1B4B,stroke:#4F46E5,stroke-width:2px',
  embed: 'fill:#F5F3FF,color:#4C1D95,stroke:#7C3AED,stroke-width:2px',
  layer: 'fill:#ECFDF5,color:#064E3B,stroke:#059669,stroke-width:2px',
  bad: 'fill:#FFF1F2,color:#881337,stroke:#E11D48,stroke-width:2px',
  good: 'fill:#ECFDF5,color:#064E3B,stroke:#059669,stroke-width:2px',
  fail: 'fill:#FFF1F2,color:#881337,stroke:#E11D48,stroke-width:2px',
  success: 'fill:#ECFDF5,color:#064E3B,stroke:#059669,stroke-width:2px',
  done: 'fill:#ECFDF5,color:#064E3B,stroke:#059669,stroke-width:2px',
  next: 'fill:#EEF2FF,color:#1E1B4B,stroke:#4F46E5,stroke-width:2px',
};

const DARK_CLASSDEFS: Record<string, string> = {
  input: 'fill:#1E1B4B,color:#E0E7FF,stroke:#818CF8,stroke-width:2px',
  process: 'fill:#064E3B,color:#D1FAE5,stroke:#34D399,stroke-width:2px',
  output: 'fill:#78350F,color:#FEF3C7,stroke:#FBBF24,stroke-width:2px',
  highlight: 'fill:#881337,color:#FFE4E6,stroke:#FB7185,stroke-width:2px',
  matrix: 'fill:#4C1D95,color:#EDE9FE,stroke:#A78BFA,stroke-width:2px',
  dim: 'fill:#1E293B,color:#CBD5E1,stroke:#94A3B8,stroke-width:2px',
  weight: 'fill:#064E3B,color:#D1FAE5,stroke:#34D399,stroke-width:2px',
  a: 'fill:#1E1B4B,color:#E0E7FF,stroke:#818CF8,stroke-width:2px',
  b: 'fill:#064E3B,color:#D1FAE5,stroke:#34D399,stroke-width:2px',
  c: 'fill:#78350F,color:#FEF3C7,stroke:#FBBF24,stroke-width:2px',
  out: 'fill:#78350F,color:#FEF3C7,stroke:#FBBF24,stroke-width:2px',
  train: 'fill:#1E1B4B,color:#E0E7FF,stroke:#818CF8,stroke-width:2px',
  model: 'fill:#064E3B,color:#D1FAE5,stroke:#34D399,stroke-width:2px',
  gpt: 'fill:#78350F,color:#FEF3C7,stroke:#FBBF24,stroke-width:2px',
  attn: 'fill:#881337,color:#FFE4E6,stroke:#FB7185,stroke-width:2px',
  mlp: 'fill:#831843,color:#FCE7F3,stroke:#F472B6,stroke-width:2px',
  block: 'fill:#4C1D95,color:#EDE9FE,stroke:#A78BFA,stroke-width:2px',
  data: 'fill:#1E1B4B,color:#E0E7FF,stroke:#818CF8,stroke-width:2px',
  lookup: 'fill:#064E3B,color:#D1FAE5,stroke:#34D399,stroke-width:2px',
  vector: 'fill:#78350F,color:#FEF3C7,stroke:#FBBF24,stroke-width:2px',
  scalar: 'fill:#1E1B4B,color:#E0E7FF,stroke:#818CF8,stroke-width:2px',
  embed: 'fill:#4C1D95,color:#EDE9FE,stroke:#A78BFA,stroke-width:2px',
  layer: 'fill:#064E3B,color:#D1FAE5,stroke:#34D399,stroke-width:2px',
  bad: 'fill:#881337,color:#FFE4E6,stroke:#FB7185,stroke-width:2px',
  good: 'fill:#064E3B,color:#D1FAE5,stroke:#34D399,stroke-width:2px',
  fail: 'fill:#881337,color:#FFE4E6,stroke:#FB7185,stroke-width:2px',
  success: 'fill:#064E3B,color:#D1FAE5,stroke:#34D399,stroke-width:2px',
  done: 'fill:#064E3B,color:#D1FAE5,stroke:#34D399,stroke-width:2px',
  next: 'fill:#1E1B4B,color:#E0E7FF,stroke:#818CF8,stroke-width:2px',
};

export function normalizeMermaidChart(chart: string, isDark: boolean): string {
  let result = chart;
  // Keep pastel fills + dark text in BOTH themes so labels stay readable.
  // (Dark fills + failed label updates caused same-color text in Module 1/2.)
  const defs = excalidrawClassDefs;
  void isDark;

  result = result.replace(/classDef\s+(\w+)\s+[^\n]+/gi, (match, name: string) => {
    const key = name.toLowerCase();
    const style = defs[key];
    if (style) return `classDef ${name} ${style}`;
    // White-on-saturated → pastel + dark text
    if (/color:#fff(?:fff)?/i.test(match) || /color:#000(?:000)?/i.test(match)) {
      return `classDef ${name} ${defs.input}`;
    }
    return match;
  });

  // Charts with no classDef (Module index pages): inject readable defaults
  if (!/classDef\s+\w+/i.test(result) && /flowchart/i.test(result)) {
    result += `\n${mermaidClassDefs.trim()}`;
  }

  result = result.replace(/["'][\u{1F300}-\u{1F9FF}\u2600-\u27BF]\s*/gu, '"');
  return result;
}

export const mermaidClassDefs = `
classDef input fill:#EEF2FF,color:#1E1B4B,stroke:#4F46E5,stroke-width:2px
classDef process fill:#ECFDF5,color:#064E3B,stroke:#059669,stroke-width:2px
classDef output fill:#FFFBEB,color:#78350F,stroke:#D97706,stroke-width:2px
classDef highlight fill:#FFF1F2,color:#881337,stroke:#E11D48,stroke-width:2px
`;
