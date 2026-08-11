/* Accessibility measurement harness for _audit/measured-v2.json.
   Loaded into the LIVE page and run there — the numbers in that file are
   this function's output, not an assertion about intent. */
window.__auditMeasure = function () {
  // Rule 2 of the shipping doctrine: a zero viewport makes every number a lie.
  if (!window.innerWidth) return { error: 'zero viewport - refusing to measure' };

  const parseRGB = (s) => {
    const m = String(s).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const relLum = (c) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const contrast = (a, b) => {
    const l1 = relLum(a), l2 = relLum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
  const composite = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1
  });

  // Effective background: composite every translucent ancestor layer down to
  // an opaque one. Gradient sections declare a solid background-color under
  // the gradient, which is the LIGHTEST point the gradient paints, so this
  // reads conservatively rather than optimistically.
  const gradientHoles = [];
  const effBg = (el) => {
    const stack = [];
    let node = el;
    while (node && node.nodeType === 1) {
      const cs = getComputedStyle(node);
      const c = parseRGB(cs.backgroundColor);
      if (c && c.a > 0) { stack.push(c); if (c.a === 1) break; }
      else if (cs.backgroundImage && cs.backgroundImage !== 'none') {
        gradientHoles.push((node.tagName + '.' + (node.className || '')).slice(0, 60));
      }
      node = node.parentElement;
    }
    let out = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = stack.length - 1; i >= 0; i--) out = composite(stack[i], out);
    return out;
  };

  const shown = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  // ---- 1. tap targets --------------------------------------------------
  const SEL = 'a[href], button, input:not([type=hidden]), select, textarea, summary, [role="button"], [tabindex]:not([tabindex="-1"])';
  const tapUnder = [];
  let tapChecked = 0;
  document.querySelectorAll(SEL).forEach((el) => {
    if (!shown(el)) return;
    tapChecked++;
    const r = el.getBoundingClientRect();
    const w = Math.round(r.width * 10) / 10, h = Math.round(r.height * 10) / 10;
    if (w < 44 || h < 44) {
      tapUnder.push({
        el: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : ''),
        text: (el.textContent || '').trim().slice(0, 40),
        w, h
      });
    }
  });

  // ---- 2. text contrast (flat 4.5:1, no large-text exemption) ----------
  const textFails = [];
  let textChecked = 0;
  document.querySelectorAll('body *').forEach((el) => {
    let hasOwnText = false;
    for (const n of el.childNodes) {
      if (n.nodeType === 3 && n.textContent.trim().length) { hasOwnText = true; break; }
    }
    if (!hasOwnText || !shown(el)) return;
    const cs = getComputedStyle(el);
    if (cs.webkitTextFillColor && cs.webkitTextFillColor.includes('rgba(0, 0, 0, 0)')) {
      textFails.push({ el: el.tagName.toLowerCase(), reason: 'transparent text-fill (gradient text)', ratio: 0 });
      return;
    }
    const fg = parseRGB(cs.color);
    if (!fg || fg.a === 0) return;
    textChecked++;
    const bg = effBg(el);
    const solidFg = fg.a < 1 ? composite(fg, bg) : fg;
    const ratio = contrast(solidFg, bg);
    if (ratio < 4.5) {
      textFails.push({
        el: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : ''),
        text: (el.textContent || '').trim().slice(0, 45),
        color: cs.color, bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
        px: parseFloat(cs.fontSize), weight: cs.fontWeight,
        ratio: Math.round(ratio * 100) / 100
      });
    }
  });

  // ---- 3. navigation ---------------------------------------------------
  const navAnchors = [].slice.call(document.querySelectorAll('header.nav a[href]'));
  const sectionIds = [];
  navAnchors.forEach((a) => {
    const href = a.getAttribute('href');
    const hash = href.indexOf('#');
    if (hash < 0) return;
    const id = href.slice(hash + 1);
    if (id && sectionIds.indexOf(id) < 0) sectionIds.push(id);
  });

  return {
    url: location.href,
    viewport: { w: window.innerWidth, h: window.innerHeight },
    docHeight: document.documentElement.scrollHeight,
    tap: { checked: tapChecked, under44: tapUnder.length, offenders: tapUnder },
    text: { checked: textChecked, below45: textFails.length, offenders: textFails.slice(0, 40) },
    gradientHoles: Array.from(new Set(gradientHoles)),
    nav: { anchors: navAnchors.length, sectionIds }
  };
};
