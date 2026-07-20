'use client';

import { cn } from '@/lib/cn';
import { useEffect, useRef, useState } from 'react';
import { createHighlighter, type Highlighter } from 'shiki';

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(isDark: boolean): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: ['typescript', 'javascript'],
    });
  }
  return highlighterPromise;
}

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  height?: number;
  isDark?: boolean;
};

export function CodeEditor({
  value,
  onChange,
  readOnly = false,
  height = 360,
  isDark = false,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [html, setHtml] = useState('');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const hl = await getHighlighter(isDark);
        const themed = hl.codeToHtml(value || ' ', {
          lang: 'typescript',
          theme: isDark ? 'github-dark' : 'github-light',
        });
        if (!cancelled) setHtml(themed);
      } catch {
        if (!cancelled) setHtml('');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [value, isDark]);

  return (
    <div
      className="relative overflow-auto"
      style={{ height, minHeight: 160 }}
    >
      <div
        className={cn(
          'pointer-events-none absolute inset-0 overflow-hidden p-4 font-mono text-[13px] leading-relaxed',
          '[&_pre]:!m-0 [&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:!bg-transparent',
          isDark ? 'bg-[#0d1117]' : 'bg-[#ffffff]',
        )}
        aria-hidden
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        spellCheck={false}
        className={cn(
          'relative z-10 h-full w-full resize-none border-0 bg-transparent p-4 font-mono text-[13px] leading-relaxed caret-indigo-500 outline-none',
          'text-transparent selection:bg-indigo-500/30',
          readOnly && 'cursor-default',
        )}
        style={{ WebkitTextFillColor: 'transparent' }}
      />
    </div>
  );
}
