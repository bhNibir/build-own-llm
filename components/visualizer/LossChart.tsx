'use client';

export function LossChart({
  data,
  title = 'Training Loss',
}: {
  data: number[];
  title?: string;
}) {
  if (data.length === 0) {
    return (
      <div className="my-4 rounded-lg border border-fd-border bg-fd-muted/30 p-4 text-center text-sm text-fd-muted-foreground">
        No loss data yet — run training playground
      </div>
    );
  }

  const w = 400;
  const h = 160;
  const pad = 24;
  const max = Math.max(...data, 0.001);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = pad + (i / Math.max(data.length - 1, 1)) * (w - pad * 2);
      const y = pad + (1 - (v - min) / range) * (h - pad * 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="my-6 not-prose overflow-hidden rounded-xl border border-fd-border">
      <div className="border-b border-fd-border bg-fd-muted/40 px-4 py-2 text-sm font-medium">
        📉 {title}
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full bg-fd-background">
        <polyline
          fill="none"
          stroke="#10B981"
          strokeWidth="2"
          points={points}
        />
        <text x={pad} y={h - 6} fill="#64748B" fontSize="10">
          epoch
        </text>
        <text x={8} y={pad} fill="#64748B" fontSize="10">
          loss
        </text>
      </svg>
      <p className="border-t border-fd-border px-4 py-2 text-xs text-fd-muted-foreground">
        Final loss: <strong>{data[data.length - 1]?.toFixed(4)}</strong>
      </p>
    </div>
  );
}
