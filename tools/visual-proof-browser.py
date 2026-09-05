from pathlib import Path
import json,subprocess,time
from bs4 import BeautifulSoup
from PIL import Image
from playwright.sync_api import sync_playwright
root=Path.cwd();out=Path('/tmp/visual-proof-review');out.mkdir(exist_ok=True)
base=subprocess.check_output(['git','show','b71bb9894c0512a123f73c383624fc8cc0e0493c:index.html'],cwd=root,text=True)
def claims(s): return [(e['data-claim'],str(e)) for e in BeautifulSoup(s,'html.parser').select('[data-claim]')]
assert claims(base)==claims((root/'index.html').read_text()),'Existing claim block changed'
m=json.loads((root/'tools/portfolio-gallery.json').read_text())
report={'date':'2026-09-04','baseline':'b71bb9894c0512a123f73c383624fc8cc0e0493c','kind':'Chromium on GitHub Actions; not user research or a telephone/backend test','viewports':[],'claims_preserved':len(claims(base)),'gallery_count':len(m['items']),'source_image_kind':'Original Canva page previews at 447px; body logo redacted','phone_call_placed':False,'crm_changed':False,'private_pattern_sweep':'Not rerun; public contract and source-preservation guards ran.'}
server=subprocess.Popen(['python','-m','http.server','8792','--bind','127.0.0.1'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
time.sleep(.4)
try:
 with sync_playwright() as p:
  b=p.chromium.launch(headless=True)
  for w,h in [(375,812),(760,900),(1440,900)]:
   c=b.new_context(viewport={'width':w,'height':h},reduced_motion='reduce');pg=c.new_page();bad=[];ext=[];err=[]
   pg.on('response',lambda r:bad.append([r.url,r.status]) if r.status>=400 else None)
   pg.on('request',lambda r:ext.append(r.url) if r.url.startswith('http') and not r.url.startswith('http://127.0.0.1:8792/') else None)
   pg.on('pageerror',lambda e:err.append(str(e)))
   pg.goto('http://127.0.0.1:8792/',wait_until='networkidle');pg.evaluate('document.fonts.ready')
   assert pg.locator('video,iframe').count()==0
   assert pg.locator('h1').inner_text()=='Ads people understand before they can ignore them.'
   assert 'AI-native performance marketer with an operator’s brain' in pg.locator('.hero-deck').inner_text()
   assert pg.locator('.library-card').count()==30
   assert pg.locator('[data-category="b2b"]').count()==0
   assert pg.locator('a[href="./work/b2b-refrigeration.html"]').count()==1
   pg.add_script_tag(content=(root/'_audit/measure.js').read_text());audit=pg.evaluate('window.__auditMeasure()')
   assert audit['tap']['under44']==0,audit['tap']
   assert audit['text']['below45']==0,audit['text']
   assert pg.evaluate('document.documentElement.scrollWidth<=innerWidth')
   phone=pg.locator('a[href^="tel:"]').evaluate_all('(es)=>es.map(e=>e.getAttribute("href"))');assert len(phone)==4 and set(phone)=={'tel:+18888147785'}
   for id in ['laser-treatment-canva','body-treatment-canva']:
    tile=pg.locator('[data-gallery-id="'+id+'"]');tile.scroll_into_view_if_needed();tile.click()
    pg.wait_for_function('document.querySelector("#lightbox-image").complete && document.querySelector("#lightbox-image").naturalWidth>0')
    img=pg.locator('#lightbox-image');assert img.evaluate('(e)=>e.naturalWidth')==447
    assert img.bounding_box()['width']<=447.1
    assert 'Original Canva page preview' in pg.locator('#lightbox-disclosure').inner_text()
    assert pg.locator('#lightbox-disclosure').is_visible()
    if id.startswith('body'): assert 'logo removed' in pg.locator('#lightbox-disclosure').inner_text()
    pg.keyboard.press('ArrowRight');pg.keyboard.press('Escape');assert not pg.locator('#creative-dialog').evaluate('(e)=>e.open')
   pg.locator('[data-filter="home"]').click();assert pg.locator('.library-card:visible').count()==4
   pg.locator('[data-filter="all"]').click();pg.locator('#view-toggle').click();assert 'gallery-grid' in pg.locator('#gallery').get_attribute('class');pg.locator('#view-toggle').click()
   pg.locator('.build-details summary').click();assert pg.locator('.build-details').get_attribute('open') is not None
   assert 'Rules decide fit' in pg.locator('.build-details').inner_text()
   pg.locator('.build-details summary').click()
   if w<=760:
    pg.locator('.menu-toggle').click();pg.locator('#nav-links a[href="#voice"]').click();assert pg.locator('.menu-toggle').get_attribute('aria-expanded')=='false'
   pg.locator('img[src]').evaluate_all('(es)=>es.forEach(e=>e.loading="eager")');pg.wait_for_function('Array.from(document.querySelectorAll("img[src]")).every(e=>e.complete)')
   broken=pg.locator('img[src]').evaluate_all('(es)=>es.filter(e=>e.naturalWidth===0).map(e=>e.src)');assert not broken,broken
   pg.evaluate('window.scrollTo(0,0)');pg.wait_for_timeout(80)
   pg.screenshot(path=str(out/f'hero-{w}.png'));pg.screenshot(path=str(out/f'full-{w}.png'),full_page=True)
   full=Image.open(out/f'full-{w}.png')
   for sel,name in [('#ai-work','ai-work'),('#work','gallery')]:
    box=pg.locator(sel).bounding_box();full.crop((0,int(box['y']),w,min(full.height,int(box['y']+box['height'])))).save(out/f'{name}-{w}.png')
   assert not bad and not ext and not err,(bad,ext,err)
   report['viewports'].append({'width':w,'height':h,'small_targets':0,'low_contrast':0,'horizontal_overflow':False,'new_images_decode':True,'viewer_no_upscale':True,'gallery_filters_and_viewer':True,'native_build_disclosure':True,'phone_links_unchanged':True,'off_origin_requests':0,'failed_resources':0,'browser_errors':0})
   c.close()
  c=b.new_context(viewport={'width':375,'height':812},java_script_enabled=False)
  pg=c.new_page();pg.goto('http://127.0.0.1:8792/');assert pg.locator('#voice').is_visible();assert pg.locator('#ai-work').is_visible();pg.locator('.build-details summary').click();assert pg.locator('.build-details').get_attribute('open') is not None
  report['no_javascript']={'hero_voice_and_ai_work_available':True,'details_opens':True,'creative_anchors':pg.locator('.library-card').count()}
  pg.goto('http://127.0.0.1:8792/creative.html');assert pg.locator('.library-card').count()==30;assert pg.locator('[data-category="b2b"]').count()==0
  c.close();b.close()
 report['result']='PASS';(out/'report.json').write_text(json.dumps(report,indent=2));(root/'_audit/releases/2026-09-04-visual-proof.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
finally:
 server.terminate();server.wait(timeout=5)
