from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
from playwright.sync_api import sync_playwright
import json
r=Path.cwd();out=Path('/tmp/final-sweep-review');out.mkdir(exist_ok=True)
server=ThreadingHTTPServer(('127.0.0.1',8791),partial(SimpleHTTPRequestHandler,directory=str(r)));Thread(target=server.serve_forever,daemon=True).start()
report={'date':'2026-09-05','base':'d0937fb53ad4a2a13333a7a82b5c7db7cfcac73f','views':[],'callsPlaced':False,'crmChanged':False,'manualVisualReview':'Pending inspection of captured screenshots'}
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True)
  for file in ['index.html','marketing-management.html','ai-growth.html','ai-operator.html','creative.html']:
   for w,h in [(375,812),(1440,900)]:
    ctx=browser.new_context(viewport={'width':w,'height':h},reduced_motion='reduce');p=ctx.new_page();errors=[];bad=[];external=[]
    p.on('pageerror',lambda e:errors.append(str(e)))
    p.on('response',lambda e:bad.append(e.url) if e.status>=400 else None)
    p.on('request',lambda e:external.append(e.url) if e.url.startswith('http') and not e.url.startswith('http://127.0.0.1:8791') else None)
    p.goto('http://127.0.0.1:8791/'+file,wait_until='networkidle');p.evaluate('document.fonts.ready')
    assert p.locator('h1').count()==1 and p.locator('video,iframe').count()==0
    assert p.evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'),(file,w,'overflow')
    p.add_script_tag(content=(r/'_audit/measure.js').read_text());a=p.evaluate('window.__auditMeasure()');assert a['tap']['under44']==0,(file,w,a['tap']);assert a['text']['below45']==0,(file,w,a['text'])
    p.screenshot(path=str(out/f'{file[:-5]}-{w}.png'));assert p.locator('.library-card').count()==38
    if file!='creative.html':
     assert p.locator('[data-credential]').count()==11
     assert 'Owner-reported leadership experience.' not in p.locator('body').inner_text()
     assert p.locator('.case-spotlight a').get_attribute('href')=='./work/tattoo-removal-studio.html'
     for summary in p.locator('.credentials-grid summary').all():summary.click()
     assert p.locator('[data-credential]:visible').count()==11
     if file=='index.html':
      for sel,name in [('#certifications','credentials'),('#voice','conversion'),('#fit','leadership'),('.case-spotlight','tattoo')]:p.locator(sel).screenshot(path=str(out/f'{name}-{w}.png'))
    p.locator('[data-filter="tattoo"]').click();assert p.locator('.library-card:not([hidden])').count()==1
    p.locator('.library-card:not([hidden])').click();assert p.locator('#creative-dialog').evaluate('e=>e.open')
    p.keyboard.press('Escape');assert not p.locator('#creative-dialog').evaluate('e=>e.open')
    p.locator('[data-filter="all"]').click()
    before=p.locator('#gallery').evaluate("e=>e.classList.contains('gallery-grid')");p.locator('#view-toggle').click();assert p.locator('#gallery').evaluate("e=>e.classList.contains('gallery-grid')")!=before
    assert not errors and not bad and not external,(errors,bad,external)
    report['views'].append({'file':file,'width':w,'contrastFailures':0,'smallTargets':0,'horizontalOverflow':False,'consoleErrors':0,'failedResources':0,'offOriginRequests':0});ctx.close()
  ctx=browser.new_context(java_script_enabled=False,viewport={'width':375,'height':812});p=ctx.new_page();p.goto('http://127.0.0.1:8791/index.html')
  assert p.locator('#voice').is_visible() and p.locator('.library-card').count()==38
  p.locator('.credentials-grid summary').first.click();assert p.locator('[data-credential]:visible').count()==4
  report['noJavaScript']={'voiceVisible':True,'galleryLinks':38,'credentialDetailsWork':True};browser.close()
 report['passed']=True;(out/'report.json').write_text(json.dumps(report,indent=2));(r/'_audit/releases/2026-09-05-final-sweep.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
finally:server.shutdown()
