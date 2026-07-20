export type ModuleTheme = {
  primaryColor: string;
  primaryTextColor: string;
  primaryBorderColor: string;
  secondaryColor: string;
  secondaryTextColor: string;
  secondaryBorderColor: string;
  tertiaryColor: string;
  tertiaryTextColor?: string;
  lineColor: string;
  background: string;
  mainBkg: string;
  textColor: string;
  nodeBorder?: string;
  clusterBkg?: string;
  titleColor?: string;
  edgeLabelBackground?: string;
};

export const moduleThemes: Record<string, ModuleTheme> = {
  default: {
    primaryColor: '#4F46E5',
    primaryTextColor: '#ffffff',
    primaryBorderColor: '#3730A3',
    secondaryColor: '#10B981',
    secondaryTextColor: '#ffffff',
    secondaryBorderColor: '#047857',
    tertiaryColor: '#F59E0B',
    tertiaryTextColor: '#ffffff',
    lineColor: '#4338CA',
    background: '#ffffff',
    mainBkg: '#EEF2FF',
    textColor: '#1E293B',
    nodeBorder: '#4338CA',
    clusterBkg: '#F1F5F9',
    titleColor: '#1E293B',
    edgeLabelBackground: '#ffffff',
  },
  dark: {
    primaryColor: '#6366F1',
    primaryTextColor: '#ffffff',
    primaryBorderColor: '#818CF8',
    secondaryColor: '#34D399',
    secondaryTextColor: '#064E3B',
    secondaryBorderColor: '#6EE7B7',
    tertiaryColor: '#FBBF24',
    tertiaryTextColor: '#1E293B',
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
  const t = isDark ? moduleThemes.dark : moduleThemes.default;
  return {
    primaryColor: t.primaryColor,
    primaryTextColor: t.primaryTextColor,
    primaryBorderColor: t.primaryBorderColor,
    secondaryColor: t.secondaryColor,
    secondaryTextColor: t.secondaryTextColor,
    secondaryBorderColor: t.secondaryBorderColor,
    tertiaryColor: t.tertiaryColor,
    lineColor: t.lineColor,
    background: t.background,
    mainBkg: t.mainBkg,
    textColor: t.textColor,
    nodeBorder: t.nodeBorder ?? t.primaryBorderColor,
    clusterBkg: t.clusterBkg ?? t.mainBkg,
    titleColor: t.titleColor ?? t.textColor,
    edgeLabelBackground: t.edgeLabelBackground ?? t.background,
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    fontSize: '14px',
  };
}

/** Common classDef snippets for lesson authors */
export const mermaidClassDefs = `
classDef input fill:#4F46E5,color:#fff,stroke:#3730A3
classDef process fill:#10B981,color:#fff,stroke:#047857
classDef output fill:#F59E0B,color:#fff,stroke:#D97706
classDef highlight fill:#EC4899,color:#fff,stroke:#BE185D
`;
