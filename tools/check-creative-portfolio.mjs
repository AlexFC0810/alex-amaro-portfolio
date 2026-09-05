#!/usr/bin/env node
// Deterministic guard for the owner-approved portfolio scope. No network.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const manifest=JSON.parse(fs.readFileSync('tools/portfolio-gallery.json','utf8'));
const ids=manifest.items.map(x=>x.id);
assert.equal(new Set(ids).size,ids.length,'Duplicate gallery id');
assert.equal(new Set(manifest.items.map(x=>x.file)).size,ids.length,'Duplicate gallery file');
const imported=manifest.items.filter(x=>x.sha256);
assert.equal(new Set(imported.map(x=>x.sha256)).size,imported.length,'Duplicate imported artwork');
for(const x of manifest.items){
 assert.ok(fs.existsSync(x.file)&&fs.existsSync(x.thumb),'Missing creative file '+x.id);
 assert.ok(!/\.(mp4|webm|mov)$/i.test(x.file),'Video entered the static manifest');
 if(x.sha256) assert.equal(createHash('sha256').update(fs.readFileSync(x.file)).digest('hex'),x.sha256,'Changed imported artwork '+x.id);
}
for(const file of ['index.html','creative.html']){
 const html=fs.readFileSync(file,'utf8');
 assert.ok(!/<(?:video|iframe)\b/i.test(html),file+': unexpected embedded media');
 assert.ok(!/data-video=|\.mp4(?:["?])|\.webm(?:["?])/.test(html),file+': unexpected video link');
 const rendered=[...html.matchAll(/data-gallery-id="([^"]+)"/g)].map(x=>x[1]);
 assert.deepEqual(rendered,ids,file+': gallery drift');
 assert.ok(html.includes('Available on request.'),file+': video request section missing');
 const tel=[...html.matchAll(/href="(tel:[^"]+)"/g)].map(x=>x[1]);
 assert.ok(tel.length>0&&tel.every(x=>x==='tel:+18888147785'),file+': wrong demo number');
}
assert.ok(!ids.some(id=>id.startsWith('b2b-refrigeration-')),'Withdrawn refrigeration imagery returned');
assert.ok(manifest.hero.every(id=>ids.includes(id)),'Curated hero drift');
const home=fs.readFileSync('index.html','utf8');
assert.ok(home.includes('id="ai-work"'),'AI work example missing');
assert.ok(home.includes('not connected to my private inbox'),'AI walkthrough scope missing');
assert.ok(home.includes('I specialize in Meta lead generation for high-ticket service businesses'),'First-person specialization missing');
assert.ok(home.includes('Online business since 2018 · Client marketing since 2022'),'Biography drift');
assert.ok(home.includes('AI-native performance marketer with an operator’s brain'),'AI-native operator framing missing');
assert.ok(home.includes('AI throughout.'),'AI-across-work framing missing');
assert.ok(home.includes('id="voice"'),'Demo anchor missing');
assert.ok(home.includes('Built on GoHighLevel.'),'Implementation credit missing');
assert.ok(home.includes('not a live log'),'Illustration boundary missing');
console.log('creative-first guard: pass — '+ids.length+' unique statics, no embedded videos, correct demo and biography.');
