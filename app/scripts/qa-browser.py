"""Read-only browser smoke checks. Run: uv run --with playwright python scripts/qa-browser.py URL OUT.

Uses an isolated browser context: never touches the owner's reading history or credentials.
"""
import json
import re
import sys
from pathlib import Path
from urllib.parse import parse_qs, urlparse
from playwright.sync_api import sync_playwright, expect

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
            dialog=page.get_by_role('dialog',name='Workspace navigation')
            dialog.wait_for()
            close_menu=dialog.get_by_role('button',name='Close menu',exact=True)
            close_menu.focus()
            page.keyboard.press('Shift+Tab')
            wrapped_backward=dialog.evaluate('(el) => el.contains(document.activeElement)')
            page.keyboard.press('Tab')
            wrapped_forward=close_menu.evaluate('(el) => el === document.activeElement')
            results.append({"width":width,"test":"mobile drawer traps focus in both directions","pass":wrapped_backward and wrapped_forward})
            page.keyboard.press('Escape')
            dialog.wait_for(state='hidden')
            results.append({"width":width,"test":"mobile drawer Escape","pass":True})
            expect(trigger).to_be_focused()
            restored=trigger.evaluate('(el) => el === document.activeElement')
            results.append({"width":width,"test":"mobile drawer returns focus to its trigger","pass":restored})
        # Theme preference should survive reload.
        page.goto(base+"/",wait_until="networkidle")
        page.get_by_role('button',name='Switch to dark theme',exact=True).click()
        page.reload(wait_until="networkidle")
        dark = page.locator('html').get_attribute('class')=='dark'
        results.append({"width":width,"test":"dark theme persists","pass":dark})
        if width==1440: page.screenshot(path=str(out/'home-dark-1440.png'))
        # Date selection changes only this unsaved form, never the owner's library.
        page.goto(base+'/add',wait_until='networkidle')
        date_control=page.locator('#add-date')
        date_control.click()
        calendar=page.get_by_role('dialog',name='Choose publication date')
        calendar.get_by_label('Year',exact=True).select_option('2024')
        calendar.get_by_label('Month',exact=True).select_option('1')
        calendar.locator('[data-date="2024-02-29"]').click()
        date_control.click()
        leap_day=calendar.locator('[data-date="2024-02-29"]')
        leap_selected=leap_day.locator('..').get_attribute('aria-selected')=='true'
        leap_day.focus()
        page.keyboard.press('ArrowRight')
        march_day=calendar.locator('[data-date="2024-03-01"]')
        expect(march_day).to_be_focused()
        page.keyboard.press('Enter')
        date_control.click()
        march_selected=calendar.locator('[data-date="2024-03-01"]').locator('..').get_attribute('aria-selected')=='true'
        results.append({"width":width,"test":"calendar leap day and keyboard month boundary","pass":leap_selected and march_selected})
        calendar.get_by_text('Enter a date manually',exact=True).click()
        manual=calendar.get_by_label('Year, month, or exact date',exact=True)
        manual.fill('2024-02')
        manual.press('Enter')
        date_control.click()
        calendar.get_by_text('Enter a date manually',exact=True).click()
        partial_preserved=manual.input_value()=='2024-02'
        results.append({"width":width,"test":"calendar preserves month-only precision","pass":partial_preserved})
        manual.fill('2024-02-31')
        results.append({"width":width,"test":"calendar flags an impossible date","pass":date_control.get_attribute('aria-invalid')=='true' and manual.get_attribute('aria-invalid')=='true'})
        calendar.get_by_role('button',name='Clear date',exact=True).click()
        results.append({"width":width,"test":"calendar clears to unknown without inventing a date","pass":date_control.inner_text().strip()=='Choose a date' and date_control.get_attribute('aria-invalid') is None})
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
        # Acquisition origins are independent of publisher/domain and survive direct links.
        for origin in ['edge', 'x', 'lilianweng', 'followup']:
            page.goto(base+'/sources?origin='+origin,wait_until='networkidle')
            origins=page.locator('main article').evaluate_all('(rows) => rows.map(row => row.dataset.sourceOrigin)')
            control=page.get_by_label('Collected from',exact=True)
            height=control.bounding_box()['height']
            results.append({"width":width,"test":"source origin direct filter: "+origin,"pass":control.input_value()==origin and len(origins)>0 and all(value==origin for value in origins) and height>=44})
        page.get_by_role('button',name='Clear filters',exact=True).click()
        page.get_by_role('button',name='Show 50 more sources',exact=True).click()
        expanded=page.locator('main article').count()
        page.get_by_label('Collected from',exact=True).select_option('x')
        page.wait_for_timeout(150)
        rows=page.locator('main article')
        origins=rows.evaluate_all('(rows) => rows.map(row => row.dataset.sourceOrigin)')
        results.append({"width":width,"test":"source origin resets pagination","pass":expanded==100 and len(origins)==50 and all(value=='x' for value in origins) and 'origin=x' in page.url})
        page.get_by_label('Research domain',exact=True).select_option('reinforcement-learning')
        page.get_by_role('button',name=re.compile(r'^Added to library')).click()
        page.wait_for_timeout(150)
        rows=page.locator('main article')
        domain_links=rows.locator('a[href*="/topics/"]').evaluate_all('(links) => links.map(link => link.getAttribute("href"))')
        origins=rows.evaluate_all('(rows) => rows.map(row => row.dataset.sourceOrigin)')
        source_url=rows.first.locator('a[aria-label^="Open source:"]').get_attribute('href')
        source_id=rows.first.get_attribute('data-source-id')
        combined=bool(origins) and all(value=='x' for value in origins) and all(href.endswith('/topics/reinforcement-learning') for href in domain_links)
        page.get_by_role('searchbox',name='Search source inventory').fill(source_url)
        page.wait_for_timeout(150)
        query_params=parse_qs(urlparse(page.url).query)
        matches=page.locator('main article').evaluate_all('(rows) => rows.map(row => row.dataset.sourceId)')
        results.append({"width":width,"test":"source origin combines with domain, status, and pasted URL search","pass":combined and matches==[source_id] and query_params.get('origin')==['x'] and query_params.get('domain')==['reinforcement-learning'] and query_params.get('status')==['imported'] and query_params.get('q')==[source_url]})
        page.get_by_role('button',name='Clear filters',exact=True).click()
        results.append({"width":width,"test":"clear all source filters including acquisition origin","pass":'?' not in page.url and page.get_by_label('Collected from',exact=True).input_value()=='' and page.get_by_label('Research domain',exact=True).input_value()=='' and page.get_by_role('searchbox',name='Search source inventory').input_value()=='' and page.get_by_role('button',name=re.compile(r'^All sources')).get_attribute('aria-pressed')=='true'})
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
