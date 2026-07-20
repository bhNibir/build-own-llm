'use client';

import { cn } from '@/lib/cn';
import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight, Brain } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  sketchFillClass,
  sketchStrokeClass,
  type SketchFillStyle,
  type SketchPalette,
  type SketchStrokeStyle,
} from './sketch-styles';

export function ConceptFrame({
  caption,
  children,
  hint,
}: {
  caption?: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <figure className="my-8 not-prose">
      <div
        className={cn(
          'min-h-[220px] overflow-hidden rounded-2xl border-2 border-indigo-200/80',
          'bg-white shadow-sm dark:border-indigo-800/50 dark:bg-slate-900',
          'border-l-4 border-l-indigo-500 dark:border-l-indigo-400',
        )}
      >
        <div className="flex min-h-[200px] flex-col justify-center p-4 sm:p-6">{children}</div>
        {hint && (
          <div className="border-t border-fd-border bg-indigo-50/50 px-4 py-2 text-center text-xs text-fd-muted-foreground dark:bg-indigo-950/30">
            {hint}
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-fd-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  );
}

export function StepChip({
  label,
  active,
  done,
  icon: Icon,
}: {
  label: string;
  active?: boolean;
  done?: boolean;
  icon?: LucideIcon;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border-2 px-3 py-1.5 font-mono text-sm font-medium transition-colors',
        active && 'border-indigo-500 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-200',
        done && !active && 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200',
        !active && !done && 'border-fd-border bg-fd-muted/40 text-fd-foreground',
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />}
      {label}
    </span>
  );
}

export function FlowConnector({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center px-1 text-indigo-400', className)}>
      <ArrowRight className="h-4 w-4" />
    </div>
  );
}

export function ModelBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-violet-400 bg-violet-50 px-3 py-1 text-sm font-medium text-violet-800 dark:border-violet-600 dark:bg-violet-950/40 dark:text-violet-200">
      <Brain className="h-3.5 w-3.5" />
      Model
    </span>
  );
}

export function StepDots({
  total,
  current,
  onSelect,
}: {
  total: number;
  current: number;
  onSelect?: (i: number) => void;
}) {
  return (
    <div className="flex justify-center gap-2 pb-1">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect?.(i)}
          className={cn(
            'h-2.5 w-2.5 rounded-full transition-colors',
            i === current ? 'bg-indigo-500' : 'bg-fd-border hover:bg-indigo-300',
          )}
          aria-label={`Step ${i + 1}`}
        />
      ))}
    </div>
  );
}

export function DataLabel({ bn, en }: { bn: string; en?: string }) {
  return (
    <p className="text-center text-xs text-fd-muted-foreground">
      {bn}
      {en && <span className="ml-1 font-mono text-indigo-600 dark:text-indigo-400">({en})</span>}
    </p>
  );
}

export function ActiveRing({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <motion.span
      className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-indigo-400/80 ring-offset-1 ring-offset-transparent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  );
}

export function SketchBox({
  children,
  fillStyle = 'solid',
  strokeStyle = 'solid',
  palette = 'blue',
  active,
  className,
}: {
  children: ReactNode;
  fillStyle?: SketchFillStyle;
  strokeStyle?: SketchStrokeStyle;
  palette?: keyof typeof import('./sketch-styles').sketchPalettes;
  active?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative rounded-lg border-2 px-3 py-2 text-sm',
        sketchFillClass(fillStyle === 'solid' ? 'solid' : fillStyle, palette),
        sketchStrokeClass(strokeStyle),
        active && 'ring-2 ring-indigo-400/50 ring-offset-1',
        className,
      )}
    >
      {children}
    </div>
  );
}

export type { SketchFillStyle, SketchStrokeStyle, SketchPalette };

export function MonoBox({
  children,
  active,
  className,
}: {
  children: ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative rounded-lg border-2 px-3 py-2 font-mono text-sm',
        active
          ? 'border-indigo-500 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-100'
          : 'border-fd-border bg-fd-muted/30 text-fd-foreground',
        className,
      )}
    >
      <ActiveRing active={!!active} />
      {children}
    </div>
  );
}
