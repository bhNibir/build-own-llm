'use client';

import { cn } from '@/lib/cn';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getPlaygroundCode } from './playgrounds';

export type PlaygroundProps = {
  id: string;
  title?: string;
  editable?: boolean;
  height?: number;
  showConsole?: boolean;
};

type PlaygroundPropsInternal = PlaygroundProps;

function formatConsoleArgs(args: unknown[]): string {
  return args
    .map((arg) => {
      if (typeof arg === 'string') return arg;
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    })
    .join(' ');
}

function useIsDarkMode(): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    const update = () => {
      setIsDark(root.classList.contains('dark'));
    };

    update();

    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

let esbuildInit: Promise<void> | null = null;

async function ensureEsbuild(): Promise<typeof import('esbuild-wasm')> {
  const esbuild = await import('esbuild-wasm');

  if (!esbuildInit) {
    esbuildInit = esbuild.initialize({
      wasmURL: '/esbuild.wasm',
      worker: true,
    });
  }

  await esbuildInit;
  return esbuild;
}

async function transpileTypeScript(code: string): Promise<string> {
  const esbuild = await ensureEsbuild();
  const result = await esbuild.transform(code, {
    loader: 'ts',
    target: 'es2020',
  });
  return result.code;
}

function executeInSandbox(js: string): string[] {
  const logs: string[] = [];

  const sandboxConsole = {
    log: (...args: unknown[]) => logs.push(formatConsoleArgs(args)),
    info: (...args: unknown[]) => logs.push(formatConsoleArgs(args)),
    warn: (...args: unknown[]) => logs.push(`⚠ ${formatConsoleArgs(args)}`),
    error: (...args: unknown[]) => logs.push(`✖ ${formatConsoleArgs(args)}`),
    debug: (...args: unknown[]) => logs.push(formatConsoleArgs(args)),
  };

  // eslint-disable-next-line no-new-func
  const fn = new Function('console', `"use strict";\n${js}`);
  fn(sandboxConsole);

  return logs;
}

export function Playground({
  id,
  title,
  editable = true,
  height = 360,
  showConsole = true,
}: PlaygroundPropsInternal) {
  const initialCode = getPlaygroundCode(id);
  const isDark = useIsDarkMode();

  const [code, setCode] = useState(initialCode ?? '');
  const [output, setOutput] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [ready, setReady] = useState(false);

  const initialCodeRef = useRef(initialCode ?? '');

  const runCode = useCallback(async (source: string) => {
    setRunning(true);
    setOutput([]);

    try {
      const js = await transpileTypeScript(source);
      const logs = executeInSandbox(js);
      setOutput(logs);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setOutput([`Error: ${message}`]);
    } finally {
      setRunning(false);
    }
  }, []);

  useEffect(() => {
    if (!initialCode) return;

    initialCodeRef.current = initialCode;
    setCode(initialCode);

    let cancelled = false;

    (async () => {
      try {
        await ensureEsbuild();
        if (cancelled) return;
        setReady(true);
        await runCode(initialCode);
      } catch (err) {
        if (!cancelled) {
          setOutput([
            `Error: ${err instanceof Error ? err.message : String(err)}`,
          ]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, initialCode, runCode]);

  const handleRun = () => {
    void runCode(code);
  };

  const handleReset = () => {
    setCode(initialCodeRef.current);
    void runCode(initialCodeRef.current);
  };

  if (!initialCode) {
    return (
      <div className="my-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
        Playground not found: <code>{id}</code>
      </div>
    );
  }

  return (
    <div className="my-6 not-prose">
      {title && (
        <p className="mb-2 text-sm font-medium text-fd-foreground">{title}</p>
      )}
      <p className="mb-3 text-xs text-fd-muted-foreground">
        কোড edit করে <strong>Run</strong> চাপো — output নিচে দেখবে
      </p>

      <div className="overflow-hidden rounded-lg border border-fd-border">
        <div className="flex items-center gap-2 border-b border-fd-border bg-fd-muted/50 px-3 py-2">
          <button
            type="button"
            onClick={handleRun}
            disabled={!ready || running}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-semibold transition-opacity',
              'bg-fd-primary text-fd-primary-foreground hover:opacity-90',
              'disabled:cursor-not-allowed disabled:opacity-40',
            )}
          >
            <span aria-hidden>▶</span>
            {running ? 'Running…' : 'Run'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={!ready || running}
            className="rounded-md border border-fd-border px-3 py-1.5 text-sm font-medium text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors disabled:opacity-40"
          >
            Reset
          </button>
          {!ready && (
            <span className="ml-auto text-xs text-fd-muted-foreground">
              Loading TypeScript compiler…
            </span>
          )}
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          readOnly={!editable}
          spellCheck={false}
          className={cn(
            'w-full resize-y border-0 p-4 font-mono text-[13px] leading-relaxed outline-none',
            'bg-fd-background text-fd-foreground',
            'focus:ring-2 focus:ring-fd-ring focus:ring-inset',
            !editable && 'cursor-default opacity-80',
          )}
          style={{ height, minHeight: 200 }}
        />

        {showConsole && (
          <div
            className={cn(
              'border-t border-fd-border font-mono text-xs leading-relaxed',
              isDark ? 'bg-[#1e1e1e] text-[#d4d4d4]' : 'bg-[#fafafa] text-[#333]',
            )}
          >
            <div className="border-b border-fd-border px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-fd-muted-foreground">
              Console
            </div>
            <pre className="max-h-[280px] min-h-[120px] overflow-x-auto whitespace-pre-wrap p-3">
              {output.length > 0 ? output.join('\n') : ready ? '(no output)' : ''}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
