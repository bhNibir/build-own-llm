export function MatrixGrid() {
  const colors = ['#4F46E5', '#6366F1', '#818CF8', '#10B981', '#34D399', '#6EE7B7'];
  return (
    <svg viewBox="0 0 200 200" className="h-auto w-48" aria-hidden>
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <rect
            key={`${r}-${c}`}
            x={20 + c * 55}
            y={20 + r * 55}
            width="48"
            height="48"
            rx="6"
            fill={colors[(r * 3 + c) % colors.length]}
            opacity={0.85}
          />
        )),
      )}
      <text x="100" y="195" textAnchor="middle" fill="#64748B" fontSize="11">
        3×3 Matrix
      </text>
    </svg>
  );
}
