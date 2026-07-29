'use client';

/** Hidden SVG defs — Excalidraw low-contrast fills + hatch in border hue (light tokens; CSS SketchBox covers dark) */
export function SketchPatternDefs() {
  return (
    <svg className="absolute h-0 w-0" aria-hidden>
      <defs>
        <pattern id="anim-hachure-blue" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="#E8EAF8" />
          <line x1="0" y1="0" x2="0" y2="8" stroke="#6366F1" strokeWidth="1.5" strokeOpacity="0.35" />
        </pattern>
        <pattern id="anim-cross-green" patternUnits="userSpaceOnUse" width="10" height="10">
          <rect width="10" height="10" fill="#E6F6EE" />
          <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="#10B981" strokeWidth="1" strokeOpacity="0.3" />
          <path d="M-1,9 l2,2 M0,0 l10,10 M9,-1 l2,2" stroke="#10B981" strokeWidth="1" strokeOpacity="0.3" />
        </pattern>
        <pattern id="anim-hachure-amber" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="#FEF3E0" />
          <line x1="0" y1="0" x2="0" y2="8" stroke="#F59E0B" strokeWidth="1.5" strokeOpacity="0.35" />
        </pattern>
      </defs>
    </svg>
  );
}
