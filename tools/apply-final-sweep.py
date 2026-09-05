from pathlib import Path
import json,re
root=Path('.')
p=root/'tools/build-creative-portfolio.mjs';s=p.read_text()
def rep(a,b):
 global s
 assert s.count(a)==1,(a[:80],s.count(a))
 s=s.replace(a,b)
rep("import {renderAudienceViews, refinementCSS} from './portfolio-views.mjs';","import {renderAudienceViews, refinementCSS} from './portfolio-views.mjs';\nimport {credentialsHTML, credentialsCSS} from './portfolio-credentials.mjs';")
rep('AI-native performance marketing · Meta lead generation</p>','AI-native performance marketing · Conversion systems</p>')
rep('I’m an AI-native performance marketer with an operator’s brain. I specialize in Meta lead generation for high-ticket service businesses—connecting buyer psychology, social-native creative and the systems behind the follow-up.','I’m an AI-native performance marketer with an operator’s brain. I specialize in Meta lead generation for high-ticket service businesses—connecting performance creative, paid acquisition and conversion systems to grow qualified demand.')
rep('Remote, U.S. · English / Spanish · Open to roles and select projects','B2B + B2C · English / Spanish · Remote, U.S.')
rep('Marketing + project delivery','Marketing operations + project management')
rep('Set the direction.<br>Lead the delivery.','Set the strategy.<br>Lead the execution.')
rep('I coordinate media buying, creative and CRM work—setting priorities, reviewing output and owning client communication.','I set campaign strategy, coordinate media buying, creative and CRM work, and manage projects from brief to launch. I use ClickUp and GitHub Projects to keep ownership, feedback and next steps clear.')
rep('<small class="attestation-note">Owner-reported leadership experience.</small>','<a class="text-link" href="./proof.html">Leadership background ${arrow}</a>')
rep('Commercially minded. AI-native. Bilingual.','B2B + B2C.<br>AI-native. Bilingual.')
rep('English and Spanish. HubSpot-certified in digital marketing, revenue operations and data integrations; client CRM builds are in GoHighLevel.','I connect creative judgment, paid acquisition and conversion systems across service and B2B markets. Voice AI, generative AI and marketing automation are part of how I work—not a separate add-on.')
rep('Let’s make the next campaign<br><em>work harder.</em>','Let’s make your next campaign<br><em>hit harder.</em>')
rep('AI voice + speed-to-lead + CRM','Conversion systems · Marketing automation · Sales operations')
rep('I build the GoHighLevel automations behind the follow-up: lead routing, SMS and email sequences, booking reminders and pipeline updates. The goal is a clear path from a new inquiry to a booked conversation.','Advertising creates demand. Follow-up earns the appointment. A well-run sales process gives that appointment a path to revenue. I connect the handoffs in GoHighLevel—from lead capture and response to pipeline stages, reminders and reactivation.')
rep('Connect new inquiries and missed calls to the right response path.','Route a new lead to the right person, trigger a Slack notification and start the appropriate speed-to-lead workflow.')
rep('Capture needs, qualify the inquiry, and route the request or hand off to a person.','Branch on reply keywords or contact status, qualify the inquiry, and route the next step or hand off to a person.')
rep('Use the contact’s status to guide reminders, nurture, booking follow-up and exceptions.','Connect booking reminders, pipeline updates, reactivation and review requests. Use AI-assisted call analysis to inform follow-up and sales-process improvements.')
rep('Built on GoHighLevel. My work: the agent configuration, workflow design, integrations and testing.','Built on GoHighLevel. My work: agent configuration, marketing automation, sales-process setup, integrations and testing.')
rep("full?'Static Ad Creative':'AI-Native Performance Marketer'","full?'Static Ad Creative':'Performance Advertising & Digital Marketing'")
rep('AI-native performance marketing · Remote, United States','Performance advertising + digital marketing · AI-native execution')
rep('hero+ribbon+galleryHTML()+results+voice+aiWork+system+video+about+closing','hero+ribbon+galleryHTML()+results+voice+aiWork+system+video+about+credentialsHTML+closing')
rep('${refinementCSS}','${refinementCSS}\n${credentialsCSS}')
rep('<a class="text-link" href="./work.html">Explore the full case library ${arrow}</a></section>`;','<div class="case-spotlight" data-claim="B3"><div><p class="eyebrow blue">Competitive-market acquisition</p><h3>Tattoo removal.<br>Brooklyn, New York.</h3></div><div><p>${wording(\'B3\',\'one_liner\')}</p><a class="text-link" href="./work/tattoo-removal-studio.html">Explore the tattoo-removal case ${arrow}</a></div></div><details class="more-cases"><summary>Explore more campaign and conversion-system cases</summary><nav aria-label="Additional case studies"><a href="./work/medspa-full-program.html">Medspa acquisition program</a><a href="./work/agency-own-pipeline.html">B2B agency acquisition</a><a href="./work/home-services-rebooking.html">Home-service rebooking</a><a href="./work/recruitment-lead-gen.html">Recruitment lead generation</a><a href="./work.html">Open the complete case library ${arrow}</a></nav></details></section>`;')
p.write_text(s)
p=root/'tools/portfolio-views.mjs';v=p.read_text()
v=v.replace("title:'AI Growth Consultant'","title:'AI Growth Systems & Implementation'").replace('AI growth consulting · High-ticket service businesses','AI integration · Marketing automation · Sales operations').replace('Make AI work on the <em>right business problem.</em>','The right AI.<br><em>Working for growth.</em>')
v=v.replace('I’m an AI growth consultant for high-ticket service businesses. I diagnose the growth bottleneck, prioritize the opportunity and build the campaigns, automations and decision tools around the outcome—not the novelty.','I select, integrate and implement AI solutions for marketing and sales—not just recommend the tools. I connect paid acquisition, voice AI and conversion workflows for high-ticket service businesses, drawing on B2B and B2C experience.')
v=v.replace("schema:'AI growth consultant'","schema:'AI growth systems and implementation specialist'")
v=v.replace('Marketing Strategy & Management','Marketing Operations & Management').replace('Marketing strategy · Team leadership · AI-native execution','Marketing operations · Project management · AI-native execution').replace('Sharper priorities.<br><em>Stronger marketing.</em>','Better operations.<br><em>Stronger results.</em>')
v=v.replace('I turn growth strategy into coordinated campaigns, creative and CRM execution. My specialty is Meta lead generation for high-ticket service businesses, backed by hands-on automation, delivery-team leadership and AI throughout.','I connect marketing strategy, performance creative, paid acquisition and conversion systems—then lead the work from brief to launch. Hands-on automation, team leadership and B2B/B2C experience support my specialty in high-ticket service businesses.')
v=v.replace('See how I lead delivery','See how I lead execution')
v=v.replace("schema:'AI growth systems and implementation specialist'},","schema:'AI growth systems and implementation specialist',close:'Let’s put the right AI<br><em>to work.</em>'},")
v=v.replace("schema:'Growth marketing and automation lead'}","schema:'Growth marketing and automation lead',close:'Better marketing operations.<br><em>Stronger execution.</em>'},\n {path:'ai-operator.html',title:'AI-Native Operator',eyebrow:'AI-native operations · Workflow implementation · Growth systems',headline:'Turn AI capability<br><em>into working systems.</em>',deck:'I connect people, processes and AI to move commercial work from idea to implementation. My background spans B2B and B2C acquisition, marketing operations and hands-on automation for high-ticket service businesses.',primary:'#ai-work',primaryText:'Explore the implementations',schema:'AI-native operator',close:'Build the systems.<br><em>Move the business forward.</em>'}")
v=v.replace('>Performance marketing</a>','>Performance advertising + digital marketing</a>').replace('>AI growth consulting</a>','>AI growth systems</a>').replace('>Marketing management</a>','>Marketing operations + management</a>')
v=v.replace('</a></aside>\';','</a><a href="./ai-operator.html">AI-native operator</a></aside>\';')
v=v.replace("  assert.ok(html.includes('high-ticket service businesses'));","  html=html.replace('Let’s make your next campaign<br><em>hit harder.</em>',v.close);\n  assert.ok(html.includes('high-ticket service businesses'));\n  assert.ok(html.includes(v.eyebrow)&&html.includes(v.headline)&&html.includes(v.deck),'View replacement failed '+v.path);")
p.write_text(v)
for file in ['tools/check-creative-portfolio.mjs','tools/check-live-site.mjs']:
 p=root/file;p.write_text(p.read_text().replace("'marketing-management.html'","'marketing-management.html','ai-operator.html'"))
