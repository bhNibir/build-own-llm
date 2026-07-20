'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/cn';
import { getMermaidThemeVariables, normalizeMermaidChart } from './diagram-theme';
import { enhanceMermaidSvg } from './sketch-svg';

export function Mermaid({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, '');
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !chart?.trim()) return;

    let cancelled = false;
    setError('');
    setSvg('');

    async function render() {
      try {
        const mermaid = (await import('mermaid')).default;
        const isDark = resolvedTheme === 'dark';
        const normalizedChart = normalizeMermaidChart(chart, isDark);

        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: getMermaidThemeVariables(isDark),
          securityLevel: 'loose',
          flowchart: {
            curve: 'basis',
            padding: 16,
            htmlLabels: true,
            useMaxWidth: true,
          },
          fontSize: 14,
        });

        const { svg: rendered } = await mermaid.render(
          `mermaid-${id}-${Date.now()}`,
          normalizedChart.trim(),
        );

        if (!cancelled) {
          setSvg(enhanceMermaidSvg(rendered, isDark));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    }

    void render();

    return () => {
      cancelled = true;
    };
  }, [chart, id, resolvedTheme, mounted]);

  if (!mounted) {
    return (
      <div className="my-6 not-prose h-32 animate-pulse rounded-2xl border-2 border-indigo-200/60 bg-white dark:border-indigo-800/40 dark:bg-slate-900" />
    );
  }

  if (error) {
    return (
      <div className="my-6 not-prose rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950/40">
        <p className="text-sm font-medium text-amber-900 dark:text-amber-200">Diagram render error</p>
        <pre className="mt-2 overflow-x-auto text-xs text-amber-800 dark:text-amber-300">{error}</pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div
        ref={containerRef}
        className="my-6 not-prose flex h-36 items-center justify-center rounded-2xl border-2 border-indigo-200/60 bg-white text-sm text-fd-muted-foreground dark:border-indigo-800/40 dark:bg-slate-900"
      >
        Loading diagram…
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'mermaid-diagram my-6 not-prose overflow-x-auto rounded-2xl border-2 border-indigo-200/70 bg-white p-5 shadow-sm',
        'dark:border-indigo-800/50 dark:bg-slate-900',
        '[&>svg]:mx-auto [&>svg]:block [&>svg]:h-auto [&>svg]:min-h-[80px] [&>svg]:max-w-full',
        '[&_.nodeLabel]:text-sm [&_.edgeLabel]:text-xs',
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
