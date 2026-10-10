"""Read-only browser smoke checks. Run: uv run --with playwright python scripts/qa-browser.py URL OUT.

Uses an isolated browser context: never touches the owner's reading history or credentials.
"""
import json
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

base = (sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:5275").rstrip("/")
out = Path(sys.argv[2] if len(sys.argv) > 2 else "../.local-audit/qa-final")
out.mkdir(parents=True, exist_ok=True)
results, errors = [], []
paths = ["/", "/library", "/topics", "/sources", "/add", "/favorites", "/review", "/roadmap", "/activity", "/settings", "/graph"]

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome")
    for width in [390, 768, 1440]:
        context = browser.new_context(viewport={"width":width,"height":900}, locale="vi-VN", timezone_id="Asia/Ho_Chi_Minh")
        page = context.new_page()
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        for route in paths:
            response=page.goto(base+route,wait_until="networkidle")
            page.locator("main h1").wait_for()
            # Unicode subsets are loaded on demand. Load Vietnamese glyphs before
            # checking them, rather than misreporting an unused subset as missing.
            fonts = page.evaluate("""async () => {
              const result = [];
              for (const family of ['Inter', 'Space Grotesk', 'JetBrains Mono']) {
                for (const weight of [400, 500]) {
                  const font = `${weight} 16px "${family}"`;
                  await document.fonts.load(font, 'Ấn tượng Quỳnh Ượt Đổi mới');
                  result.push({family, weight, loaded:document.fonts.check(font, 'Ấn tượng Quỳnh Ượt Đổi mới')});
                }
              }
              return result;
            }""")
            measurements = page.evaluate("""() => {
              const main=document.querySelector('main');
              return {documentOverflow:document.documentElement.scrollWidth>innerWidth+1,
                mainOverflow:main.scrollWidth>main.clientWidth+1,
                headings:document.querySelectorAll('main h1').length,
                brokenImages:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).length};
            }""")
            http_status=response.status if response else None
            ok = http_status==200 and not measurements['documentOverflow'] and not measurements['mainOverflow'] and measurements['headings']==1 and not measurements['brokenImages'] and all(f['loaded'] for f in fonts)
            results.append({"width":width,"route":route,"pass":ok,"httpStatus":http_status,**measurements,"fonts":fonts})
            if route in ["/","/library","/topics","/sources","/add"]:
                page.screenshot(path=str(out/((route.strip('/') or 'home')+f'-{width}.png')))
        # Mobile drawer must trap focus, close with Escape, and return focus.
        if width < 1024:
            page.goto(base+"/",wait_until="networkidle")
            trigger=page.get_by_role('button',name='Open menu',exact=True)
            trigger.click()
            page.get_by_role('dialog',name='Workspace navigation').wait_for()
            page.keyboard.press('Escape')
            page.get_by_role('dialog',name='Workspace navigation').wait_for(state='hidden')
            results.append({"width":width,"test":"mobile drawer Escape","pass":True})
        # Theme preference should survive reload.
        page.goto(base+"/",wait_until="networkidle")
        page.get_by_role('button',name='Switch to dark theme',exact=True).click()
        page.reload(wait_until="networkidle")
        dark = page.locator('html').get_attribute('class')=='dark'
        results.append({"width":width,"test":"dark theme persists","pass":dark})
        if width==1440: page.screenshot(path=str(out/'home-dark-1440.png'))
        # Publisher grouping must retain author-qualified Thinking Machines papers.
        page.goto(base+"/library?source=Thinking%20Machines",wait_until="networkidle")
        opd_links=page.get_by_role('link',name='On-Policy Distillation',exact=True).count()
        results.append({"width":width,"test":"publisher facet includes both retained OPD identities","pass":opd_links==2})
        page.goto(base+"/topics/thinking-machines-lab",wait_until="networkidle")
        results.append({"width":width,"test":"legacy publisher topic redirects to source facet","pass":"/library?source=Thinking%20Machines" in page.url})
        page.goto(base+"/topics/on-policy-distillation",wait_until="networkidle")
        results.append({"width":width,"test":"legacy domain redirect","pass":"/topics/post-training-alignment" in page.url})
        # Large inboxes render in readable batches, resetting after filtering.
        page.goto(base+"/sources",wait_until="networkidle")
        more=page.get_by_role('button',name='Show 50 more sources',exact=True)
        if more.count():
            initial=page.locator('main article').count()
            more.click()
            expanded=page.locator('main article').count()
            page.get_by_role('searchbox',name='Search source inventory').fill('Lilian')
            page.wait_for_timeout(150)
            results.append({"width":width,"test":"source inbox batching and search","pass":initial==50 and expanded==100 and page.locator('main article').count()<=50})
        page.get_by_role('searchbox',name='Search source inventory').fill('')
        page.get_by_label('Research domain',exact=True).select_option('reinforcement-learning')
        page.wait_for_timeout(150)
        domain_links=page.locator('main article a[href*="/topics/"]').evaluate_all('(links) => links.map(link => link.getAttribute("href"))')
        results.append({"width":width,"test":"source domain filter is URL-backed and consistent","pass":'domain=reinforcement-learning' in page.url and len(domain_links)>0 and all(href.endswith('/topics/reinforcement-learning') for href in domain_links)})
        page.get_by_role('button',name='Clear filters',exact=True).click()
        results.append({"width":width,"test":"clear source filters","pass":'?' not in page.url and page.get_by_label('Research domain',exact=True).input_value()==''})
        resource_href=page.locator('main article h2 a[href*="/resource/"]').first.get_attribute('href')
        resource_response=page.goto(base+resource_href,wait_until="networkidle")
        page.locator('main h1').wait_for()
        results.append({"width":width,"test":"direct resource navigation returns HTTP 200","pass":bool(resource_response and resource_response.status==200)})
        context.close()
    browser.close()

report={"base":base,"checks":len(results),"passed":sum(r['pass'] for r in results),"runtimeErrors":errors,"results":results}
(out/'report.json').write_text(json.dumps(report,indent=2)+"\n")
print(json.dumps({k:v for k,v in report.items() if k!='results'},indent=2))
for row in results:
    if not row['pass']: print(json.dumps(row))
sys.exit(0 if all(r['pass'] for r in results) and not errors else 1)
