#!/usr/bin/env node
/** Read-only publication smoke test. No calls, messages, forms or credentials.
 * The deterministic guards do not depend on the network. This separate check
 * waits for Pages and establishes that the public URL serves the committed
 * HTML/CSS, rather than confusing a source commit with a deployed result.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const base='https://alexfc0810.github.io/alex-amaro-portfolio/';
const hash=b=>createHash('sha256').update(b).digest('hex');
const expected=new Map(['index.html','assets/portfolio.css'].map(p=>[p,hash(fs.readFileSync(p))]));
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const started=Date.now();
let last='No HTTP response yet';
while(Date.now()-started<300000){
  try{
    const checked=[];
    for(const [file,want] of expected){
      const url=base+(file==='index.html'?'':file)+'?release='+encodeURIComponent(process.env.GITHUB_SHA||'manual')+'&check='+Date.now();
      const r=await fetch(url,{signal:AbortSignal.timeout(20000),headers:{'Cache-Control':'no-cache'}});
      assert.equal(r.status,200,`${file}: HTTP ${r.status}`);
      const bytes=Buffer.from(await r.arrayBuffer());
      assert.equal(hash(bytes),want,`${file}: Pages has not served this committed version yet`);
      checked.push({file,status:r.status,sha256:want,bytes:bytes.length});
    }
    for(const file of ['claims.json','Alex-Amaro-Resume.pdf','assets/og-v4.png','assets/creative-static/chiro-knee-pain-01-480.webp']){
      const r=await fetch(base+file,{method:'HEAD',signal:AbortSignal.timeout(20000)});
      assert.equal(r.status,200,`${file}: HTTP ${r.status}`);checked.push({file,status:r.status});
    }
    console.log(JSON.stringify({result:'PASS',verifiedAt:new Date().toISOString(),url:base,commit:process.env.GITHUB_SHA||null,checked,phoneCallPlaced:false,crmChanged:false},null,2));
    process.exit(0);
  }catch(e){last=e.message;console.log('Waiting for publication:',last.split('\n')[0]);await pause(8000);}
}
console.error('Live publication not verified:',last);process.exit(1);
