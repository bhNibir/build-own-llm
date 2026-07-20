'use client';

/** Hidden SVG defs — include once per animated diagram if using SVG shapes */
export function SketchPatternDefs() {
  return (
    <svg className="absolute h-0 w-0" aria-hidden>
      <defs>
        <pattern id="anim-hachure-blue" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="#E7F5FF" />
          <line x1="0" y1="0" x2="0" y2="8" stroke="#1971C2" strokeWidth="1.5" strokeOpacity="0.35" />
        </pattern>
        <pattern id="anim-cross-green" patternUnits="userSpaceOnUse" width="10" height="10">
          <rect width="10" height="10" fill="#E6FCF5" />
          <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="#099268" strokeWidth="1" strokeOpacity="0.3" />
          <path d="M-1,9 l2,2 M0,0 l10,10 M9,-1 l2,2" stroke="#099268" strokeWidth="1" strokeOpacity="0.3" />
        </pattern>
        <pattern id="anim-hachure-amber" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="#FFF9DB" />
          <line x1="0" y1="0" x2="0" y2="8" stroke="#F08C00" strokeWidth="1.5" strokeOpacity="0.35" />
        </pattern>
      </defs>
    </svg>
  );
}
