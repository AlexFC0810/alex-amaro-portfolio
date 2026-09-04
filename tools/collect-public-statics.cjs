// One-time import of the six unique static files actually enumerated in the
// owner's public reference. Their native sizes are retained, not upscaled.
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const sharp=require('/tmp/creative-build/node_modules/sharp');
const manifestPath='tools/portfolio-gallery.json',origin='https://alex-amaro-creative.alexfc10.chatgpt.site';
(async()=>{
 const m=JSON.parse(fs.readFileSync(manifestPath,'utf8'));if(m.referenceStaticReview?.normalized){console.log('Unique static collection already captured');return;}
 const definitions=[
  {id:'home-services-offer',sourcePath:'/library/home/clarity-door-02.webp',title:'Offer-first door hanger',alt:'Clarity Cleaning direct-mail design with a clear introductory offer',category:'home',market:'Residential cleaning',provenance:'Own-brand · Direct mail'},
  {id:'home-services-detail',sourcePath:'/library/home/clarity-door-08.webp',title:'Make the service easy to understand',alt:'Clarity Cleaning door hanger with service details and a contact action',category:'home',market:'Residential cleaning',provenance:'Own-brand · Direct mail'},
  {id:'home-services-trust',sourcePath:'/library/home/clarity-door-04.webp',title:'Benefits and trust, on the reverse',alt:'Reverse side of a Clarity Cleaning door hanger',category:'home',market:'Residential cleaning',provenance:'Own-brand · Direct mail'},
  {id:'home-services-blue',sourcePath:'/library/home/clarity-door-07.webp',title:'A different treatment of the offer',alt:'Blue Clarity Cleaning direct-mail offer design',category:'home',market:'Residential cleaning',provenance:'Own-brand · Direct mail'},
  {id:'own-brand-comparison',sourcePath:'/library/ai/missed-call-02.webp',title:'A missed-call comparison',alt:'CareLine static creative comparing two ways of handling incoming calls',category:'own',market:'CareLine',provenance:'Own-brand creative'},
  {id:'own-brand-tension',sourcePath:'/library/ai/missed-call-card.webp',title:'Make the missed call tangible',alt:'CareLine static creative built around a missed-call scenario',category:'own',market:'CareLine',provenance:'Own-brand creative'}
 ];
 const observed=new Set((m.referenceStaticReview?.receipts||[]).map(x=>x.sourcePath));
 for(const d of definitions)if(!observed.has(d.sourcePath))throw Error('Source was not observed: '+d.sourcePath);
 const old=m.items.filter(x=>x.file.startsWith('assets/portfolio-static/'));m.items=m.items.filter(x=>!x.file.startsWith('assets/portfolio-static/'));
 for(const x of old)if(fs.existsSync(x.file))fs.unlinkSync(x.file);
 const receipts=[];for(const d of definitions){const r=await fetch(origin+d.sourcePath,{signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error('Static fetch '+r.status);const bytes=Buffer.from(await r.arrayBuffer()),meta=await sharp(bytes).metadata();if(Math.max(meta.width,meta.height)<400||Math.min(meta.width,meta.height)<240)throw Error('Static below usable native size');
  const f='assets/portfolio-static/'+d.id+'.webp';fs.mkdirSync(path.dirname(f),{recursive:true});const out=await sharp(bytes).rotate().webp({quality:94}).toBuffer();fs.writeFileSync(f,out);m.items.push({...d,file:f,thumb:f,source:'Owner-selected public reference; native-size static artwork',sha256:createHash('sha256').update(out).digest('hex'),width:meta.width,height:meta.height});receipts.push({sourcePath:d.sourcePath,width:meta.width,height:meta.height,file:f,status:'pending-visual-review'});
 }
 const lead=['chiro-knee-pain-03','medspa-laser-02','medspa-body-contouring-02','home-services-offer','b2b-refrigeration-01','own-brand-comparison','medspa-botox-01','chiro-knee-pain-02','medspa-laser-05'];m.items.sort((a,b)=>{const ai=lead.indexOf(a.id),bi=lead.indexOf(b.id);return(ai<0?100:ai)-(bi<0?100:bi);});
 m.referenceStaticReview={date:'2026-09-04',normalized:true,uniqueStaticFiles:definitions.length,note:'These are native-size public reference assets, not new high-resolution Canva exports. Narrow direct-mail artwork is preserved at its native aspect ratio.',receipts};
 fs.writeFileSync(manifestPath,JSON.stringify(m,null,2)+'\n');console.log(JSON.stringify({items:m.items.length,uniqueReferenceFiles:definitions.length}));
})().catch(e=>{console.error(e);process.exit(1)});
