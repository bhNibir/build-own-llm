'use client';

import { useIsDarkMode } from '@/lib/use-is-dark-mode';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ColorConsole } from './ColorConsole';
import { CodeEditor } from './CodeEditor';
import { LiveVizPanel } from './LiveVizPanel';
import { RunnerToolbar } from './RunnerToolbar';
import { ensureEsbuild, parseVizFromLogs, runTypeScript, type ParsedViz } from './runtime';
import { getPlaygroundCode } from './playgrounds';

export type PlaygroundProps = {
  id: string;
  title?: string;
  editable?: boolean;
  height?: number;
  showConsole?: boolean;
  viz?: 'loss' | 'softmax' | 'attention';
};

export function Playground({
  id,
  title,
  editable = true,
  height = 480,
  showConsole = true,
  viz,
}: PlaygroundProps) {
  const initialCode = getPlaygroundCode(id);
  const isDark = useIsDarkMode();
  const [code, setCode] = useState(initialCode ?? '');
  const [output, setOutput] = useState<string[]>([]);
  const [parsedViz, setParsedViz] = useState<ParsedViz | null>(null);
  const [running, setRunning] = useState(false);
  const [ready, setReady] = useState(false);
  const initialCodeRef = useRef(initialCode ?? '');

  const runCode = useCallback(
    async (source: string) => {
      setRunning(true);
      setOutput([]);
      setParsedViz(null);
      try {
        const logs = await runTypeScript(source);
        setOutput(logs);
        if (viz) setParsedViz(parseVizFromLogs(logs, viz));
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setOutput([`Error: ${message}`]);
      } finally {
        setRunning(false);
      }
    },
    [viz],
  );

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
          setOutput([`Error: ${err instanceof Error ? err.message : String(err)}`]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, initialCode, runCode]);

  if (!initialCode) {
    return (
      <div className="my-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
        Playground not found: <code>{id}</code>
      </div>
    );
  }

  return (
    <div className="my-6 not-prose">
      {title && <p className="mb-2 text-sm font-medium text-fd-foreground">{title}</p>}
      <p className="mb-3 text-xs text-fd-muted-foreground">
        কোড edit করে <strong>Run</strong> চাপো — colorful output নিচে দেখবে
      </p>
      <div className="overflow-hidden rounded-xl border-2 border-indigo-200/60 shadow-sm dark:border-indigo-800/50">
        <RunnerToolbar
          ready={ready}
          running={running}
          onRun={() => void runCode(code)}
          onReset={() => {
            setCode(initialCodeRef.current);
            void runCode(initialCodeRef.current);
          }}
          onCopy={async () => navigator.clipboard.writeText(code)}
        />
        <CodeEditor
          value={code}
          onChange={setCode}
          readOnly={!editable}
          height={height}
          isDark={isDark}
          onRun={() => void runCode(code)}
        />
        {showConsole && (
          <div className="border-t border-fd-border bg-[#0d1117]">
            <div className="border-b border-fd-border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-indigo-400">
              Console
            </div>
            <ColorConsole lines={output} emptyLabel={ready ? '(no output)' : ''} />
          </div>
        )}
        {viz && <LiveVizPanel viz={parsedViz} />}
      </div>
    </div>
  );
}
