export function BigramWindow() {
  return (
    <svg viewBox="0 0 360 100" className="h-auto w-full max-w-sm" aria-hidden>
      <rect x="20" y="25" width="70" height="50" rx="8" fill="#4F46E5" />
      <text x="55" y="57" textAnchor="middle" fill="white" fontSize="14" fontWeight="600">
        like
      </text>
      <text x="120" y="57" fill="#64748B" fontSize="20">→</text>
      <rect x="140" y="25" width="90" height="50" rx="8" fill="#10B981" stroke="#047857" strokeWidth="2" strokeDasharray="4" />
      <text x="185" y="57" textAnchor="middle" fill="white" fontSize="14" fontWeight="600">
        apple?
      </text>
      <text x="260" y="57" fill="#64748B" fontSize="12">context → next</text>
    </svg>
  );
}
