export function AttentionMap() {
  const weights = [
    [0.7, 0.2, 0.1],
    [0.1, 0.8, 0.1],
    [0.2, 0.3, 0.5],
  ];
  const words = ['i', 'like', 'apple'];

  return (
    <svg viewBox="0 0 280 220" className="h-auto w-full max-w-xs" aria-hidden>
      <text x="140" y="18" textAnchor="middle" fill="#64748B" fontSize="11" fontWeight="600">
        Attention Weights
      </text>
      {words.map((w, c) => (
        <text key={`h-${w}`} x={80 + c * 55} y="38" textAnchor="middle" fill="#4F46E5" fontSize="11">
          {w}
        </text>
      ))}
      {weights.map((row, r) => (
        <g key={r}>
          <text x="30" y={58 + r * 50} textAnchor="end" fill="#10B981" fontSize="11">
            {words[r]}
          </text>
          {row.map((w, c) => (
            <rect
              key={`${r}-${c}`}
              x={55 + c * 55}
              y={40 + r * 50}
              width="48"
              height="40"
              rx="4"
              fill={`rgba(79, 70, 229, ${w})`}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
