export function TransformerBlock() {
  const blocks = [
    { label: 'LayerNorm', color: '#6366F1' },
    { label: 'Attention', color: '#10B981' },
    { label: '+ Residual', color: '#F59E0B' },
    { label: 'LayerNorm', color: '#6366F1' },
    { label: 'FFN', color: '#EC4899' },
    { label: '+ Residual', color: '#F59E0B' },
  ];

  return (
    <svg viewBox="0 0 200 320" className="h-auto w-40" aria-hidden>
      <rect x="30" y="10" width="140" height="300" rx="8" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6" />
      {blocks.map((b, i) => (
        <g key={b.label + i}>
          <rect x="45" y={25 + i * 48} width="110" height="36" rx="6" fill={b.color} />
          <text x="100" y={48 + i * 48} textAnchor="middle" fill="white" fontSize="10" fontWeight="600">
            {b.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
