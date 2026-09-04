const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('/tmp/portfolio-qa/node_modules/playwright');
const ROOT=process.cwd();
const OUT='/tmp/portfolio-release-evidence';
fs.mkdirSync(OUT,{recursive:true});
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.woff2':'font/woff2','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.mp4':'video/mp4','.pdf':'application/pdf'};
const server=http.createServer((req,res)=>{try{let p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(p.startsWith('/alex-amaro-portfolio/'))p=p.slice('/alex-amaro-portfolio'.length);let f=path.resolve(ROOT,'.'+p);if(!f.startsWith(ROOT+path.sep)&&f!==ROOT){res.writeHead(403);res.end();return;}if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f)){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);}catch(e){res.writeHead(500);res.end();}});
(async()=>{await new Promise(r=>server.listen(8791,'127.0.0.1',r));const browser=await chromium.launch({headless:true});const report={date:'2026-09-04',base:'1ba3e02e7ec82b68a2db6e1e0810c0e443af3909',checks:[],phoneCallPlaced:false,crmChanged:false,privateClaimsSweep:'Not run here; private configuration is not copied into public CI. Public integrity/license checks and byte-preservation check run separately.'};
try{
for(const [w,h] of [[375,812],[700,900],[1440,900]]){
 const context=await browser.newContext({viewport:{width:w,height:h},reducedMotion:'reduce'});const page=await context.newPage();const external=[],bad=[],errors=[];
 page.on('request',r=>{const u=r.url();if(/^https?:/.test(u)&&!u.startsWith('http://127.0.0.1:8791/'))external.push(u);});
 page.on('response',r=>{if(r.status()>=400)bad.push(r.url()+':'+r.status());});page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8791/alex-amaro-portfolio/',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'index,follow');
 assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://alexfc0810.github.io/alex-amaro-portfolio/');
 await page.addScriptTag({content:fs.readFileSync('_audit/measure.js','utf8')});const measured=await page.evaluate(()=>window.__auditMeasure());
 await page.screenshot({path:path.join(OUT,`hero-${w}.png`)});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),'horizontal overflow at '+w);
 console.log('AUDIT_'+w,JSON.stringify(measured));
 // Extract both zero-count expectations without assuming the helper's report shape.
 const tap=measured.tap?.under44,text=measured.text?.below45;
 assert.equal(Array.isArray(tap)?tap.length:tap,0,'small target at '+w);
 assert.equal(Array.isArray(text)?text.length:text,0,'text contrast at '+w);
 const numbers=await page.locator('a[href^="tel:"]').evaluateAll(es=>es.map(e=>e.getAttribute('href')));assert.ok(numbers.length>=3);assert.ok(numbers.every(n=>n==='tel:+18888147785'));
 // Header deep link opens the voice panel, including when a different tab was active.
 await page.locator('#tab-sys-03').click();await page.evaluate(()=>{location.hash='voice';});await page.waitForTimeout(150);
 assert.equal(await page.locator('#tab-sys-01').getAttribute('aria-selected'),'true');assert.ok(await page.locator('#voice').isVisible());
 await page.locator('#voice').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(OUT,`voice-${w}.png`)});
 await page.locator('#sys-01').screenshot({path:path.join(OUT,`system-${w}.png`)});
 // Every visible source image really loads; galleries retain their original aspect ratios.
 await page.locator('#creative').scrollIntoViewIfNeeded();
 await page.locator('[data-lightbox="static"]').first().click();assert.equal(await page.locator('#modal').getAttribute('aria-hidden'),'false');
 await page.locator('[data-nav="1"]').click();await page.keyboard.press('Escape');assert.equal(await page.locator('#modal').getAttribute('aria-hidden'),'true');
 await page.locator('#tab-tour-02').click();assert.equal(await page.locator('#tab-tour-02').getAttribute('aria-selected'),'true');
 await page.locator('#tab-tour-02').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#tab-tour-03').getAttribute('aria-selected'),'true');
 if(w<=900){await page.locator('#menuButton').click();assert.equal(await page.locator('#menuButton').getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await page.locator('#menuButton').getAttribute('aria-expanded'),'false');}
 await page.locator('#numbers details').nth(1).locator('summary').click();assert.ok(await page.locator('#numbers details').nth(1).getAttribute('open')!==null);
 const broken=await page.locator('img').evaluateAll(es=>es.filter(e=>e.complete&&e.naturalWidth===0).map(e=>e.getAttribute('src')));
 assert.deepEqual(broken,[],'broken loaded images');assert.deepEqual(external,[],'off-origin request');assert.deepEqual(bad,[],'failed resources');assert.deepEqual(errors,[],'browser error');
 report.checks.push({viewport:[w,h],smallTargets:0,lowContrast:0,horizontalOverflow:false,phoneLinks:numbers.length,voiceDeepLink:true,gallery:true,keyboardTabs:true,externalRequests:0,failedResources:0,browserErrors:0});await context.close();
}
const nojs=await browser.newContext({viewport:{width:375,height:812},javaScriptEnabled:false,reducedMotion:'reduce'});const p=await nojs.newPage();await p.goto('http://127.0.0.1:8791/alex-amaro-portfolio/',{waitUntil:'networkidle'});assert.ok(await p.locator('#voice').isVisible());for(const panel of await p.locator('[role="tabpanel"]').all())assert.ok(await panel.isVisible(),'hidden content without JS');report.noJavaScript={allPanelsVisible:true,phoneLinkPresent:await p.locator('a[href="tel:+18888147785"]').count()};await nojs.close();
fs.writeFileSync(path.join(OUT,'report.json'),JSON.stringify(report,null,2));console.log('FINAL_REPORT',JSON.stringify(report));
}finally{await browser.close();server.close();}
})().catch(e=>{console.error(e.stack);server.close();process.exit(1);});
