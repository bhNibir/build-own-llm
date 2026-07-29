'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

/** Collapsible math worked example — closed by default */
export function MathPractical({
  title = 'গণনা দেখো (ধাপে ধাপে)',
  children,
  defaultOpen = false,
}: {
  title?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="my-4 overflow-hidden rounded-xl border-2 border-emerald-200/80 dark:border-emerald-800/50">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 bg-emerald-50/80 px-4 py-3 text-left text-sm font-semibold text-emerald-900 hover:bg-emerald-100/80 dark:bg-emerald-950/40 dark:text-emerald-100 dark:hover:bg-emerald-950/70"
        aria-expanded={open}
      >
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 transition-transform', open && 'rotate-180')}
        />
        {title}
        <span className="ml-auto text-[11px] font-normal text-emerald-700/80 dark:text-emerald-300/70">
          {open ? 'লুকাও' : 'খোলো'}
        </span>
      </button>
      {open && (
        <div className="space-y-2 bg-white px-4 py-3 text-sm leading-relaxed dark:bg-slate-900">
          {children}
        </div>
      )}
    </div>
  );
}
