const SANDBOX_PREAMBLE = `
const __fmt = (v) => typeof v === 'string' ? v : JSON.stringify(v);
const log = {
  step: (msg) => console.log('=== ' + msg + ' ==='),
  data: (label, val) => console.log(label + ': ' + __fmt(val)),
  ok: (msg) => console.log('✓ ' + msg),
};
`;

export function formatConsoleArgs(args: unknown[]): string {
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

let esbuildInit: Promise<void> | null = null;

export async function ensureEsbuild(): Promise<typeof import('esbuild-wasm')> {
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

export async function transpileTypeScript(code: string): Promise<string> {
  const esbuild = await ensureEsbuild();
  const result = await esbuild.transform(code, {
    loader: 'ts',
    target: 'es2020',
  });
  return result.code;
}

export function executeInSandbox(js: string): string[] {
  const logs: string[] = [];

  const sandboxConsole = {
    log: (...args: unknown[]) => logs.push(formatConsoleArgs(args)),
    info: (...args: unknown[]) => logs.push(formatConsoleArgs(args)),
    warn: (...args: unknown[]) => logs.push(`⚠ ${formatConsoleArgs(args)}`),
    error: (...args: unknown[]) => logs.push(`✖ ${formatConsoleArgs(args)}`),
    debug: (...args: unknown[]) => logs.push(formatConsoleArgs(args)),
  };

  // eslint-disable-next-line no-new-func
  const fn = new Function('console', `"use strict";\n${SANDBOX_PREAMBLE}\n${js}`);
  fn(sandboxConsole);

  return logs;
}

export async function runTypeScript(source: string): Promise<string[]> {
  const js = await transpileTypeScript(source);
  return executeInSandbox(js);
}

export type ParsedViz =
  | { type: 'loss'; data: number[] }
  | { type: 'softmax'; probs: number[]; labels?: string[] }
  | { type: 'attention'; tokens: string[]; weights: number[][] };

export function parseVizFromLogs(logs: string[], viz?: string): ParsedViz | null {
  if (!viz) return null;

  if (viz === 'loss') {
    const data: number[] = [];
    for (const line of logs) {
      const m = line.match(/loss[:\s]+([\d.]+)/i);
      if (m) data.push(parseFloat(m[1]));
    }
    return data.length > 0 ? { type: 'loss', data } : null;
  }

  if (viz === 'softmax') {
    const probs: number[] = [];
    for (const line of logs) {
      const m = line.match(/([\d.]+)\s*(?:\(|$|\s)/);
      if (m && line.toLowerCase().includes('softmax')) {
        probs.push(parseFloat(m[1]));
      }
      const arr = line.match(/\[([\d.,\s]+)\]/);
      if (arr && (line.includes('softmax') || line.includes('prob'))) {
        return {
          type: 'softmax',
          probs: arr[1].split(',').map((s) => parseFloat(s.trim())),
        };
      }
    }
    return probs.length > 0 ? { type: 'softmax', probs } : null;
  }

  if (viz === 'attention') {
    const tokens = ['i', 'like', 'apple'];
    const weights: number[][] = [];
    for (const line of logs) {
      const row = line.match(/\[([\d.,\s]+)\]/);
      if (row) {
        weights.push(row[1].split(',').map((s) => parseFloat(s.trim())));
      }
    }
    if (weights.length >= 2) return { type: 'attention', tokens, weights };
  }

  return null;
}
