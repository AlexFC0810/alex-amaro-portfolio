#!/usr/bin/env node
// Read-only publication receipt. Never calls, messages, books or uses credentials.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const base='https://alexfc0810.github.io/alex-amaro-portfolio/';
const hash=b=>createHash('sha256').update(b).digest('hex');
const files=['index.html','ai-growth.html','marketing-management.html','creative.html','assets/portfolio.css','assets/portfolio.js','assets/og-creative-first.png'];
const expected=new Map(files.map(p=>[p,hash(fs.readFileSync(p))]));
const home=fs.readFileSync('index.html','utf8');
for(const id of ['voice','ai-work','fit','work']) assert.ok(home.includes(`id="${id}"`),'Missing public deep-link anchor '+id);
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const started=Date.now();let last='No response';
while(Date.now()-started<300000){
 try{
  const checked=[];
  for(const [file,want] of expected){
   const url=base+(file==='index.html'?'':file)+'?release='+encodeURIComponent(process.env.GITHUB_SHA||'manual')+'&check='+Date.now();
   const r=await fetch(url,{signal:AbortSignal.timeout(20000),headers:{'Cache-Control':'no-cache'}});
   assert.equal(r.status,200,file+': HTTP '+r.status);
   const bytes=Buffer.from(await r.arrayBuffer());assert.equal(hash(bytes),want,file+': committed version not served yet');
   checked.push({file,status:r.status,sha256:want,bytes:bytes.length});
  }
  const items=JSON.parse(fs.readFileSync('tools/portfolio-gallery.json','utf8')).items;
  const samples=[...new Set(['claims.json','Alex-Amaro-Resume.pdf','work.html','model.html','proof.html',items[0].thumb,...items.filter(x=>x.file.startsWith('assets/portfolio-static/')).map(x=>x.file)])];
  for(const file of samples){const r=await fetch(base+file,{method:'HEAD',signal:AbortSignal.timeout(20000)});assert.equal(r.status,200,file+': HTTP '+r.status);checked.push({file,status:r.status});}
  console.log(JSON.stringify({result:'PASS',verifiedAt:new Date().toISOString(),url:base,commit:process.env.GITHUB_SHA||null,staticCreatives:items.length,checked,anchors:['voice','ai-work','fit','work'],phoneCallPlaced:false,crmChanged:false},null,2));process.exit(0);
 }catch(e){last=e.message;console.log('Waiting for publication:',last.split('\n')[0]);await pause(8000);}
}
console.error('Publication not verified:',last);process.exit(1);
