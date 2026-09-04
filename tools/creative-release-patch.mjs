import fs from 'node:fs';
import assert from 'node:assert/strict';
function patch(file,from,to){let s=fs.readFileSync(file,'utf8');if(s.includes(to))return;if(s.includes(from)){assert.equal(s.split(from).length,2,file+' ambiguous patch');fs.writeFileSync(file,s.replace(from,to));}else throw Error(file+' patch source moved');}
patch('tools/build-creative-portfolio.mjs',"const {load}=require('cheerio');\nconst sharp=require('sharp');","let load, sharp;\nif(!fs.existsSync('tools/portfolio-gallery.json')) { ({load}=require('cheerio')); sharp=require('sharp'); }");
patch('tools/build-creative-portfolio.mjs','@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{animation:none!important;transition:none!important}}','.site-nav nav a{min-width:44px}\n.hero h1{letter-spacing:-.05em;word-spacing:.02em;line-height:.98}.hero h1 em{margin-right:.05em}\n@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{animation:none!important;transition:none!important}}');
patch('tools/build-creative-portfolio.mjs',"const wording=(id,key='portfolio_employer')=>esc(claim(id).wording[key]);","const wording=(id,key='portfolio_employer')=>{const value=claim(id).wording[key];assert.equal(typeof value,'string','Missing contract wording '+id+'/'+key);return esc(value);};");
let qa=fs.readFileSync('tools/creative-portfolio-qa.cjs','utf8');
const start=qa.indexOf('async function packet('),end=qa.indexOf('\n(async()=>{',start);assert.ok(start>=0&&end>start);
qa=qa.slice(0,start)+`async function packet(name,file,width=720){
 const dest=path.join(OUT,name+path.extname(file));
 if(path.resolve(file)!==path.resolve(dest))fs.copyFileSync(file,dest);
 packetIndex.push({name,originalCapture:dest,bytes:fs.statSync(dest).size});
}`+qa.slice(end);
qa=qa.replace("const screenshot=async(name,locator)=>{const f=", "const screenshot=async(name,locator)=>{await page.evaluate(()=>document.activeElement?.blur());const f=");
qa=qa.replace("fs.writeFileSync('_review/packs/index.json',JSON.stringify(packetIndex,null,2)+'\\n');", "fs.writeFileSync('_review/packs/index.json',JSON.stringify(packetIndex,null,2)+'\\n');fs.writeFileSync(path.join(OUT,'report.json'),JSON.stringify(report,null,2));");
fs.writeFileSync('tools/creative-portfolio-qa.cjs',qa);
