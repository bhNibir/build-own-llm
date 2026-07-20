'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ColorConsole } from './ColorConsole';
import { CodeEditor } from './CodeEditor';
import { RunnerToolbar } from './RunnerToolbar';
import { ensureEsbuild, runTypeScript } from './runtime';
import { getPlaygroundCode } from './playgrounds';

export type CodeRunProps = {
  /** Inline TS source */
  children?: string;
  /** Pull code from playground registry */
  id?: string;
  title?: string;
  height?: number;
  autoRun?: boolean;
  editable?: boolean;
};

function useIsDarkMode(): boolean {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsDark(root.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

export function CodeRun({
  children,
  id,
  title,
  height = 200,
  autoRun = true,
  editable = true,
}: CodeRunProps) {
  const registryCode = id ? getPlaygroundCode(id) : undefined;
  const initial = (children ?? registryCode ?? '').trim();
  const isDark = useIsDarkMode();
  const [code, setCode] = useState(initial);
  const [output, setOutput] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [ready, setReady] = useState(false);
  const initialRef = useRef(initial);

  const runCode = useCallback(async (source: string) => {
    setRunning(true);
    setOutput([]);
    try {
      const logs = await runTypeScript(source);
      setOutput(logs);
    } catch (err) {
      setOutput([`Error: ${err instanceof Error ? err.message : String(err)}`]);
    } finally {
      setRunning(false);
    }
  }, []);

  useEffect(() => {
    if (!initial) return;
    initialRef.current = initial;
    setCode(initial);
    let cancelled = false;
    (async () => {
      await ensureEsbuild();
      if (cancelled) return;
      setReady(true);
      if (autoRun) await runCode(initial);
    })();
    return () => {
      cancelled = true;
    };
  }, [initial, autoRun, runCode]);

  if (!initial) {
    return (
      <div className="my-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
        CodeRun: no code provided
      </div>
    );
  }

  return (
    <div className="my-4 not-prose">
      {title && <p className="mb-2 text-sm font-medium">{title}</p>}
      <div className="overflow-hidden rounded-xl border border-indigo-200/60 dark:border-indigo-800/50">
        <RunnerToolbar
          ready={ready}
          running={running}
          onRun={() => void runCode(code)}
          onReset={() => {
            setCode(initialRef.current);
            void runCode(initialRef.current);
          }}
          onCopy={async () => navigator.clipboard.writeText(code)}
        />
        <CodeEditor value={code} onChange={setCode} readOnly={!editable} height={height} isDark={isDark} />
        <div className="border-t border-fd-border bg-[#0d1117]">
          <ColorConsole lines={output} emptyLabel={ready ? '(no output)' : ''} />
        </div>
      </div>
    </div>
  );
}
