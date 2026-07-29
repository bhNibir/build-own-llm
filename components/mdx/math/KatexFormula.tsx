'use client';

import katex from 'katex';
import type { ReactNode } from 'react';
import { isValidElement, useMemo } from 'react';

function extractLatex(children: ReactNode): string | null {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) {
    const parts = children.map((c) => extractLatex(c)).filter(Boolean);
    return parts.length ? parts.join('') : null;
  }
  if (isValidElement<{ children?: ReactNode }>(children)) {
    return extractLatex(children.props.children);
  }
  return null;
}

function normalizeLatex(raw: string): string {
  let s = raw.trim();
  // Strip $$…$$ or $…$ wrappers from string children
  if (s.startsWith('$$') && s.endsWith('$$')) s = s.slice(2, -2).trim();
  else if (s.startsWith('$') && s.endsWith('$') && s.length > 2) s = s.slice(1, -1).trim();
  return s;
}

/** Renders KaTeX for string Formula children that bypass remark-math */
export function KatexFormula({ children }: { children: ReactNode }) {
  const html = useMemo(() => {
    const raw = extractLatex(children);
    if (!raw) return null;
    try {
      return katex.renderToString(normalizeLatex(raw), {
        displayMode: true,
        throwOnError: false,
        strict: 'ignore',
      });
    } catch {
      return null;
    }
  }, [children]);

  if (html) {
    return (
      <div
        className="overflow-x-auto py-1 text-center [&_.katex-display]:my-0"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  // Already KaTeX HTML from rehype, or unknown nodes — pass through
  return <div className="overflow-x-auto py-1 text-center [&_.katex-display]:my-0">{children}</div>;
}