p=root/'AGENTS.md';p.write_text('''## Final copy and credential sweep — 2026-09-05

Latest expression authority: Career Capital PORTFOLIO_FINAL_SWEEP_2026-09-05.md. Main view is Performance Advertising & Digital Marketing; management is Marketing Operations & Management; AI growth includes integration/implementation; ai-operator.html is a shared-content fourth view. Preserve the approved design and 38-piece collection. No new generated imagery or live-system promises.

Alex requested removal of the separate owner-reported leadership microcopy. B8 is unchanged and its provenance remains in Proof; a source link replaces that front-page label. Capabilities for Slack alerts, keyword branching, review requests, sales-process setup, AI-assisted call analysis, ClickUp and GitHub Projects come from his direct experience statement; no new outcome metric is claimed. New credentials render from proof/credentials.json, sourced to Career Capital CERTIFICATIONS.md. Anthropic items are course certificates, not invented professional licenses. Unknown issuer URLs and degree enrollment are not fabricated. No calls, CRM writes, reviews or messages are triggered by the portfolio.

'''+p.read_text())
p=root/'DESIGN.md';p.write_text(p.read_text()+'''\n\n## Final copy / credentials — 2026-09-05
The accepted reference design remains the control. A compact two-column credentials block uses native details/summary, 44px targets, existing paper/ink/purple, and the existing font roles. The tattoo case spotlight is a text-only re-entry into an unchanged case. Audience views reuse the same gallery/content; only headline, descriptor, opening, CTA and metadata change. No new tracking, asset crop, animation or video.\n''')
print('Applied final sweep')
