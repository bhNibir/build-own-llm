'use client';

import { cn } from '@/lib/cn';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { EditorState, type Extension } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import { Maximize2, Minimize2, WrapText } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  height?: number;
  isDark?: boolean;
  onRun?: () => void;
  className?: string;
};

const lightTheme = EditorView.theme({
  '&': { backgroundColor: '#ffffff', color: '#1f2328' },
  '.cm-content': {
    caretColor: '#4f46e5',
    fontFamily: 'var(--font-mono), ui-monospace, monospace',
    fontSize: '13px',
  },
  '.cm-gutters': { backgroundColor: '#f6f8fa', color: '#656d76', border: 'none' },
  '.cm-activeLineGutter': { backgroundColor: '#eef2ff' },
  '.cm-activeLine': { backgroundColor: '#eef2ff55' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
    backgroundColor: '#c7d2fe88',
  },
});

export function CodeEditor({
  value,
  onChange,
  readOnly = false,
  height = 480,
  isDark = false,
  onRun,
  className,
}: CodeEditorProps) {
  const [wrap, setWrap] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [editorHeight, setEditorHeight] = useState(height);

  useEffect(() => {
    setEditorHeight(Math.min(Math.max(height, 160), 720));
  }, [height]);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expanded]);

  const extensions: Extension[] = useMemo(() => {
    const list: Extension[] = [
      javascript({ typescript: true }),
      lineNumbers(),
      history(),
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
        {
          key: 'Mod-Enter',
          run: () => {
            onRun?.();
            return true;
          },
        },
      ]),
      EditorState.tabSize.of(2),
    ];
    if (wrap) list.push(EditorView.lineWrapping);
    return list;
  }, [wrap, onRun]);

  const themes = useMemo(() => (isDark ? [oneDark] : [lightTheme]), [isDark]);

  const onHeightDrag = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startY = e.clientY;
      const startH = editorHeight;
      const onMove = (ev: MouseEvent) => {
        setEditorHeight(Math.min(720, Math.max(160, startH + (ev.clientY - startY))));
      };
      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },
    [editorHeight],
  );

  const shell = (
    <div
      className={cn(
        'flex flex-col',
        expanded &&
          'fixed inset-4 z-50 rounded-xl border-2 border-indigo-400 bg-white shadow-2xl dark:bg-slate-950',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-fd-border bg-fd-muted/30 px-2 py-1">
        <button
          type="button"
          onClick={() => setWrap((w) => !w)}
          className={cn(
            'inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium',
            wrap
              ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200'
              : 'text-fd-muted-foreground hover:bg-fd-muted',
          )}
          title="Toggle word wrap"
        >
          <WrapText className="h-3.5 w-3.5" />
          Wrap
        </button>
        <button
          type="button"
          onClick={() => setExpanded((x) => !x)}
          className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium text-fd-muted-foreground hover:bg-fd-muted"
          title={expanded ? 'Exit fullscreen' : 'Expand editor'}
        >
          {expanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          {expanded ? 'Exit' : 'Expand'}
        </button>
        <span className="ml-auto text-[10px] text-fd-muted-foreground">Ctrl/⌘+Enter = Run</span>
      </div>
      <CodeMirror
        value={value}
        height={expanded ? 'calc(100vh - 8rem)' : `${editorHeight}px`}
        theme={themes}
        extensions={extensions}
        editable={!readOnly}
        basicSetup={{
          lineNumbers: false,
          foldGutter: true,
          highlightActiveLine: true,
          bracketMatching: true,
          autocompletion: false,
          indentOnInput: true,
        }}
        onChange={onChange}
        className="text-[13px] [&_.cm-editor]:outline-none [&_.cm-scroller]:overflow-auto"
      />
      {!expanded && (
        <div
          role="separator"
          aria-orientation="horizontal"
          onMouseDown={onHeightDrag}
          className="flex h-3 cursor-ns-resize items-center justify-center border-t border-fd-border bg-fd-muted/20 hover:bg-indigo-100 dark:hover:bg-indigo-950/40"
          title="Drag to resize"
        >
          <div className="h-1 w-10 rounded-full bg-fd-border" />
        </div>
      )}
    </div>
  );

  return (
    <>
      {expanded && (
        <button
          type="button"
          aria-label="Close fullscreen"
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setExpanded(false)}
        />
      )}
      {shell}
    </>
  );
}
