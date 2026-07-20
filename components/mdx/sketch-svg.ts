import {
  getSketchPalettes,
  getSketchStyleForClass,
  strokeDasharray,
  type SketchFillStyle,
} from '../diagrams/sketch-styles';

/** SVG `<defs>` for optional hachure patterns */
export function buildSketchPatternDefs(isDark = false): string {
  const palettes = getSketchPalettes(isDark);
  const patterns = Object.entries(palettes)
    .map(([name, p]) => {
      return `
    <pattern id="sketch-hachure-${name}" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
      <rect width="8" height="8" fill="${p.bg}"/>
      <line x1="0" y1="0" x2="0" y2="8" stroke="${p.hatch}" stroke-width="1.5" stroke-opacity="0.3"/>
    </pattern>
    <pattern id="sketch-cross-hatch-${name}" patternUnits="userSpaceOnUse" width="10" height="10">
      <rect width="10" height="10" fill="${p.bg}"/>
      <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="${p.hatch}" stroke-width="1" stroke-opacity="0.25"/>
      <path d="M-1,9 l2,2 M0,0 l10,10 M9,-1 l2,2" stroke="${p.hatch}" stroke-width="1" stroke-opacity="0.25"/>
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

/** Post-process Mermaid SVG — solid fills by default, theme-aware edges + fills */
export function enhanceMermaidSvg(svg: string, isDark = false): string {
  if (typeof DOMParser === 'undefined') return svg;

  const edgeColor = isDark ? '#A5B4FC' : '#4F46E5';
  const palettes = getSketchPalettes(isDark);

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, 'image/svg+xml');
    const root = doc.documentElement;
    if (root.querySelector('parsererror')) return svg;

    const defs = doc.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = buildSketchPatternDefs(isDark).replace(/^<defs>|<\/defs>$/g, '');
    root.insertBefore(defs, root.firstChild);

    root.querySelectorAll('g.node').forEach((node) => {
      const className = node.getAttribute('class') ?? '';
      const style = getSketchStyleForClass(className);
      const palette = palettes[style.palette] ?? palettes.blue;
      const shape = node.querySelector('rect, polygon, path, ellipse');
      if (!shape) return;

      const fill = patternUrl(style.fill, style.palette) ?? palette.bg;
      shape.setAttribute('fill', fill);
      shape.setAttribute('stroke', palette.border);
      shape.setAttribute('stroke-width', '2');
      const dash = strokeDasharray(style.stroke);
      if (dash) shape.setAttribute('stroke-dasharray', dash);
      else shape.removeAttribute('stroke-dasharray');

      // Ensure label text stays readable
      node.querySelectorAll('span, foreignObject, .nodeLabel, p').forEach((el) => {
        if (el instanceof HTMLElement || el instanceof SVGElement) {
          el.style.color = palette.text;
        }
      });
    });

    root.querySelectorAll('.edgePath path, .flowchart-link').forEach((path) => {
      path.setAttribute('stroke', edgeColor);
      path.setAttribute('stroke-width', '2');
      path.removeAttribute('stroke-dasharray');
      path.setAttribute('fill', 'none');
    });

    root.querySelectorAll('.arrowheadPath').forEach((path) => {
      path.setAttribute('fill', edgeColor);
      path.removeAttribute('stroke-dasharray');
    });

    return new XMLSerializer().serializeToString(root);
  } catch {
    return svg;
  }
}
