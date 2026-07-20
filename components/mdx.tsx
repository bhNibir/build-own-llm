import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { ConceptAnim } from './diagrams/ConceptAnim';
import { StepReveal, TokenFlow } from './mdx/animate/StepReveal';
import { Mermaid } from './mdx/mermaid';
import {
  CodeLink,
  Formula,
  MathIntuition,
  MathLesson,
  SymbolTable,
  WorkedExample,
} from './mdx/math/MathLesson';
import { Illustration } from './illustrations';
import { Playground } from './playground/PlaygroundLazy';
import { GenerateControls } from './mdx/GenerateControls';
import { AttentionHeatmap } from './visualizer/AttentionHeatmap';
import { LossChart } from './visualizer/LossChart';
import { MatrixViz } from './visualizer/MatrixViz';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Mermaid,
    ConceptAnim,
    Playground,
    Illustration,
    StepReveal,
    TokenFlow,
    MathLesson,
    MathIntuition,
    SymbolTable,
    Formula,
    WorkedExample,
    CodeLink,
    LossChart,
    AttentionHeatmap,
    MatrixViz,
    GenerateControls,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
