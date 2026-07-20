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

function forceLabelColor(root: Element, color: string) {
  // SVG text nodes use fill=, HTML labels use color
  root.querySelectorAll('text, tspan').forEach((el) => {
    el.setAttribute('fill', color);
    el.removeAttribute('stroke');
    if (el instanceof SVGElement) {
      el.style.fill = color;
      el.style.color = color;
    }
  });

  root.querySelectorAll('span, p, div, a, label, .nodeLabel, .edgeLabel').forEach((el) => {
    if (el instanceof HTMLElement || el instanceof SVGElement) {
      el.style.setProperty('color', color, 'important');
      el.style.setProperty('fill', color, 'important');
      // Drop Mermaid inline color that fights our theme
      const style = el.getAttribute('style');
      if (style && /color\s*:/i.test(style)) {
        el.setAttribute(
          'style',
          style.replace(/color\s*:\s*[^;]+;?/gi, '') + `color:${color} !important;`,
        );
      }
    }
  });

  root.querySelectorAll('foreignObject').forEach((fo) => {
    if (fo instanceof SVGElement) {
      fo.style.color = color;
    }
  });
}

/** Post-process Mermaid SVG — solid fills by default, theme-aware edges + readable labels */
export function enhanceMermaidSvg(svg: string, isDark = false): string {
  if (typeof DOMParser === 'undefined') return svg;

  const edgeColor = isDark ? '#A5B4FC' : '#4F46E5';
  const defaultLabel = isDark ? '#F1F5F9' : '#1E293B';
  const palettes = getSketchPalettes(isDark);

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, 'image/svg+xml');
    const root = doc.documentElement;
    if (root.querySelector('parsererror')) return svg;

    const defs = doc.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = buildSketchPatternDefs(isDark).replace(/^<defs>|<\/defs>$/g, '');
    root.insertBefore(defs, root.firstChild);

    // Override Mermaid-injected <style> label colors that ignore dark fills
    root.querySelectorAll('style').forEach((styleEl) => {
      let css = styleEl.textContent ?? '';
      if (isDark) {
        css = css
          .replace(/color:\s*#(?:0{3,8}|1[Ee]293[Bb]|1[Ee]1[Bb]4[Bb]|000(?:000)?)\b/gi, `color:${defaultLabel}`)
          .replace(/fill:\s*#(?:0{3,8}|1[Ee]293[Bb]|1[Ee]1[Bb]4[Bb]|000(?:000)?)\b/gi, `fill:${defaultLabel}`);
      }
      styleEl.textContent = css;
    });

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

      forceLabelColor(node, palette.text);
    });

    // Edge / cluster labels
    root.querySelectorAll('g.edgeLabel, .edgeLabel, .cluster, .cluster-label').forEach((el) => {
      forceLabelColor(el, defaultLabel);
    });

    // Safety net: any leftover dark text fills in dark mode
    if (isDark) {
      root.querySelectorAll('text, tspan').forEach((el) => {
        const fill = (el.getAttribute('fill') || '').toLowerCase();
        if (!fill || fill === 'none' || fill === '#000' || fill === '#000000' || fill === '#1e293b' || fill === '#1e1b4b') {
          el.setAttribute('fill', defaultLabel);
        }
      });
    }

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
