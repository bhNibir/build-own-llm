'use client';

import { cn } from '@/lib/cn';

type LineKind = 'header' | 'error' | 'warn' | 'arrow' | 'label' | 'number' | 'ok' | 'default';

function classifyLine(line: string): LineKind {
  const t = line.trim();
  if (t.startsWith('Error:') || t.startsWith('✖')) return 'error';
  if (t.startsWith('⚠')) return 'warn';
  if (t.startsWith('===') || /^===.+===$/.test(t) || t.includes('=== ')) return 'header';
  if (t.startsWith('✓')) return 'ok';
  if (/→/.test(t)) return 'arrow';
  // "Label: value" style
  if (/^[A-Za-z_][\w\s]*:\s/.test(t) && !/loss|epoch/i.test(t)) return 'label';
  // Prefer number only when clearly numeric teaching output
  if (
    (/loss|softmax|prob|count|epoch|vocab|size|P\(/i.test(t) && /[\d.]+/.test(t)) ||
    /^\s*\[/.test(t) ||
    /^\d+(\.\d+)?%?\s*$/.test(t)
  ) {
    return 'number';
  }
  return 'default';
}

const kindClass: Record<LineKind, string> = {
  header: 'font-bold text-indigo-300',
  error: 'font-medium text-red-400',
  warn: 'text-amber-400',
  arrow: 'text-violet-300',
  label: 'text-sky-300',
  number: 'text-emerald-400',
  ok: 'text-emerald-300',
  default: 'text-slate-300',
};

export function ColorConsole({
  lines,
  emptyLabel = '(no output)',
  className,
}: {
  lines: string[];
  emptyLabel?: string;
  className?: string;
}) {
  if (lines.length === 0) {
    return (
      <div className={cn('px-3 py-3 font-mono text-xs text-slate-500', className)}>
        {emptyLabel}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'max-h-[280px] min-h-[120px] overflow-x-auto p-3 font-mono text-xs leading-relaxed',
        className,
      )}
    >
      {lines.map((line, i) => (
        <div key={i} className={cn('whitespace-pre-wrap break-words', kindClass[classifyLine(line)])}>
          {line || '\u00A0'}
        </div>
      ))}
    </div>
  );
}
