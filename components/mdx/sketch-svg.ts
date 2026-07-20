import {
  getSketchStyleForClass,
  sketchPalettes,
  strokeDasharray,
  type SketchFillStyle,
} from '../diagrams/sketch-styles';

/** SVG `<defs>` for hachure + cross-hatch patterns (injected into Mermaid SVG) */
export function buildSketchPatternDefs(): string {
  const patterns = Object.entries(sketchPalettes)
    .map(([name, p]) => {
      return `
    <pattern id="sketch-hachure-${name}" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
      <rect width="8" height="8" fill="${p.bg}"/>
      <line x1="0" y1="0" x2="0" y2="8" stroke="${p.hatch}" stroke-width="1.5" stroke-opacity="0.35"/>
    </pattern>
    <pattern id="sketch-cross-hatch-${name}" patternUnits="userSpaceOnUse" width="10" height="10">
      <rect width="10" height="10" fill="${p.bg}"/>
      <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="${p.hatch}" stroke-width="1" stroke-opacity="0.3"/>
      <path d="M-1,9 l2,2 M0,0 l10,10 M9,-1 l2,2" stroke="${p.hatch}" stroke-width="1" stroke-opacity="0.3"/>
    </pattern>`;
    })
    .join('');

  return `<defs>${patterns}</defs>`;
}

function patternUrl(fill: SketchFillStyle, palette: string): string | null {
  if (fill === 'solid') return null;
  const id = fill === 'hachure' ? `sketch-hachure-${palette}` : `sketch-cross-hatch-${palette}`;
  return `url(#${id})`;
}

/** Post-process rendered Mermaid SVG with Excalidraw fill + stroke styles */
export function enhanceMermaidSvg(svg: string): string {
  if (typeof DOMParser === 'undefined') return svg;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, 'image/svg+xml');
    const root = doc.documentElement;
    if (root.querySelector('parsererror')) return svg;

    // Inject pattern defs
    const defs = doc.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = buildSketchPatternDefs().replace(/^<defs>|<\/defs>$/g, '');
    root.insertBefore(defs, root.firstChild);

    // Style node shapes by class
    root.querySelectorAll('g.node').forEach((node) => {
      const className = node.getAttribute('class') ?? '';
      const style = getSketchStyleForClass(className);
      const palette = sketchPalettes[style.palette];
      const shape = node.querySelector('rect, polygon, path, ellipse');
      if (!shape) return;

      const fillUrl = patternUrl(style.fill, style.palette);
      if (fillUrl) {
        shape.setAttribute('fill', fillUrl);
      } else {
        shape.setAttribute('fill', palette.bg);
      }
      shape.setAttribute('stroke', palette.border);
      shape.setAttribute('stroke-width', '2');
      const dash = strokeDasharray(style.stroke);
      if (dash) shape.setAttribute('stroke-dasharray', dash);
      else shape.removeAttribute('stroke-dasharray');
    });

    // Edge paths — dashed sketch lines
    root.querySelectorAll('.edgePath path, .flowchart-link').forEach((path) => {
      path.setAttribute('stroke', '#495057');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('stroke-dasharray', '6 4');
      path.setAttribute('fill', 'none');
    });

    // Edge arrowheads solid
    root.querySelectorAll('.arrowheadPath').forEach((path) => {
      path.setAttribute('fill', '#495057');
      path.removeAttribute('stroke-dasharray');
    });

    return new XMLSerializer().serializeToString(root);
  } catch {
    return svg;
  }
}
