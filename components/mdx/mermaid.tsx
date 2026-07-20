'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

export function Mermaid({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, '');
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [svg, setSvg] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const mermaid = (await import('mermaid')).default;

      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === 'dark' ? 'dark' : 'default',
        securityLevel: 'loose',
      });

      const { svg: rendered } = await mermaid.render(`mermaid-${id}`, chart);

      if (!cancelled) {
        setSvg(rendered);
      }
    }

    void render();

    return () => {
      cancelled = true;
    };
  }, [chart, id, resolvedTheme]);

  if (!svg) {
    return (
      <div
        ref={containerRef}
        className="my-4 overflow-x-auto rounded-lg border border-fd-border bg-fd-muted/30 p-4 text-sm text-fd-muted-foreground"
      >
        Loading diagram...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-4 overflow-x-auto rounded-lg border border-fd-border bg-fd-background p-4 [&>svg]:mx-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
