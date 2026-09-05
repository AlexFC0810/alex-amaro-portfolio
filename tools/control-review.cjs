const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('/tmp/control-qa/node_modules/playwright');
const ROOT=process.cwd(),OUT='/tmp/control-review';fs.mkdirSync(OUT,{recursive:true});
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.woff2':'font/woff2','.avif':'image/avif','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.pdf':'application/pdf'};
const server=http.createServer((req,res)=>{try{let p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(p.startsWith('/alex-amaro-portfolio/'))p=p.slice('/alex-amaro-portfolio'.length);let f=path.resolve(ROOT,'.'+p);if(!f.startsWith(ROOT+path.sep)&&f!==ROOT){res.writeHead(403);return res.end();}if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f)){res.writeHead(404);return res.end();}res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);}catch(e){res.writeHead(500);res.end();}});
(async()=>{await new Promise(r=>server.listen(8791,'127.0.0.1',r));const browser=await chromium.launch({headless:true});const report={control:'20435edca5bf7b201b5994ab4d6043814c597dfb',date:'2026-09-04',kind:'Editorial refinement; not measured conversion testing',checks:[],phoneCallPlaced:false,crmChanged:false,privatePatternSweep:false,manualVisualReview:'Pending screenshot inspection'};
try{
const items=JSON.parse(fs.readFileSync('tools/portfolio-gallery.json')).items;assert.equal(items.length,38);
for(const [file,w,h] of [['index.html',375,812],['index.html',760,900],['index.html',1440,900],['ai-growth.html',375,812],['ai-growth.html',1440,900],['marketing-management.html',375,812],['marketing-management.html',1440,900],['creative.html',375,812]]){
 const ctx=await browser.newContext({viewport:{width:w,height:h},reducedMotion:'reduce'}),p=await ctx.newPage(),bad=[],errors=[],external=[];
 p.on('response',r=>{if(r.status()>=400)bad.push(r.url());});p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith('http://127.0.0.1:8791/'))external.push(r.url());});
 await p.goto('http://127.0.0.1:8791/alex-amaro-portfolio/'+file,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 assert.equal(await p.locator('h1').count(),1);assert.equal(await p.locator('video,iframe').count(),0);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth===document.documentElement.clientWidth),'overflow '+file+'/'+w);
 await p.addScriptTag({content:fs.readFileSync('_audit/measure.js','utf8')});const audit=await p.evaluate(()=>window.__auditMeasure());assert.equal(audit.tap.under44,0,'small targets '+file+'/'+w+JSON.stringify(audit.tap));assert.equal(audit.text.below45,0,'contrast '+file+'/'+w+JSON.stringify(audit.text));
 const tel=await p.locator('a[href^="tel:"]').evaluateAll(es=>es.map(e=>e.getAttribute('href')));assert.ok(tel.length&&tel.every(x=>x==='tel:+18888147785'));
 const name=file.replace('.html','')+'-'+w;await p.screenshot({path:path.join(OUT,name+'.png')});
 if(file!=='creative.html'){
  assert.ok((await p.locator('.experience-line').innerText()).includes('Digital marketing since 2020'));
  assert.ok((await p.locator('.hero-deck').innerText()).includes('high-ticket service businesses'));
  assert.equal(await p.locator('link[rel="canonical"]').getAttribute('href'),'https://alexfc0810.github.io/alex-amaro-portfolio/'+(file==='index.html'?'':file));
 }
 if(file==='index.html'){
  for(const id of ['weight','tattoo','laser']){await p.locator('[data-filter="'+id+'"]').click();assert.equal(await p.locator('.library-card:not([hidden])').count(),items.filter(x=>x.category===id).length);}
  await p.locator('[data-filter="all"]').click();await p.locator('[data-gallery-id="tattoo-01"]').click();assert.ok(await p.locator('#creative-dialog').evaluate(x=>x.open));await p.locator('#lightbox-image').evaluate(x=>x.decode());assert.ok(await p.locator('#lightbox-image').evaluate(x=>x.getBoundingClientRect().width<=447.1));assert.ok((await p.locator('#lightbox-description').innerText()).includes('masked'));
  await p.locator('[data-image-direction="1"]').click();await p.keyboard.press('ArrowLeft');await p.keyboard.press('Escape');assert.ok(!await p.locator('#creative-dialog').evaluate(x=>x.open));
  await p.locator('#view-toggle').click();assert.ok(await p.locator('#gallery').evaluate(x=>x.classList.contains('gallery-grid')));await p.locator('#view-toggle').click();
  if(w===375){await p.locator('.menu-toggle').click();await p.locator('#nav-links a[href="#voice"]').click();assert.equal(await p.locator('.menu-toggle').getAttribute('aria-expanded'),'false');}
  if(w===375||w===1440){await p.addStyleTag({content:'.site-nav{position:relative!important}'});for(const [part,sel] of [['gallery','#work'],['bookings','.booking-pattern'],['automation','#voice'],['management','#fit']]){await p.locator(sel).screenshot({path:path.join(OUT,part+'-'+w+'.png')});}}
 }
 await p.locator('footer').scrollIntoViewIfNeeded();const broken=await p.locator('img[src]').evaluateAll(es=>es.filter(e=>e.complete&&e.naturalWidth===0).map(e=>e.src));assert.deepEqual(broken,[]);assert.deepEqual(bad,[]);assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 report.checks.push({file,viewport:[w,h],smallTargets:0,contrastFailures:0,overflow:false,failedResources:0,externalRequests:0,phoneLinks:tel.length});await ctx.close();
}
const ctx=await browser.newContext({viewport:{width:375,height:812},javaScriptEnabled:false}),p=await ctx.newPage();await p.goto('http://127.0.0.1:8791/index.html');assert.ok(await p.locator('#voice').isVisible());assert.equal(await p.locator('.library-card').count(),38);assert.ok(await p.locator('.leadership-proof').isVisible());report.noJavaScript={voiceVisible:true,galleryAnchors:38,leadershipVisible:true};await ctx.close();
report.passed=true;fs.mkdirSync('_audit/releases',{recursive:true});fs.writeFileSync('_audit/releases/2026-09-04-control-refinement.json',JSON.stringify(report,null,2)+'\n');fs.writeFileSync(path.join(OUT,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();server.close();}
})().catch(e=>{console.error(e.stack);server.close();process.exit(1)});
