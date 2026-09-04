// One-time read of the owner's public static collection. Does not call the AI,
// edit Canva, import motion, or infer an asset URL that was not in the source.
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require('/tmp/creative-build/node_modules/playwright');
const sharp=require('/tmp/creative-build/node_modules/sharp');
const {createHash}=require('node:crypto');
const file='tools/portfolio-gallery.json',origin='https://alex-amaro-creative.alexfc10.chatgpt.site';
(async()=>{
 const manifest=JSON.parse(fs.readFileSync(file,'utf8'));if(manifest.referenceStaticReview){console.log('Public static review already captured');return;}
 const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 try{
  await page.route('**/*',route=>/\.(mp4|webm)(\?|$)/.test(route.request().url())?route.abort():route.continue());
  await page.goto(origin+'/',{waitUntil:'networkidle'});
  const all=await page.locator('.library-card').evaluateAll(es=>es.map(e=>({text:e.textContent.replace(/\s+/g,' ').trim(),src:e.querySelector('img')?.getAttribute('src'),srcset:e.querySelector('img')?.getAttribute('srcset')||'',alt:e.querySelector('img')?.getAttribute('alt'),title:e.querySelector('.library-caption strong')?.textContent})));
  const candidates=all.filter(a=>a.src&&/Residential cleaning|CareLine AI/i.test(a.text)&&!/video|motion|concept/i.test(a.text)&&!/(\/cl-\d|knee-animation|\/video\/)/i.test(a.src));
  const source=await page.content();const scripts=[...new Set([...source.matchAll(/(?:src=|import\()["']([^"']+\.js)["']/g)].map(m=>m[1]))];
  let compiled='';for(const u of scripts){const full=new URL(u,origin);if(full.origin!==origin)continue;const r=await page.request.get(full.href);if(r.ok())compiled+='\n'+await r.text();}
  const imagePaths=[...new Set([...compiled.matchAll(/["'](\/[^"'\s]+\.(?:webp|jpg|png|jpeg))["']/g)].map(m=>m[1]))];
  const key=s=>path.basename(new URL(s,origin).pathname).replace(/\.(webp|jpe?g|png)$/,'').replace(/[-_](thumb|small|320|480|640|720|1080|1200|1600)$/,'');
  const receipts=[];
  for(const a of candidates){
   const options=[...new Set([a.src,...a.srcset.split(',').map(s=>s.trim().split(/\s+/)[0]).filter(Boolean),...imagePaths.filter(p=>key(p)===key(a.src))])];let best=null;
   for(const u of options){const full=new URL(u,origin);if(full.origin!==origin)continue;try{const r=await page.request.get(full.href);if(!r.ok())continue;const bytes=await r.body(),meta=await sharp(bytes).metadata();if(!best||meta.width*meta.height>best.meta.width*best.meta.height)best={full,bytes,meta};}catch(e){}}
   if(!best||best.meta.width<400||best.meta.height<240){receipts.push({title:a.title,sourcePath:a.src,status:'excluded-small-or-unavailable',options,width:best?.meta.width,height:best?.meta.height});continue;}
   const {full,bytes,meta}=best;const id=(/Residential cleaning/i.test(a.text)?'home-services':'own-brand')+'-'+String(receipts.length+1).padStart(2,'0');
   const dest='assets/portfolio-static/'+id+'.webp';fs.mkdirSync(path.dirname(dest),{recursive:true});const image=await sharp(bytes).rotate().webp({quality:92}).toBuffer();fs.writeFileSync(dest,image);
   manifest.items.push({id,category:id.startsWith('home')?'home':'own',market:id.startsWith('home')?'Residential cleaning':'CareLine',title:a.title||a.text,alt:a.alt||a.text,file:dest,thumb:dest,provenance:'Own-brand creative',source:'Owner-selected public creative gallery',sourcePath:full.pathname,sha256:createHash('sha256').update(image).digest('hex'),width:meta.width,height:meta.height});
   receipts.push({sourcePath:full.pathname,status:'imported-pending-visual-review',width:meta.width,height:meta.height,file:dest});
  }
  const preferred=['chiro-knee-pain-03','medspa-laser-02','medspa-body-contouring-02',manifest.items.find(x=>x.category==='home')?.id,'b2b-refrigeration-01',manifest.items.find(x=>x.category==='own')?.id,'medspa-botox-01','chiro-knee-pain-02','medspa-laser-05'].filter(Boolean);
  manifest.items.sort((a,b)=>{const ai=preferred.indexOf(a.id),bi=preferred.indexOf(b.id);return(ai<0?100:ai)-(bi<0?100:bi);});
  manifest.referenceStaticReview={date:'2026-09-04',candidates:candidates.length,receipts};fs.writeFileSync(file,JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify(manifest.referenceStaticReview,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
