'use client';

export function AttentionHeatmap({
  tokens,
  weights,
  title = 'Attention Heatmap',
}: {
  tokens: string[];
  weights: number[][];
  title?: string;
}) {
  const n = tokens.length;

  return (
    <div className="my-6 not-prose overflow-x-auto rounded-xl border border-fd-border">
      <div className="border-b border-fd-border bg-fd-muted/40 px-4 py-2 text-sm font-medium">
        🔥 {title}
      </div>
      <table className="w-full min-w-[240px] text-xs">
        <thead>
          <tr>
            <th className="p-2" />
            {tokens.map((t) => (
              <th key={t} className="p-2 font-medium text-fd-primary">
                {t}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: n }, (_, r) => (
            <tr key={r}>
              <td className="p-2 font-medium text-fd-primary">{tokens[r]}</td>
              {Array.from({ length: n }, (_, c) => {
                const w = weights[r]?.[c] ?? 0;
                return (
                  <td key={c} className="p-1">
                    <div
                      className="flex h-10 items-center justify-center rounded font-mono text-white"
                      style={{ backgroundColor: `rgba(79, 70, 229, ${Math.max(w, 0.08)})` }}
                      title={w.toFixed(3)}
                    >
                      {w.toFixed(2)}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
