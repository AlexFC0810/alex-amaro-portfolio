from pathlib import Path
import json,hashlib
R=Path('.')
def once(s,a,b):
    if b in s and a not in s:return s
    assert s.count(a)==1,(a[:100],s.count(a))
    return s.replace(a,b)
p=R/'tools/build-creative-portfolio.mjs';s=p.read_text()
s=once(s,"import {aiWork, aiWorkCSS} from './portfolio-ai-work.mjs';","import {aiWork, aiWorkCSS} from './portfolio-ai-work.mjs';\nimport {renderAudienceViews, refinementCSS} from './portfolio-views.mjs';")
s=s.replace('Online business since 2018 · Client marketing since 2022','Online business since 2018 · Digital marketing since 2020')
s=once(s,'<span>An agency’s lead volume, same account</span>','<span>the lead volume · ~75% lower cost per lead</span>')
s=once(s,'A sharper offer.<br>A stronger result.','Sharper strategy.<br>Stronger results.')
s=once(s,'Different offers, buyers and markets. The work connects acquisition with what happens next.','Lead generation, booked appointments and the systems behind them—across different offers, buyers and markets.')
s=once(s,'<a class="text-link" href="./work.html">Explore the full case library ${arrow}</a></section>`;','<div class="booking-pattern" aria-label="Other selected booking outcomes"><div><p class="eyebrow blue">Not a one-off</p><h3>More markets.<br>More booked conversations.</h3></div><article data-claim="C7"><p>${wording(\'C7\',\'one_liner\')}</p><span>Aesthetic clinic · CRM + tracker corroboration</span><a class="text-link" href="./work/aesthetic-clinic-bookings.html">See the context ${arrow}</a></article><article data-claim="C8"><p>${wording(\'C8\',\'one_liner\')}</p><span>Montreal beauty brand · bilingual campaign</span><a class="text-link" href="./work/montreal-bilingual.html">See the context ${arrow}</a></article></div><a class="text-link" href="./work.html">Explore the full case library ${arrow}</a></section>`;')
s=once(s,'Good ads start the conversation.<br><em>The system keeps it moving.</em>','Good advertising starts the conversation.<br><em>Follow-up turns interest into appointments.</em>')
s=once(s,'I connect lead response, AI voice and CRM workflows so new interest has a clear next step—even after the call ends.','I build the GoHighLevel automations behind the follow-up: lead routing, SMS and email sequences, booking reminders and pipeline updates. The goal is a clear path from a new inquiry to a booked conversation.')
s=once(s,'AI runs through how I research, develop creative, plan tests and build workflows. I connect those pieces around one commercial question: what moves the right prospect to the next step?','Not every part of a funnel deserves equal effort. I use research, campaign data and hands-on experience to diagnose the constraint, prioritize the highest-impact work and build the fix—with AI throughout.')
s=once(s,'<li><span>01 / Offer</span><h3>Find the reason to act.</h3><p>Use AI-assisted research to map buyer needs and objections. Apply commercial judgment to shape the offer.</p></li>','<li><span>01 / Diagnose + prioritize</span><h3>Find the work that matters.</h3><p>Understand the buyer and the business. Identify the constraint before spreading effort across everything.</p></li>')
s=once(s,'Connect lead response, routing and CRM workflows so the next step is designed—not left to chance.','Build and test the GoHighLevel workflows myself: routing, follow-up, reminders and the right human handoff.')
s=once(s,'I started selling shoes on eBay in 2018, moved into Amazon FBA and FBM, and began exploring Shopify in 2020. That is where I started learning paid advertising, websites and conversion optimization.','I started selling shoes on eBay in 2018, then expanded into Amazon, primarily FBM. In 2020, building my own e-commerce store took me into digital marketing: paid advertising, websites, buyer psychology and conversion optimization.')
s=once(s,'In 2022, I moved into client acquisition work. My responsibilities grew beyond campaigns into creative, lead response and delivery systems. Today, AI runs through how I connect and build that work.','In 2022, I moved into lead generation and client acquisition for high-ticket service businesses. My responsibilities grew into marketing strategy, team coordination and hands-on automation. Today, AI runs through how I diagnose, prioritize and deliver that work.')
s=once(s,'<article><span>For growth teams</span><h3>Creative, acquisition and marketing operations.</h3><p>Strongest in hands-on growth, paid social and marketing automation roles where the work needs to connect.</p></article>','<article><span>Marketing + project delivery</span><h3>Set the direction.<br>Lead the delivery.</h3><p>I coordinate media buying, creative and CRM work—setting priorities, reviewing output and owning client communication.</p><p class="leadership-proof" data-claim="B8">${wording(\'B8\',\'one_liner\')}</p><small class="attestation-note">Owner-reported leadership experience.</small></article>')
s=once(s,'Meta campaigns, creative testing, CRM follow-up and practical AI workflows—not another strategy deck that stops at the handoff.','Diagnose the growth bottleneck, choose the highest-value opportunity and connect the strategy to campaigns, creative and working automations.')
s=once(s,'Bring the offer, the account or the part of the funnel that needs attention.','Bring the growth target, the account or the part of the funnel that is holding results back.')
s=s.replace('Shopify and marketing learning in 2020','Own-store e-commerce and digital marketing began in 2020')
s=s.replace('Career Capital CANDIDATE_PROFILE.md and PORTFOLIO_NARRATIVE_AND_VIEWS_2026-09-04.md; owner-confirmed 2018 / 2020 / 2022 chronology','Career Capital PORTFOLIO_CONTROL_REFINEMENT_2026-09-04.md; owner-confirmed 2018 / 2020 / 2022 chronology')
s=once(s,'${aiWorkCSS}','${aiWorkCSS}\n${refinementCSS}')
s=once(s,"const categories=[['all','All work'],['health','Health + aesthetics'],['home','Home services'],['b2b','B2B'],['own','Own-brand']]","const categories=[['all','All work'],['laser','Laser + beauty'],['tattoo','Tattoo removal'],['weight','Weight loss'],['health','Clinics + aesthetics'],['home','Home services'],['own','Own-brand']]")
s=once(s,'Different markets.<br>Clear reasons to act.','Creative range.<br>Commercial intent.')
s=once(s,'Offers, hooks and visual directions for competitive markets. Explore the range, then open a piece to see the details.','A deep collection of campaign angles, offers and visual directions. Start with the highlights, choose a market, or open the complete collection.')
s=once(s,'Campaign and own-brand work, labelled by context. Creative examples show the work; campaign results are below.','Selected campaign and own-brand work. Some pieces are still previews of authored Canva layouts; video examples are available on request. Individual creative is shown separately from campaign results.')
s=s.replace('never import a video, a motion frame','never import an unreviewed video, a generated motion frame')
s=s.replace("experience:'Online business since 2018; client marketing since 2022'","experience:'Online business since 2018; digital marketing since 2020'")
s+='\n// Contextual entry points share the same source and evidence; no parallel portfolio.\nrenderAudienceViews();\n';p.write_text(s)
p=R/'tools/portfolio-ai-work.mjs';s=p.read_text();s=once(s,'Not just content.<br>Tools that move the work.','Better decisions.<br>Systems built for results.');s=once(s,'The same systems thinking behind a campaign can turn repetitive work into a useful workflow. Here are two ways I put it to work.','I use AI where it improves a decision or a workflow—not simply to produce more output. These builds show how I turn diagnosis into practical implementation.');p.write_text(s)
p=R/'tools/check-creative-portfolio.mjs';s=p.read_text().replace("['index.html','creative.html']","['index.html','creative.html','ai-growth.html','marketing-management.html']").replace('Online business since 2018 · Client marketing since 2022','Online business since 2018 · Digital marketing since 2020');p.write_text(s)
p=R/'AGENTS.md';s=p.read_text();prefix='''## Approved control and bounded CRO refinement — 2026-09-04

The owner accepted commit `20435edca5bf7b201b5994ab4d6043814c597dfb` as the design/editorial control. Preserve that baseline and the approved layout/headline. New refinements are editorial hypotheses, not measured conversion winners. Latest upstream decision: Career Capital `PORTFOLIO_CONTROL_REFINEMENT_2026-09-04.md` at `1e683bf0f284311e10f5024c2bd3225bebaf496b`.

Current chronology is **Online business since 2018 · Digital marketing since 2020**. The 2020 date includes learning and own-store implementation; 2022 remains the start of lead generation/client acquisition in About. This explicitly supersedes the earlier public Client marketing since 2022 line below. Do not imply client-employment tenure since 2020.

The primary performance-marketer positioning stays. `ai-growth.html` and `marketing-management.html` are contextual views generated by `tools/portfolio-views.mjs` from the same homepage—not independent portfolios or invented employment titles. Keep evidence, layout and capabilities synchronized.

The owner's narrow exception permits clear still previews of authored Canva motion layouts, especially weight-loss creative. Label page previews honestly. It does not reopen Higgsfield, generated video, autoplay or refrigeration imagery. The original source references stay private.

C3 is **9.5x lead volume at approximately 75% lower cost per lead**, never equal spend. Keep C6/C7/C8 results separately time-bounded; do not invent an all-client monthly appointment average. B8 leadership is owner-reported; no corporate reporting line, hiring claim or project-management credential is implied.

'''
if not s.startswith('## Approved control'):p.write_text(prefix+s)
p=R/'DESIGN.md';p.write_text(p.read_text()+'''\n\n## Control-preserving refinement — 2026-09-04
The owner-approved control is 20435ed. Preserve the cream/purple/black palette, hero arrangement, typography and manual gallery. New booking-pattern and leadership evidence use existing tokens and native disclosures. Audience variants change only the opening and relevant metadata, using one renderer. Native image dimensions are preserved. No new external resource, autoplay or tracking.
''')
records=json.loads((R/'proof/control-artwork-integrity.json').read_text());m=json.loads((R/'tools/portfolio-gallery.json').read_text())
titles={
'laser-bilingual-01':('laser','Laser hair removal','Lead with confidence','Treatment imagery and a direct booking invitation. Client-identifying marks are masked; the creative and offer are otherwise unchanged.'),
'laser-bilingual-04':('laser','Laser hair removal','Make the service feel approachable','A conversational headline paired with a close view of the procedure. Client-identifying logo masked.'),
'tattoo-01':('tattoo','Tattoo removal','A clear next step for an old tattoo','An objection-aware hook, an in-treatment image and a visible introductory offer. Client-identifying logo masked.'),
'weight-loss-01':('weight','Weight-loss program','One service. One visible entry offer.','A blue offer-led layout with a clear price anchor and a short benefit hierarchy.'),
'weight-loss-02':('weight','Weight-loss program','Change the casting and visual energy','A warmer creative treatment of the same entry offer. Shown as a still preview of the original Canva layout.'),
'weight-loss-03':('weight','Weight-loss program','Make the price easy to find','A high-contrast offer band paired with a different visual direction.'),
'weight-loss-04':('weight','Weight-loss program','Give the program a different visual identity','A medically supervised-program label, a prominent price and a pink art direction.'),
'weight-loss-05':('weight','Weight-loss program','Put the offer beside a human moment','A lifestyle-led composition with the offer and benefits grouped together.')}
for x in m['items']:
 if x['id'].startswith('medspa-laser') or x['id']=='laser-treatment-canva':x['category']='laser'
 if x['id'].startswith('medspa-weight-loss') or x['id'].startswith('medspa-glp1'):x['category']='weight'
