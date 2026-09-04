#!/usr/bin/env node
// One-time, fail-closed promotion of the reviewed V4 source. No external input.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const read = p => fs.readFileSync(p,'utf8');
const write = (p,s) => fs.writeFileSync(p,s);
assert.equal(execFileSync('git',['hash-object','v4/index.html'],{encoding:'utf8'}).trim(),'8ae4a59fe21b66c262cfc0d3a8eb7bbe630efbed','V4 moved; re-review before promotion');
const original = read('v4/index.html');
const once = (s,from,to) => { assert.equal(s.split(from).length-1,1,`Expected one match: ${from.slice(0,90)}`); return s.replace(from,to); };
let html=original.replaceAll('../','./');
html=once(html,'<!-- Draft surface: unlinked and unindexed until promoted. Remove on promotion. -->\n<meta name="robots" content="noindex">','<meta name="robots" content="index,follow">');
html=once(html,'<meta property="og:url" content="https://alexfc0810.github.io/alex-amaro-portfolio/v4/">','<meta property="og:url" content="https://alexfc0810.github.io/alex-amaro-portfolio/">');
html=once(html,'<link rel="stylesheet" href="./style.css">','<link rel="stylesheet" href="./assets/portfolio.css">');
html=once(html,'<meta name="description" content="Meta paid social is the specialty; the offer, the creative tests, the follow-up system and the measurement are the same pair of hands. Client ad creative you can open, live systems you can click, and every figure bound to a published, machine-readable contract.">','<meta name="description" content="Alex Amaro: Meta paid social and the systems behind the ads. Explore real campaign creative, source-linked results, growth economics, and a callable AI voice demo connected to a CRM-workflow story.">');
html=once(html,'<a class="button button--ghost" href="#video">Watch the work <svg aria-hidden="true"><use href="#i-play"/></svg></a>','<a class="button button--ghost" href="tel:+18888147785">Call the AI demo <svg aria-hidden="true"><use href="#i-right"/></svg></a>');
html=once(html,'    <a href="#video">Video</a>','    <a href="#voice">AI demo</a>');
html=once(html,'    <a class="site-nav__mail" href="mailto:jesusalexelamaro@gmail.com?subject=From%20your%20portfolio">Email</a>','    <a class="site-nav__mail" href="./Alex-Amaro-Resume.pdf">Résumé</a>');
const panel=html.match(/    <article class="system-feature system-panel is-active" id="sys-01"[\s\S]*?    <\/article>/);
assert.ok(panel,'Missing client-systems panel');
const b11=panel[0].match(/<p data-claim="B11">[\s\S]*?<\/p>/)?.[0];
assert.ok(b11,'Missing B11 evidence');
const newPanel=`    <article class="system-feature system-panel is-active" id="sys-01" role="tabpanel" aria-labelledby="tab-sys-01">
      <div class="system-feature__image visual-frame">
        <div class="frame-label" aria-hidden="true"><span>Connected workflow</span><span>Illustrative / 01</span></div>
        <div class="sys-flow">
          <div><span>01</span>Incoming call → needs and booking intent</div>
          <div><span>02</span>Approved in-call action → route or trigger the next step</div>
          <div><span>03</span>Contact record → relevant details saved in the CRM</div>
          <div><span>04</span>Workflow branch → follow-up or a task for the right person</div>
          <div><span>05</span>Continuing follow-through → reminders or nurture</div>
          <div><span>06</span>Outcome or exception → stop, adapt or hand over</div>
        </div>
        <p class="workflow-caption">Illustrative workflow — configured per business, not a live activity log.</p>
      </div>
      <div class="system-feature__copy">
        <p class="micro-label">CareLine · AI voice + CRM workflows</p>
        <h3>The call is only the beginning.</h3>
        <p>An AI receptionist is the front door. The connected CRM and workflows are what turn the conversation into follow-through.</p>
        <p>I configure voice agents as part of an integrated CRM system, not as standalone answering bots. Depending on the deployment, approved actions can run while the caller is still on the line, with multi-step workflows continuing afterward: contact updates, qualification, routing, booking follow-through, reminders and human handoff.</p>
        <p>Workflows can branch on the caller’s needs and the contact’s status, so the next step stays connected to the conversation.</p>
        <p class="demo-credit">Built on GoHighLevel. My work: agent configuration, workflow design, integrations and testing.</p>
        ${b11}
        <div class="voice-demo" id="voice" aria-label="Call the public AI demo">
          <p class="micro-label">Try the public demo</p>
          <a class="demo-number" href="tel:+18888147785" aria-label="Call the public AI demo at +1 888 814 7785">+1 (888) 814-7785</a>
          <div class="demo-actions">
            <a class="demo-action" href="tel:+18888147785">Call the AI demo <svg aria-hidden="true"><use href="#i-right"/></svg></a>
            <a class="text-link" href="./work/spine-clinic.html">See the client build <svg aria-hidden="true"><use href="#i-right"/></svg></a>
          </div>
          <p>Tell the agent what kind of business you run and try a sample customer inquiry.</p>
          <p class="demo-note">Public demo, not a client account. The demo captures booking intent for owner confirmation; available actions vary by setup. Use a sample scenario and avoid sensitive information.</p>
        </div>
      </div>
    </article>`;
