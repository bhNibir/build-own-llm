export function LlmPredict() {
  const words = ['i', 'like', '???'];
  return (
    <svg viewBox="0 0 400 160" className="h-auto w-full max-w-md" aria-hidden>
      <rect x="0" y="0" width="400" height="160" rx="12" fill="#EEF2FF" className="dark:fill-slate-800" />
      {words.map((w, i) => (
        <g key={w}>
          <rect
            x={40 + i * 110}
            y="50"
            width="90"
            height="44"
            rx="8"
            fill={w === '???' ? '#F59E0B' : i === 0 ? '#4F46E5' : '#10B981'}
          />
          <text
            x={85 + i * 110}
            y="77"
            textAnchor="middle"
            fill="white"
            fontSize="16"
            fontWeight="600"
          >
            {w}
          </text>
        </g>
      ))}
      <text x="200" y="130" textAnchor="middle" fill="#6366F1" fontSize="12" fontWeight="500">
        P(next | context) → predict next token
      </text>
    </svg>
  );
}