for x in records:
 assert hashlib.sha256((R/'assets/portfolio-static'/x['file']).read_bytes()).hexdigest()==x['sha256']
 id=Path(x['file']).stem;category,market,title,context=titles[id]
 if any(q['id']==id for q in m['items']):continue
 m['items'].append(dict(id=id,category=category,market=market,title=title,alt=f'{market} campaign artwork: {title}.',context=context,file='assets/portfolio-static/'+x['file'],thumb='assets/portfolio-static/'+x['file'],provenance='Campaign creative · still preview',source='Original Canva page preview; private source and selection receipt retained',width=447,height=447,sha256=x['sha256'],disclosure='Original Canva page preview; historical promotional artwork, not a current offer or an individual-ad performance claim.'+(' Client-identifying marks masked for portfolio privacy.' if x['redacted'] else '')))
lead=['chiro-knee-pain-03','laser-bilingual-01','tattoo-01','weight-loss-05','laser-treatment-canva','body-treatment-canva','own-brand-comparison','weight-loss-02','laser-bilingual-04','home-services-offer','medspa-laser-05','weight-loss-04']
m['items'].sort(key=lambda x:lead.index(x['id']) if x['id'] in lead else 100)
m['latest_curation']={'date':'2026-09-04','basis':'Owner-approved control refinement; eight reviewed original previews added, stronger varied selection first. Authored motion-layout still previews allowed; no Higgsfield/video playback or refrigeration images.','control_commit':'20435edca5bf7b201b5994ab4d6043814c597dfb','added_ids':[Path(x['file']).stem for x in records]}
(R/'tools/portfolio-gallery.json').write_text(json.dumps(m,indent=2,ensure_ascii=False)+'\n')
print('Control-preserving source changes applied; 38 curated pieces and two shared-content audience views.')
