/** One underlying portfolio; context-specific openings. No network or credentials. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
export const refinementCSS=`
.booking-pattern{display:grid;grid-template-columns:1fr 1fr 1fr;gap:26px;margin:32px 0 20px;padding-top:28px;border-top:1px solid var(--ink)}
.booking-pattern h3{font-size:26px;line-height:1.1;font-weight:750;letter-spacing:-.04em}.booking-pattern article>p{font-size:22px;line-height:1.35;font-weight:750}.booking-pattern article>span{display:block;font-size:13px;line-height:1.6;color:var(--quiet);margin-top:12px}
.fit-grid .leadership-proof{color:var(--ink);font-weight:700;margin-top:18px;font-size:17px}.attestation-note{display:block;font-size:12px;color:var(--quiet);margin-top:8px}
.audience-links{display:flex;gap:6px 20px;flex-wrap:wrap;border-top:1px solid var(--line);padding:16px 4vw;background:var(--paper);align-items:center}.audience-links span{font-size:12px;color:var(--quiet)}.audience-links a{font-size:13px;display:inline-flex;min-height:44px;align-items:center;text-decoration:underline;text-underline-offset:4px}
@media(max-width:760px){.booking-pattern{grid-template-columns:1fr;gap:22px}.booking-pattern h3{font-size:26px}.booking-pattern article{border-top:1px solid var(--line);padding-top:18px}.audience-links{padding-inline:20px}}
`;
const base='https://alexfc0810.github.io/alex-amaro-portfolio/';
const views=[
 {path:'ai-growth.html',title:'AI Growth Systems & Implementation',eyebrow:'AI integration · Marketing automation · Sales operations',headline:'The right AI.<br><em>Working for growth.</em>',deck:'I select, integrate and implement AI solutions for marketing and sales—not just recommend the tools. I connect paid acquisition, voice AI and conversion workflows for high-ticket service businesses, drawing on B2B and B2C experience.',primary:'#ai-work',primaryText:'Explore the systems',schema:'AI growth systems and implementation specialist',close:'Let’s put the right AI<br><em>to work.</em>'},
 {path:'marketing-management.html',title:'Marketing Operations & Management',eyebrow:'Marketing operations · Project management · AI-native execution',headline:'Better operations.<br><em>Stronger results.</em>',deck:'I connect marketing strategy, performance creative, paid acquisition and conversion systems—then lead the work from brief to launch. Hands-on automation, team leadership and B2B/B2C experience support my specialty in high-ticket service businesses.',primary:'#fit',primaryText:'See how I lead execution',schema:'Growth marketing and automation lead',close:'Better marketing operations.<br><em>Stronger execution.</em>'},
 {path:'ai-operator.html',title:'AI-Native Operator',eyebrow:'AI-native operations · Workflow implementation · Growth systems',headline:'Turn AI capability<br><em>into working systems.</em>',deck:'I connect people, processes and AI to move commercial work from idea to implementation. My background spans B2B and B2C acquisition, marketing operations and hands-on automation for high-ticket service businesses.',primary:'#ai-work',primaryText:'Explore the implementations',schema:'AI-native operator',close:'Build the systems.<br><em>Move the business forward.</em>'}
];
const links='<aside class="audience-links" aria-label="Portfolio views"><span>Explore by focus</span><a href="./index.html">Performance advertising + digital marketing</a><a href="./ai-growth.html">AI growth systems</a><a href="./marketing-management.html">Marketing operations + management</a><a href="./ai-operator.html">AI-native operator</a></aside>';
export function renderAudienceViews(){
 let source=fs.readFileSync('index.html','utf8');
 if(!source.includes('class="audience-links"'))source=source.replace('<footer class="site-footer"',links+'<footer class="site-footer"');
 fs.writeFileSync('index.html',source);
 for(const v of views){
  let html=source;
  html=html.replace(/<title>[^<]*<\/title>/,`<title>Alex Amaro — ${v.title}</title>`);
  html=html.replace(/(<div class="hero-copy"><p class="eyebrow">)[\s\S]*?(<\/p><h1 id="hero-title">)/,`$1${v.eyebrow}$2`);
  html=html.replace(/(<h1 id="hero-title">)[\s\S]*?(<\/h1>)/,`$1${v.headline}$2`);
  html=html.replace(/(<p class="hero-deck">)[\s\S]*?(<\/p>)/,`$1${v.deck}$2`);
  html=html.replace('class="button button-dark" href="#work">Explore the work',`class="button button-dark" href="${v.primary}">${v.primaryText}`);
  html=html.replace(`<link rel="canonical" href="${base}">`,`<link rel="canonical" href="${base+v.path}">`);
  html=html.replace(`<meta property="og:url" content="${base}">`,`<meta property="og:url" content="${base+v.path}">`);
  html=html.replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${v.deck}">`);
  html=html.replace(/<meta property="og:title" content="[^"]*">/,`<meta property="og:title" content="Alex Amaro — ${v.title}">`);
  html=html.replace(/<meta property="og:description" content="[^"]*">/,`<meta property="og:description" content="${v.deck}">`);
  html=html.replace('"jobTitle":"AI-native performance marketer"',`"jobTitle":"${v.schema}"`);
  html=html.replace('<meta name="robots" content="index,follow">','<meta name="robots" content="noindex,follow">');
  html=html.replace('Let’s make your next campaign<br><em>hit harder.</em>',v.close);
  assert.ok(html.includes('high-ticket service businesses'));
  assert.ok(html.includes(v.eyebrow)&&html.includes(v.headline)&&html.includes(v.deck),'View replacement failed '+v.path);
  fs.writeFileSync(v.path,html);
 }
 let creative=fs.readFileSync('creative.html','utf8');
 if(!creative.includes('class="audience-links"'))creative=creative.replace('<footer class="site-footer"',links+'<footer class="site-footer"');
 fs.writeFileSync('creative.html',creative);
}
