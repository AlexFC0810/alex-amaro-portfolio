import fs from 'node:fs';
import assert from 'node:assert/strict';
const registry=JSON.parse(fs.readFileSync('proof/credentials.json','utf8'));
const names=registry.groups.flatMap(g=>g.items.map(i=>i.name));
assert.equal(names.length,11);assert.equal(new Set(names).size,names.length);
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
for(const file of ['index.html','marketing-management.html','ai-growth.html','ai-operator.html']){
 const html=fs.readFileSync(file,'utf8');
 const rendered=[...html.matchAll(/data-credential="([^"]+)"/g)].map(x=>x[1]);
 assert.deepEqual(rendered,names.map(escape),file+': credential source drift');
 assert.ok(!html.includes('Owner-reported leadership experience.'),file+': superseded presentation returned');
 assert.ok(html.includes('data-claim="B8"'),file+': leadership evidence lost');
 assert.ok(html.includes('data-claim="B3"')&&html.includes('./work/tattoo-removal-studio.html'),file+': tattoo case lost');
 assert.ok(html.includes('id="certifications"'),file+': credential anchor lost');
 assert.ok(html.includes('ClickUp and GitHub Projects'),file+': implementation context lost');
}
console.log('Credentials and role-context guard: pass; 11 registry items on four shared-content views.');
