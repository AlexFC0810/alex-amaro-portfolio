/**
 * token-ripper — pull the REAL design system off a live page.
 *
 * Paste into the browser tool (javascript_tool / devtools console) on the live
 * URL. Audits computed style, not source: source shows what was intended,
 * computed shows what shipped, and the gap between them is the whole problem.
 *
 * Read the output against the table in SKILL.md step 3.
 */
(() => {
  // 1. declared tokens — the system as designed
  const vars = {};
  for (const sheet of document.styleSheets) {
    let rules; try { rules = sheet.cssRules; } catch { continue; } // cross-origin
    for (const r of rules || []) {
      if (r.style && r.selectorText && /:root|html/.test(r.selectorText)) {
        for (const p of r.style) if (p.startsWith('--')) vars[p] = r.style.getPropertyValue(p).trim();
      }
    }
  }

  // 2. type scale as RENDERED — leaf text nodes only, so a wrapper's inherited
  //    style is not counted as its own step
  const sizes = new Map();
  document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,a,span,div,button,small,td,th,label').forEach(el => {
    if (el.children.length > 0) return;
    if (!(el.textContent || '').trim()) return;
    const cs = getComputedStyle(el);
    const fs = parseFloat(cs.fontSize);
    if (!fs) return;
    const key = [fs, cs.fontWeight, cs.letterSpacing, cs.lineHeight, cs.fontFamily.split(',')[0]].join('|');
    sizes.set(key, (sizes.get(key) || 0) + 1);
  });
  const typeScale = [...sizes.entries()].map(([k, count]) => {
    const [px, weight, tracking, leading, family] = k.split('|');
    const em = tracking.endsWith('px') && +px ? (parseFloat(tracking) / +px).toFixed(4) + 'em' : tracking;
    return { px: +px, weight, tracking, tracking_em: em, leading, family: family.replace(/["']/g, ''), count };
  }).sort((a, b) => b.px - a.px || b.count - a.count);

  // 3 + 4. elevation and radius ladders
  const tally = (prop, skip) => {
    const m = new Map();
    document.querySelectorAll('*').forEach(el => {
      const v = getComputedStyle(el)[prop];
      if (v && v !== skip) m.set(v, (m.get(v) || 0) + 1);
    });
    return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([v, n]) => ({ n, v }));
  };
  const shadows = tally('boxShadow', 'none');
  const radii = tally('borderRadius', '0px');

  const weights = [...new Set(typeScale.map(t => +t.weight))].sort((a, b) => a - b);

  return {
    VERDICT: {
      distinct_type_styles: typeScale.length,       // world-class 6-12
      weight_band: weights.join('/'),               // world-class 400-600
      max_weight: Math.max(...weights),             // >700 at display = slop tell
      radius_values: radii.length,                  // world-class 2-3
      elevation_variants: shadows.length,           // one ladder, not two
      families: [...new Set(typeScale.map(t => t.family))]
    },
    declaredTokens: vars,
    typeScale: typeScale.slice(0, 25),
    elevationLadder: shadows.slice(0, 10).map(s => ({ n: s.n, shadow: s.v.slice(0, 120) })),
    radiiLadder: radii.slice(0, 10)
  };
})()
