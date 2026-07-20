'use client';

export function MatrixViz({
  matrix,
  rowLabels,
  colLabels,
  title = 'Matrix',
}: {
  matrix: number[][];
  rowLabels?: string[];
  colLabels?: string[];
  title?: string;
}) {
  const flat = matrix.flat();
  const max = Math.max(...flat.map(Math.abs), 1);

  return (
    <div className="my-6 not-prose overflow-x-auto rounded-xl border border-fd-border">
      <div className="border-b border-fd-border bg-fd-muted/40 px-4 py-2 text-sm font-medium">
        🔢 {title}
      </div>
      <table className="mx-auto text-xs">
        <thead>
          <tr>
            <th />
            {colLabels?.map((l) => (
              <th key={l} className="p-1 font-medium text-fd-muted-foreground">
                {l}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, r) => (
            <tr key={r}>
              {rowLabels && (
                <td className="p-1 font-medium text-fd-muted-foreground">{rowLabels[r]}</td>
              )}
              {row.map((v, c) => (
                <td key={c} className="p-1">
                  <div
                    className="flex h-9 w-12 items-center justify-center rounded font-mono"
                    style={{
                      backgroundColor: `rgba(79, 70, 229, ${Math.abs(v) / max * 0.85 + 0.1})`,
                      color: Math.abs(v) / max > 0.5 ? '#fff' : 'inherit',
                    }}
                  >
                    {Number.isInteger(v) ? v : v.toFixed(1)}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
