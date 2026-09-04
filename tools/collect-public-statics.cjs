// One-time import from the owner's existing public gallery. No Canva edit,
// customer account, generative video, or live call is involved.
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require('/tmp/creative-build/node_modules/playwright');
const sharp=require('/tmp/creative-build/node_modules/sharp');
const {createHash}=require('node:crypto');
const file='tools/portfolio-gallery.json';
(async()=>{
 const manifest=JSON.parse(fs.readFileSync(file,'utf8'));
 if(manifest.referenceStaticReview){console.log('Public static review already captured');return;}
 const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 try{
  await page.route('**/*',route=>{const u=route.request().url();return /\.(mp4|webm)(\?|$)|cloudfront\.net.*hf_/.test(u)?route.abort():route.continue();});
  await page.goto('https://alex-amaro-creative.alexfc10.chatgpt.site/',{waitUntil:'networkidle'});
  const all=await page.locator('.library-card').evaluateAll(es=>es.map((e,i)=>({i,text:e.textContent.replace(/\s+/g,' ').trim(),src:e.querySelector('img')?.getAttribute('src'),alt:e.querySelector('img')?.getAttribute('alt'),title:e.querySelector('.library-caption strong')?.textContent})));
  const candidates=all.filter(a=>a.src&&/Residential cleaning|CareLine AI/i.test(a.text)&&!/video|motion|concept/i.test(a.text)&&!/(\/cl-\d|knee-animation|\/video\/)/i.test(a.src));
  const receipts=[];
  for(const a of candidates){
   await page.locator('.library-card').nth(a.i).click();
   const media=page.locator('.lightbox-media img');await media.waitFor({state:'visible'});
   const url=await media.getAttribute('src');const full=new URL(url,'https://alex-amaro-creative.alexfc10.chatgpt.site/');
   if(full.origin!=='https://alex-amaro-creative.alexfc10.chatgpt.site')throw Error('Unexpected source origin');
   const r=await page.request.get(full.href);if(!r.ok())throw Error('Full-size static failed '+full.pathname);
   const bytes=await r.body(),meta=await sharp(bytes).metadata();
   if(meta.width<400||meta.height<240){receipts.push({sourcePath:full.pathname,status:'excluded-small',width:meta.width,height:meta.height});}
   else {
    const id=(/Residential cleaning/i.test(a.text)?'home-services':'own-brand')+'-'+String(receipts.length+1).padStart(2,'0');
    const dest='assets/portfolio-static/'+id+'.webp';fs.mkdirSync(path.dirname(dest),{recursive:true});const image=await sharp(bytes).rotate().webp({quality:92}).toBuffer();fs.writeFileSync(dest,image);
    manifest.items.push({id,category:id.startsWith('home')?'home':'own',market:id.startsWith('home')?'Residential cleaning':'CareLine',title:a.title||a.text,alt:a.alt||a.text,file:dest,thumb:dest,provenance:'Own-brand creative',source:'Owner-selected public creative gallery; full-size viewer',sourcePath:full.pathname,sha256:createHash('sha256').update(image).digest('hex'),width:meta.width,height:meta.height});
    receipts.push({sourcePath:full.pathname,status:'imported-pending-visual-review',width:meta.width,height:meta.height,file:dest});
   }
   await page.locator('.lightbox-close').click();
  }
  const preferred=['chiro-knee-pain-03','medspa-laser-02','medspa-body-contouring-02',manifest.items.find(x=>x.category==='home')?.id,'b2b-refrigeration-01',manifest.items.find(x=>x.category==='own')?.id,'medspa-botox-01','chiro-knee-pain-02','medspa-laser-05'].filter(Boolean);
  manifest.items.sort((a,b)=>{const ai=preferred.indexOf(a.id),bi=preferred.indexOf(b.id);return(ai<0?100:ai)-(bi<0?100:bi);});
  manifest.referenceStaticReview={date:'2026-09-04',candidates:candidates.length,receipts};fs.writeFileSync(file,JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify(manifest.referenceStaticReview,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
