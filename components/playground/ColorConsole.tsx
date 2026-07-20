'use client';

import { cn } from '@/lib/cn';

type LineKind = 'header' | 'error' | 'warn' | 'arrow' | 'number' | 'ok' | 'default';

function classifyLine(line: string): LineKind {
  if (line.startsWith('Error:') || line.startsWith('✖')) return 'error';
  if (line.startsWith('⚠')) return 'warn';
  if (line.startsWith('===') || line.includes('===')) return 'header';
  if (line.startsWith('✓')) return 'ok';
  if (/→/.test(line)) return 'arrow';
  if (/[\d.]+/.test(line) && (/loss|softmax|prob|count|epoch|\[|%|P\(/i.test(line) || /^\d/.test(line.trim()))) {
    return 'number';
  }
  return 'default';
}

const kindClass: Record<LineKind, string> = {
  header: 'font-bold text-indigo-400',
  error: 'text-red-400',
  warn: 'text-amber-400',
  arrow: 'text-violet-400',
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
    <div className={cn('max-h-[280px] min-h-[120px] overflow-x-auto p-3 font-mono text-xs leading-relaxed', className)}>
      {lines.map((line, i) => (
        <div key={i} className={cn('whitespace-pre-wrap break-words', kindClass[classifyLine(line)])}>
          {line}
        </div>
      ))}
    </div>
  );
}
