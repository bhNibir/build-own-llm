import {
  getSketchPalettes,
  getSketchStyleForClass,
  mermaidSketchStyles,
  strokeDasharray,
  type SketchFillStyle,
} from '../diagrams/sketch-styles';

/** Stronger hachure / cross-hatch so process & result nodes pop */
export function buildSketchPatternDefs(isDark = false): string {
  const palettes = getSketchPalettes(isDark);
  const patterns = Object.entries(palettes)
    .map(([name, p]) => {
      return `
    <pattern id="sketch-hachure-${name}" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
      <rect width="7" height="7" fill="${p.bg}"/>
      <line x1="0" y1="0" x2="0" y2="7" stroke="${p.hatch}" stroke-width="2" stroke-opacity="0.55"/>
    </pattern>
    <pattern id="sketch-cross-hatch-${name}" patternUnits="userSpaceOnUse" width="9" height="9">
      <rect width="9" height="9" fill="${p.bg}"/>
      <path d="M-1,1 l2,-2 M0,9 l9,-9 M8,10 l2,-2" stroke="${p.hatch}" stroke-width="1.6" stroke-opacity="0.45"/>
      <path d="M-1,8 l2,2 M0,0 l9,9 M8,-1 l2,2" stroke="${p.hatch}" stroke-width="1.6" stroke-opacity="0.45"/>
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

function parseHex(color: string): { r: number; g: number; b: number } | null {
  const m = color.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

/** Pick black or white text from fill luminance */
export function contrastText(fill: string): string {
  const rgb = parseHex(fill);
  if (!rgb) return '#1E293B';
  const lum = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return lum > 0.55 ? '#1E293B' : '#F8FAFC';
}

function forceLabelColor(root: Element, color: string) {
  root.querySelectorAll('text, tspan').forEach((el) => {
    el.setAttribute('fill', color);
    el.removeAttribute('stroke');
    const s = el as Element & { style?: CSSStyleDeclaration };
    if (s.style) {
      s.style.fill = color;
      s.style.color = color;
    }
  });

  root.querySelectorAll('span, p, div, a, label, .nodeLabel, .edgeLabel, .label').forEach((el) => {
    const s = el as Element & { style?: CSSStyleDeclaration };
    if (s.style?.setProperty) {
      s.style.setProperty('color', color, 'important');
      s.style.setProperty('-webkit-text-fill-color', color, 'important');
    }
    const attr = el.getAttribute('style') ?? '';
    const cleaned = attr
      .replace(/color\s*:\s*[^;]+;?/gi, '')
      .replace(/-webkit-text-fill-color\s*:\s*[^;]+;?/gi, '');
    el.setAttribute(
      'style',
      `${cleaned};color:${color} !important;-webkit-text-fill-color:${color} !important;`,
    );
  });

  root.querySelectorAll('foreignObject').forEach((fo) => {
    const s = fo as Element & { style?: CSSStyleDeclaration };
    if (s.style?.setProperty) {
      s.style.setProperty('color', color, 'important');
    }
  });
}

function resolveNodeClass(className: string): string {
  const tokens = className.split(/\s+/).filter(Boolean);
  const skip = new Set(['node', 'default', 'flowchart-label', 'label', 'clickable']);
  const keys = Object.keys(mermaidSketchStyles).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (skip.has(key)) continue;
    if (tokens.includes(key)) return key;
  }
  return 'input';
}

/** Post-process Mermaid SVG — vivid fills, hachure where mapped, contrast-safe labels */
export function enhanceMermaidSvg(svg: string, isDark = false): string {
  if (typeof DOMParser === 'undefined') return svg;

  const edgeColor = isDark ? '#A5B4FC' : '#4338CA';
  const palettes = getSketchPalettes(isDark);

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, 'image/svg+xml');
    const root = doc.documentElement;
    if (root.querySelector('parsererror')) return svg;

    const defs = doc.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = buildSketchPatternDefs(isDark).replace(/^<defs>|<\/defs>$/g, '');
    root.insertBefore(defs, root.firstChild);

    root.querySelectorAll('style').forEach((styleEl) => {
      let css = styleEl.textContent ?? '';
      css = css.replace(
        /((?:\.nodeLabel|\.label|foreignObject)[^{]*\{[^}]*?)color\s*:\s*[^;!}]+/gi,
        `$1color:#1E293B`,
      );
      styleEl.textContent = css;
    });

    root.querySelectorAll('g.node').forEach((node) => {
      const className = node.getAttribute('class') ?? '';
      const semantic = resolveNodeClass(className);
      const resolved = getSketchStyleForClass(semantic);
      const palette = palettes[resolved.palette] ?? palettes.blue;
      const shape = node.querySelector('rect, polygon, path, ellipse');
      if (!shape) return;

      const patterned = patternUrl(resolved.fill, resolved.palette);
      const fill = patterned ?? palette.bg;
      shape.setAttribute('fill', fill);
      shape.setAttribute('stroke', palette.border);
      shape.setAttribute('stroke-width', '2.5');
      shape.setAttribute('rx', shape.getAttribute('rx') || '6');
      const dash = strokeDasharray(resolved.stroke);
      if (dash) shape.setAttribute('stroke-dasharray', dash);
      else shape.removeAttribute('stroke-dasharray');

      // Labels always contrast against the solid pastel base (not hatch lines)
      forceLabelColor(node, palette.text);
    });

    const edgeLabelColor = isDark ? '#F1F5F9' : '#1E293B';
    root.querySelectorAll('g.edgeLabel, .edgeLabel, .cluster-label').forEach((el) => {
      forceLabelColor(el, edgeLabelColor);
    });

    root.querySelectorAll('.edgePath path, .flowchart-link').forEach((path) => {
      path.setAttribute('stroke', edgeColor);
      path.setAttribute('stroke-width', '2.5');
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
