export function TokenPipeline() {
  return (
    <svg viewBox="0 0 480 120" className="h-auto w-full max-w-lg" aria-hidden>
      <defs>
        <linearGradient id="tp1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="tp2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <rect x="10" y="35" width="100" height="50" rx="10" fill="url(#tp1)" />
      <text x="60" y="67" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">
        📝 Text
      </text>
      <path d="M115 60 L145 60" stroke="#6366F1" strokeWidth="2" markerEnd="url(#arrow)" />
      <rect x="150" y="35" width="100" height="50" rx="10" fill="url(#tp2)" />
      <text x="200" y="67" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">
        🔤 Tokens
      </text>
      <path d="M255 60 L285 60" stroke="#6366F1" strokeWidth="2" />
      <rect x="290" y="35" width="80" height="50" rx="10" fill="#F59E0B" />
      <text x="330" y="67" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">
        🔢 IDs
      </text>
      <path d="M375 60 L405 60" stroke="#6366F1" strokeWidth="2" />
      <rect x="410" y="35" width="60" height="50" rx="10" fill="#EC4899" />
      <text x="440" y="67" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">
        🎯
      </text>
    </svg>
  );
}