html=once(html,panel[0],newPanel);
html=once(html,'<p>Spend to leads to booked jobs to return, with the whole chain shown and a panel that moves one input at a time. It exists to make an argument I will defend: on most local accounts cost per lead is the smallest of the three levers, and booking rate is the one worth engineering. That is why I do not optimise to cost per lead alone.</p>','<p>Spend to leads to booked jobs to return, with the whole chain visible. Change one input at a time to see which constraint matters most. The model makes the trade-offs after the click inspectable; its scenarios are illustrative assumptions, not client results.</p>');
html=once(html,'<span>Own brand / AI-generated, judged</span>','<span>Own brand / AI-generated concept</span>');
html=once(html,'<h3>One hook that cleared the gate.</h3>','<h3>A hook, carried into an ad.</h3>');
html=once(html,'<p>An AI-generated UGC hook with a claim-free end card, for a product I own. One of the few that made it through the review gate below — labelled concept, not campaign.</p>','<p>Own-brand component assembly: an AI-generated hook with a claim-free CareLine end card. Shown as concept work, not a client campaign or a measured performance result.</p>');
html=once(html,'data-note="Own-brand, AI-generated hook with a claim-free end card, judged through the review gate below. Concept work for a product I own, not a client campaign."','data-note="Own-brand component assembly: an AI-generated hook with a claim-free CareLine end card. Concept work, not a client campaign or a measured performance result."');
const ld={"@context":"https://schema.org","@type":"Person",name:"Alex Amaro",jobTitle:"Growth marketer — Meta paid social and AI systems",url:"https://alexfc0810.github.io/alex-amaro-portfolio/",knowsLanguage:["en","es"],sameAs:["https://linkedin.com/in/alex-amaro-a4187a221","https://github.com/AlexFC0810"]};
html=once(html,'</head>',`<script type="application/ld+json">${JSON.stringify(ld)}</script>\n</head>`);
// Deep links must open the correct system tab even after another tab was selected.
const hashScript=`<script>
(function(){
  function revealVoice(){
    if(location.hash !== '#voice' && location.hash !== '#sys-01') return;
    var tab=document.getElementById('tab-sys-01');
    if(tab && tab.getAttribute('aria-selected')!=='true') tab.click();
    var target=document.getElementById(location.hash.slice(1));
    if(target) requestAnimationFrame(function(){ target.scrollIntoView({block:'start'}); });
  }
  window.addEventListener('hashchange',revealVoice);
  revealVoice();
})();
</script>`;
html=once(html,'</body>',hashScript+'\n</body>');
// Assert the promotion did not modify a single pre-existing contracted block.
function blocks(s){const out=[];for(const m of s.matchAll(/<([a-z]+)\b[^>]*\sdata-claim="([A-Z]+\d+)"[^>]*>/g)){let d=1,i=m.index+m[0].length,start=i;const re=new RegExp('<(/?)'+m[1]+'(?=[\\s>])[^>]*>','g');re.lastIndex=i;let n;while(d&&(n=re.exec(s))){d+=n[1]?-1:1;if(!d){out.push([m[2],s.slice(start,n.index).replaceAll('../','./')]);}}}return out;}
assert.deepEqual(blocks(html),blocks(original),'A contracted evidence block changed');
write('index.html',html);
let css=read('v4/style.css');
css+=`\n/* Final canonical surface: existing V4 tokens, no new palette or font. */
.workflow-caption{margin:0;padding:0 24px 24px;font-family:var(--sans,Inter,sans-serif);font-size:14px;line-height:1.6;color:var(--muted)}
.voice-demo{margin-top:24px;padding-top:20px;border-top:1px solid var(--paper-body);scroll-margin-top:100px}
.system-feature__copy .demo-number{display:inline-flex;align-items:center;min-height:48px;font-family:'Instrument Serif',Georgia,serif;font-size:clamp(28px,4vw,40px);line-height:1.2;font-weight:400;color:var(--ink-text);text-decoration:none;overflow-wrap:anywhere}
.demo-actions{display:flex;flex-wrap:wrap;align-items:center;gap:10px 20px;margin:14px 0}
.demo-action{display:inline-flex;align-items:center;justify-content:center;gap:12px;min-height:48px;padding:12px 18px;background:var(--ink-text);color:var(--paper);font-family:Inter,sans-serif;font-size:14px;font-weight:520;text-decoration:none;border:1px solid var(--ink-text)}
.demo-action svg{width:16px;height:16px;flex:none}
.demo-action:hover{background:var(--paper);color:var(--ink-text)}
.demo-action:focus-visible,.demo-number:focus-visible{outline:2px solid var(--ink-text);outline-offset:4px}
.system-feature__copy .demo-note,.system-feature__copy .demo-credit{font-size:14px;line-height:1.6;color:var(--paper-body)}
@media(max-width:640px){.workflow-caption{padding-inline:18px}.demo-actions{align-items:flex-start;flex-direction:column}}
`;
write('assets/portfolio.css',css);
let agents=read('AGENTS.md');
agents=once(agents,'| `index.html` | The root. Hero → `#running` (systems) → `#creative` → `#numbers` → `#work` → `#record`. Hand-edited. |','| `index.html` | The final canonical portfolio, promoted from V4 on 2026-09-04 at Alex’s request. Hero → proof tour → creative/video → `#running` (including `#voice`) → evidence → strategy → work → record. Hand-edited; styles in `assets/portfolio.css`. |');
agents=once(agents,'| `v4/` | **The proof-room draft** (2026-09-04) — the Codex prototype ported to static HTML, contract-bound. `noindex` and unlinked until Alex promotes it to root. Its guards: `tools/check-home-claims.mjs`, `tools/gate-ledger.mjs`; its registers: `proof/gate-ledger.json`, `proof/called-shots.json`. |','| `v4/` | Retained noindex source snapshot of the proof-room design. The canonical final version is now `index.html`; do not overwrite its voice/CRM improvements with this older snapshot. Guards: `tools/check-home-claims.mjs`, `tools/gate-ledger.mjs`. |');
agents+='\n## Final portfolio release — 2026-09-04\n\nAlex authorized the final version in chat. V4’s design is now the canonical root, with the existing callable demo integrated into the client-systems panel. `#voice` deep links reopen the correct tab. The neutral demo label is deliberate: the agent-name mapping was not independently established. The phone number was previously confirmed by Alex; this release tests the website affordance, not a phone call. No CRM settings, routing or messages are changed.\n\nKeep three evidence classes distinct: configured platform capability, public-demo behavior, and proven client deployment. The workflow illustration is not a live log. Existing B11 and every other contracted evidence block are preserved. The own-brand video is labelled component/concept work, not an approved complete ad or a client result. No new off-origin resource is introduced. The existing guards workflow now also runs the home-claims and gate-ledger checks that the page describes.\n';
write('AGENTS.md',agents);
write('DESIGN.md',read('DESIGN.md')+'\n\n# Final canonical portfolio — 2026-09-04\n\nThe reviewed V4 proof-room design is promoted to the root at Alex’s request. Its measured token system is retained in `assets/portfolio.css`; the historical V4 files remain noindex and unmodified. The new phone number uses Instrument Serif at 400; the call control uses the existing ink/paper pair, Inter at 520, a 48px minimum height, no radius and no shadow. The workflow caption and demo boundaries use the existing 14px caption role. No new color, font or external request. The public demo is reachable from the hero and header, and the header exposes the résumé without burying it in the footer. On a deep link the relevant system tab opens before scrolling. The illustrative workflow is labelled as such and cannot be mistaken for execution telemetry.\n');
let guards=read('.github/workflows/guards.yml');
assert.ok(!guards.includes('node tools/check-home-claims.mjs'));
guards+='      - name: home claims licensed by the public contract\n        run: node tools/check-home-claims.mjs\n      - name: creative review counts match the dated ledger\n        run: node tools/gate-ledger.mjs\n';
write('.github/workflows/guards.yml',guards);
console.log(JSON.stringify({stage:'materialized',from:'1ba3e02',contractedBlocksPreserved:blocks(html).length,rootBytes:Buffer.byteLength(html),phone:'website affordance only; no call placed'}));
