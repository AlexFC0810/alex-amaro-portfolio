from pathlib import Path
import json,hashlib
root=Path.cwd()
r=root/'tools/build-creative-portfolio.mjs';s=r.read_text()
def once(a,b):
 global s
 assert s.count(a)==1,(a[:100],s.count(a))
 s=s.replace(a,b)
once("import {createHash} from 'node:crypto';", "import {createHash} from 'node:crypto';\nimport {aiWork, aiWorkCSS} from './portfolio-ai-work.mjs';")
once("const heroIds=['chiro-knee-pain-03','medspa-laser-02','medspa-body-contouring-02',gallery.find(x=>x.category==='home')?.id||'medspa-laser-05'];", "const heroIds=JSON.parse(read('tools/portfolio-gallery.json')).hero;\nassert.ok(heroIds.length===4&&heroIds.every(id=>gallery.some(x=>x.id===id)),'Invalid curated hero');")
once('results+voice+system+video+about+closing','results+voice+aiWork+system+video+about+closing')
once('<div class="model-link"><p>See how I think about the economics after the click.</p><a class="text-link" href="./model.html">Explore the interactive growth model ${arrow}</a><small>Illustrative scenarios, not a claim about client revenue.</small></div>','')
once('@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{animation:none!important;transition:none!important}}','${aiWorkCSS}\n@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{animation:none!important;transition:none!important}}')
once("document.getElementById('lightbox-description').textContent=x.alt;", "document.getElementById('lightbox-description').textContent=x.context||x.alt;image.style.maxWidth=Math.min(x.width,900)+'px';")
once('<span id="lightbox-context"></span>','<span id="lightbox-context"></span><p id="lightbox-disclosure" class="lightbox-disclosure"></p>')
once("document.getElementById('lightbox-file').href='./'+x.file;", "document.getElementById('lightbox-file').href='./'+x.file;document.getElementById('lightbox-disclosure').textContent=x.disclosure||'';")
once('/* Owner-approved creative-first revision. Reference typography and palette retained. */','/* Owner-approved creative-first revision. Reference typography and palette retained. */\n.lightbox-copy .lightbox-disclosure{font-size:12px;line-height:1.5;color:var(--ink-soft);letter-spacing:0;font-weight:400;text-transform:none}')
r.write_text(s)
mf=root/'tools/portfolio-gallery.json';m=json.loads(mf.read_text());original=m['items']
removed=[x['id'] for x in original if x['id'].startswith('b2b-refrigeration-') or x['id'] in ['medspa-laser-02','medspa-body-contouring-02']]
assert len(removed)==7, 'Refresh curation scope before editing'
m['items']=[x for x in original if x['id'] not in removed]
new=[{'id':'laser-treatment-canva','market':'Laser hair removal','name':'laser-treatment','title':'Put the treatment in the frame','alt':'Laser hair-removal static creative showing a practitioner holding the treatment device, with a first-session offer.','context':'Treatment-led creative: a clear view of the service, a visible entry offer and a short benefit hierarchy.','redacted':False,'sha256':'ddf9892163f3ea13564cef3185fab62b3e49e2520b2414fb5bddc0cf6cdbbc8e'}, {'id':'body-treatment-canva','market':'Body contouring','name':'body-treatment','title':'Make the treatment tangible','alt':'Body-contouring static creative showing a treatment in progress beside a new-client offer and service benefits.','context':'Procedure-led creative: lead with the treatment, then make the introductory offer easy to scan.','redacted':True,'sha256':'310de18b505f2f9f66d3901e13c66aecf6b764d6964bc5b19b63d18d1372b1af'}]
for x in new:
 f='assets/portfolio-static/'+x['name']+'-canva.avif'
 assert hashlib.sha256((root/f).read_bytes()).hexdigest()==x['sha256'],'Approved artwork bytes changed'
 m['items'].append({'id':x['id'],'category':'health','market':x['market'],'title':x['title'],'alt':x['alt'],'context':x['context'],'file':f,'thumb':f,'provenance':'Client creative','source':'Visually selected original Canva page preview; private source receipt retained','width':447,'height':447,'sha256':x['sha256'],'disclosure':('Portfolio copy: identifying logo removed. ' if x['redacted'] else '')+'Original Canva page preview; historical offer artwork. No per-image performance claim.'})
order=['chiro-knee-pain-03','laser-treatment-canva','body-treatment-canva','home-services-offer','own-brand-comparison','medspa-laser-05','medspa-body-contouring-04','medspa-botox-01','chiro-knee-pain-02']
m['items'].sort(key=lambda x:order.index(x['id']) if x['id'] in order else 100)
m['hero']=['chiro-knee-pain-03','laser-treatment-canva','body-treatment-canva','home-services-offer']
m['curation']={'date':'2026-09-04','reviewed_original_pages':23,'added_original_selections':2,'removed_from_active_gallery':removed,'note':'Visual selection is an editorial judgment, not a finding of ad performance. Refrigeration results/case pages and original assets are preserved; imagery is withdrawn from active creative presentation. New selections retain native 447px preview size; no high-resolution export or AI upscale is claimed.'}
mf.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
check=root/'tools/check-creative-portfolio.mjs';c=check.read_text();c=c.replace("const home=fs.readFileSync('index.html','utf8');", "assert.ok(!ids.some(id=>id.startsWith('b2b-refrigeration-')),'Withdrawn refrigeration imagery returned');\nassert.ok(manifest.hero.every(id=>ids.includes(id)),'Curated hero drift');\nconst home=fs.readFileSync('index.html','utf8');\nassert.ok(home.includes('id=\"ai-work\"'),'AI work example missing');\nassert.ok(home.includes('not connected to my private inbox'),'AI walkthrough scope missing');")
check.write_text(c)
a=root/'AGENTS.md';t=a.read_text();t+='\n## Static curation and AI-work implementation — 2026-09-04\n\nThe active gallery intentionally excludes refrigeration imagery and the superseded laser/body hero choices. Original case results and historical image files remain intact. Hero IDs now live in tools/portfolio-gallery.json; do not silently restore hard-coded choices. Two new Canva page-preview selections are capped at their native 447px size in the viewer. The body-contouring logo is removed solely for client privacy and disclosed in the viewer. These are not full-resolution exports or newly generated ads.\n\nAI examples are rendered from tools/portfolio-ai-work.mjs. The opportunity workflow is described from inspected source code (rule-based fit, AI-assisted drafting with labelled fallback, human review), not represented as an active private inbox connection. The economic model remains illustrative calculation, not client revenue or a live AI call. No new audience-specific sites, outbound actions or CRM mutations are implied.\n';a.write_text(t)
d=root/'DESIGN.md';t=d.read_text();t+='\n\n## Static curation / AI work — 2026-09-04\n\nPreserve the approved cream/purple design, headline and operator copy. The new two-card AI-work module uses the same ink/paper/purple tokens, 1px borders, 16px body, 12–13px supporting labels and 48px native disclosure summary. It documents two concrete builds rather than reinstating the rejected console screenshot. Native disclosure works without JavaScript. The image viewer does not upscale preview-resolution Canva selections; the relevant privacy/source note remains visible on mobile. No new font, palette, autoplay, remote resource or tracking.\n';d.write_text(t)
print('Gallery:',len(m['items']),'Withdrawn:',removed)
