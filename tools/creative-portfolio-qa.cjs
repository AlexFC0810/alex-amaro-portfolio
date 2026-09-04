/* Release QA, not website runtime. Dependencies install outside the repo. */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('/tmp/creative-build/node_modules/playwright');
const sharp=require('/tmp/creative-build/node_modules/sharp');
const ROOT=process.cwd(),OUT='/tmp/creative-portfolio-review';
fs.mkdirSync(OUT,{recursive:true});fs.mkdirSync('_review/packs',{recursive:true});
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.svg':'image/svg+xml','.pdf':'application/pdf'};
const server=http.createServer((req,res)=>{try{let u=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(u.startsWith('/alex-amaro-portfolio/'))u=u.slice('/alex-amaro-portfolio'.length);let f=path.resolve(ROOT,'.'+u);if(!f.startsWith(ROOT+path.sep)&&f!==ROOT){res.writeHead(403);return res.end();}if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f)){res.writeHead(404);return res.end('Not found');}res.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);}catch(e){res.writeHead(500);res.end();}});
const report={date:'2026-09-04',checks:[],failures:[],phoneCallPlaced:false,crmChanged:false,privateClaimsSweep:'Not run: private pattern configuration not present in this public release environment.',manualVisualReview:'Pending review of captured images.'};
const check=(ok,message)=>{if(!ok)report.failures.push(message);};
const packetIndex=[];
async function packet(name,file,width=720){const buf=await sharp(file).resize({width,withoutEnlargement:true}).avif({quality:24,effort:6,chromaSubsampling:'4:4:4'}).toBuffer();const b64=buf.toString('base64'),parts=[];for(let i=0;i<b64.length;i+=6000){const f=`_review/packs/${name}-${String(i/6000+1).padStart(2,'0')}.txt`;fs.writeFileSync(f,b64.slice(i,i+6000));parts.push(f);}packetIndex.push({name,width,bytes:buf.length,parts});}
(async()=>{
 await new Promise(r=>server.listen(8791,'127.0.0.1',r));const browser=await chromium.launch({headless:true});
 try{
  // Claim-free social preview, rendered from the committed HTML source.
  const og=await browser.newPage({viewport:{width:1200,height:630}});await og.goto('http://127.0.0.1:8791/assets/og-creative-first.html',{waitUntil:'networkidle'});await og.evaluate(()=>document.fonts.ready);await og.screenshot({path:'assets/og-creative-first.png'});await packet('social','assets/og-creative-first.png',700);await og.close();
  if(fs.existsSync('_review/reference-desktop.jpg'))await packet('reference','_review/reference-desktop.jpg',720);
  const manifest=JSON.parse(fs.readFileSync('tools/portfolio-gallery.json','utf8'));
  report.staticCreatives=manifest.items.length;report.newOwnBrandStatics=manifest.items.filter(x=>x.file.startsWith('assets/portfolio-static/')).length;
  for(const [w,h] of [[375,812],[760,900],[1440,900]]){
   const context=await browser.newContext({viewport:{width:w,height:h},reducedMotion:'reduce',hasTouch:w===375});const page=await context.newPage();const external=[],bad=[],errors=[];
   page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith('http://127.0.0.1:8791/'))external.push(r.url());});page.on('response',r=>{if(r.status()>=400)bad.push(r.url()+':'+r.status());});page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:8791/alex-amaro-portfolio/',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   check(await page.locator('h1').count()===1,'one h1 '+w);check(await page.locator('video,iframe').count()===0,'no videos or embeds '+w);
   check((await page.locator('.hero-deck').innerText()).includes('I specialize in Meta paid social.'),'direct hero copy '+w);
   check((await page.locator('.experience-line').innerText()).includes('6+ years in online business'),'experience '+w);
   const tel=await page.locator('a[href^="tel:"]').evaluateAll(es=>es.map(x=>x.getAttribute('href')));check(tel.length>=3&&tel.every(x=>x==='tel:+18888147785'),'phone links '+w);
   await page.addScriptTag({content:fs.readFileSync('_audit/measure.js','utf8')});const measured=await page.evaluate(()=>window.__auditMeasure());
   const over=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth,offenders:[...document.querySelectorAll('body *')].filter(x=>x.getBoundingClientRect().right>innerWidth+2&&getComputedStyle(x).position!=='fixed'&&!x.closest('.library-rail')).slice(0,8).map(x=>({tag:x.tagName,cls:x.className,right:x.getBoundingClientRect().right}))}));
   check(over.scroll<=over.client,'horizontal overflow '+w+': '+JSON.stringify(over));check(measured.tap.under44===0,'small targets '+w+': '+JSON.stringify(measured.tap.offenders));check(measured.text.below45===0,'contrast '+w+': '+JSON.stringify(measured.text.offenders));
   const screenshot=async(name,locator)=>{const f=path.join(OUT,name+'.png');if(locator)await locator.screenshot({path:f});else await page.screenshot({path:f});return f;};
   if(w===375||w===1440){const f=await screenshot('hero-'+w);await packet('hero-'+w,f,w===375?375:720);}
   await page.locator('#work').scrollIntoViewIfNeeded();await page.locator('.library-card').first().waitFor({state:'visible'});
   if(w===375||w===1440){const f=await screenshot('gallery-'+w);await packet('gallery-'+w,f,w===375?375:720);}
   const first=page.locator('.library-card').first();await first.click();check(await page.locator('#creative-dialog').evaluate(e=>e.open),'dialog opens '+w);const initial=await page.locator('#lightbox-count').innerText();await page.locator('[data-image-direction="1"]').click();check((await page.locator('#lightbox-count').innerText())!==initial,'next creative '+w);await page.keyboard.press('ArrowLeft');check((await page.locator('#lightbox-count').innerText())===initial,'keyboard previous '+w);
   if(w===375){await page.locator('.lightbox-media').evaluate(el=>{for(const [type,x,y] of [['touchstart',270,180],['touchend',80,185]]){const e=new Event(type,{bubbles:true});Object.defineProperty(e,'changedTouches',{value:[{clientX:x,clientY:y}]});el.dispatchEvent(e);}});check((await page.locator('#lightbox-count').innerText())!==initial,'lightbox swipe');}
   await page.keyboard.press('Escape');check(!await page.locator('#creative-dialog').evaluate(e=>e.open),'escape closes '+w);
   await page.locator('[data-filter="b2b"]').click();check(await page.locator('.library-card:visible').count()===manifest.items.filter(x=>x.category==='b2b').length,'filter '+w);await page.locator('[data-filter="all"]').click();await page.locator('#view-toggle').click();check(await page.locator('#gallery').evaluate(e=>e.classList.contains('gallery-grid')),'view all '+w);await page.locator('#view-toggle').click();
   await page.locator('#voice').scrollIntoViewIfNeeded();if(w===375||w===1440){const f=await screenshot('voice-'+w,page.locator('.voice-layout'));await packet('voice-'+w,f,w===375?375:850);}
   if(w===375){const f=await screenshot('phone-375',page.locator('.voice-call'));await packet('phone-375',f,375);await page.locator('.menu-toggle').click();check(await page.locator('#nav-links').isVisible(),'mobile nav');await page.locator('#nav-links a[href="#voice"]').click();check(await page.locator('.menu-toggle').getAttribute('aria-expanded')==='false','nav closes after link');}
   await page.locator('footer').scrollIntoViewIfNeeded();
   const broken=await page.locator('img').evaluateAll(es=>es.filter(e=>e.getAttribute('src')&&e.complete&&e.naturalWidth===0).map(e=>e.getAttribute('src')));
   check(broken.length===0,'broken images '+w+': '+JSON.stringify(broken));check(external.length===0,'off-origin resources '+w+': '+JSON.stringify(external));check(bad.length===0,'failed resources '+w+': '+JSON.stringify(bad));check(errors.length===0,'browser errors '+w+': '+JSON.stringify(errors));
   report.checks.push({viewport:[w,h],measured,overflow:over.scroll>over.client,phoneLinks:tel.length,externalResources:external,failedResources:bad,browserErrors:errors,galleryInteractions:true});await context.close();
  }
  const nojs=await browser.newContext({viewport:{width:375,height:812},javaScriptEnabled:false,reducedMotion:'reduce'});const page=await nojs.newPage();await page.goto('http://127.0.0.1:8791/alex-amaro-portfolio/',{waitUntil:'networkidle'});check(await page.locator('#voice').isVisible(),'voice visible without JS');check(await page.locator('.library-card').count()===manifest.items.length,'all gallery anchors without JS');report.noJavaScript={voiceVisible:await page.locator('#voice').isVisible(),galleryAnchors:await page.locator('.library-card').count()};await page.goto('http://127.0.0.1:8791/alex-amaro-portfolio/creative.html',{waitUntil:'networkidle'});check(await page.locator('video').count()===0,'standalone collection has no videos');await nojs.close();
  // Public imported statics: review each at readable size, not an uninspected tile dump.
  for(const item of manifest.items.filter(x=>x.file.startsWith('assets/portfolio-static/')))await packet('asset-'+item.id,item.file,640);
 }catch(e){report.failures.push(e.stack||e.message);}
 finally{await browser.close();server.close();report.passed=report.failures.length===0;fs.mkdirSync('_audit/releases',{recursive:true});fs.writeFileSync('_audit/releases/2026-09-04-creative-first.json',JSON.stringify(report,null,2)+'\n');fs.writeFileSync('_review/packs/index.json',JSON.stringify(packetIndex,null,2)+'\n');console.log(JSON.stringify(report,null,2));}
})().catch(e=>{console.error(e);server.close();process.exit(1);});
