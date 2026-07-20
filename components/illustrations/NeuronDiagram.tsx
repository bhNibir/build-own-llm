export function NeuronDiagram() {
  return (
    <svg viewBox="0 0 320 140" className="h-auto w-full max-w-sm" aria-hidden>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle cx="40" cy={30 + i * 40} r="14" fill="#4F46E5" />
          <line x1="54" y1={30 + i * 40} x2="130" y2="70" stroke="#94A3B8" strokeWidth="1.5" />
        </g>
      ))}
      <circle cx="150" cy="70" r="28" fill="#10B981" />
      <text x="150" y="75" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">
        σ
      </text>
      <line x1="178" y1="70" x2="240" y2="70" stroke="#94A3B8" strokeWidth="2" />
      <circle cx="270" cy="70" r="16" fill="#F59E0B" />
      <text x="270" y="75" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">
        out
      </text>
    </svg>
  );
}
