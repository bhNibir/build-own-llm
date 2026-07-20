'use client';

import { cn } from '@/lib/cn';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { PlayAnimated } from '@/components/icons/play';
import { CopyAnimated } from '@/components/icons/copy';
import { ResetAnimated } from '@/components/icons/reset';

export function RunnerToolbar({
  onRun,
  onReset,
  onCopy,
  running,
  ready,
  copyLabel = 'Copy',
}: {
  onRun: () => void;
  onReset: () => void;
  onCopy: () => void;
  running: boolean;
  ready: boolean;
  copyLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-fd-border bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 px-3 py-2 dark:from-indigo-500/20 dark:to-emerald-500/20">
      <button
        type="button"
        onClick={onRun}
        disabled={!ready || running}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-semibold shadow-sm',
          'bg-indigo-600 text-white hover:bg-indigo-700',
          'disabled:cursor-not-allowed disabled:opacity-40',
        )}
      >
        <PlayAnimated />
        {running ? 'Running…' : 'Run'}
      </button>
      <button
        type="button"
        onClick={handleCopy}
        disabled={!ready}
        className="inline-flex items-center gap-1.5 rounded-md border border-fd-border bg-white px-3 py-1.5 text-sm font-medium hover:bg-fd-muted dark:bg-slate-800 disabled:opacity-40"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <CopyAnimated />}
        {copied ? 'Copied!' : copyLabel}
      </button>
      <button
        type="button"
        onClick={onReset}
        disabled={!ready || running}
        className="inline-flex items-center gap-1.5 rounded-md border border-fd-border px-3 py-1.5 text-sm font-medium text-fd-muted-foreground hover:bg-fd-accent disabled:opacity-40"
      >
        <ResetAnimated />
        Reset
      </button>
      {!ready && (
        <span className="ml-auto text-xs text-fd-muted-foreground">Loading compiler…</span>
      )}
    </div>
  );
}
