import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// Uses the normal, logged-in browser UI. No cookies, tokens or private APIs.
// Usage: bun scripts/capture-x.ts --tab TAB_ID [--window WINDOW_ID] [--pages 250] [--resume]
const args = process.argv.slice(2);
const tabId = args[args.indexOf("--tab") + 1];
if (!args.includes("--tab") || !tabId) throw new Error("Pass the ID of an Edge tab on the requested X profile.");
const windowId = args.includes("--window") ? args[args.indexOf("--window") + 1] : undefined;
if (windowId && !/^\d+$/.test(windowId)) throw new Error("--window must be an Edge window ID");
if (!/^\d+$/.test(tabId)) throw new Error("--tab must be an Edge tab ID");
const limit = args.includes("--pages") ? Number(args[args.indexOf("--pages")+1]) : 1;
if (!Number.isInteger(limit) || limit < 1 || limit > 500) throw new Error("--pages must be 1–500");
const out = resolve(import.meta.dir, "../../.local-audit/x");
mkdirSync(out,{recursive:true});
const startedAt = new Date().toISOString();
const posts = new Map<string, unknown>();
const frames: unknown[] = [];
let stopReason = "page-limit";
let noNew = 0;

function execute(javascript: string) {
  // Direct lookup avoids hundreds of Apple Events when the owner has many tabs.
  // Edge exposes Apple Event IDs as strings; numeric byId() can hang indefinitely.
  const lookup = windowId
    ? `const target=app.windows.byId(${JSON.stringify(windowId)}).tabs.byId(${JSON.stringify(tabId)});`
    : `let target=null; for(const w of app.windows()) { const matches=w.tabs.whose({id:${JSON.stringify(tabId)}})(); if(matches.length){target=matches[0];break;} }`;
  const jxa = `const app=Application("Microsoft Edge"); ${lookup} if(!target) throw Error("Tab no longer exists"); if(!/^https:\\/\\/(?:www\\.)?(?:x|twitter)\\.com\\/Splendor1811(?:\\/|$|\\?)/i.test(target.url())) throw Error("Expected the requested Splendor1811 profile"); target.execute({javascript:${JSON.stringify(javascript)}});`;
  return execFileSync("osascript",["-l","JavaScript","-e",jxa],{encoding:"utf8",timeout:25000,maxBuffer:5*1024*1024}).trim();
}

const snapshot = `JSON.stringify({url:location.href,title:document.title,scrollY:scrollY,scrollHeight:document.documentElement.scrollHeight,text:document.body.innerText.slice(-1800),articles:[...document.querySelectorAll('article[data-testid="tweet"]')].map(a=>{const date=a.querySelector('time');const status=date?.closest('a')?.href||[...a.querySelectorAll('a[href*="/status/"]')].map(x=>x.href).find(x=>/\\/status\\/\\d+$/.test(x));return {statusUrl:status||null,originalPublishedAt:date?.dateTime||null,repostedAt:null,socialContext:a.querySelector('[data-testid="socialContext"]')?.innerText||'',author:a.querySelector('[data-testid="User-Name"]')?.innerText||'',text:a.querySelector('[data-testid="tweetText"]')?.innerText||'',isTruncated:!!a.querySelector('[data-testid="tweet-text-show-more-link"]'),links:[...a.querySelectorAll('a[href]')].filter(l=>l.href.includes('/status/')||!/^https:\\/\\/(?:www\\.)?(?:x|twitter)\\.com\\//.test(l.href)).map(l=>({url:l.href,label:l.textContent})),quotedText:[...a.querySelectorAll('[data-testid="tweetText"]')].slice(1).map(t=>t.innerText)};})})`;

function save() {
  const report = {startedAt,finishedAt:new Date().toISOString(),profile:"https://x.com/Splendor1811/reposts",requestedRange:{from:"2026-06-01",through:"2026-10-10"},coverage:{status:"unproven",stopReason,explanation:"Visible UI captures cannot prove a complete repost archive. Original tweet dates must not be treated as repost dates."},posts:[...posts.values()],frames};
  const name = `timeline-${startedAt.replace(/[:.]/g,"-")}.json`;
  writeFileSync(resolve(out,name),JSON.stringify(report,null,2)+"\n");
  return resolve(out,name);
}

try {
  if (!args.includes("--resume")) {
    execute("window.scrollTo({top:0,behavior:'instant'}); 'top'");
    await Bun.sleep(1600);
  }
  for(let page=0;page<limit;page++) {
    const frame=JSON.parse(execute(snapshot));
    const observedAt=new Date().toISOString();
    let added=0;
    for(const article of frame.articles) {
      if(!article.statusUrl) continue;
      // Keep repost and non-repost observations distinct so a pinned original
      // cannot overwrite a later repost observation of the same status.
      const key=article.statusUrl+"|"+article.socialContext;
      if(!posts.has(key)){posts.set(key,{...article,observedAt,timelinePage:page});added++;}
    }
    frames.push({page,observedAt,url:frame.url,scrollY:frame.scrollY,scrollHeight:frame.scrollHeight,articleCount:frame.articles.length,newCount:added});
    noNew=added?0:noNew+1;
    console.log(JSON.stringify({page,captured:posts.size,newCount:added}));
    // Keep a recoverable checkpoint if the browser closes or the run is interrupted.
    if(page%20===0) save();
    if(/rate limit|try again later|something went wrong|giới hạn tốc độ/i.test(frame.text) && !frame.articles.length){stopReason="browser-error-or-rate-limit";break;}
    if(noNew>=8){stopReason="no-new-visible-posts-not-proof-of-completeness";break;}
    if(page+1<limit){execute("window.scrollBy(0, Math.max(500, innerHeight * .8)); 'scrolled'");await Bun.sleep(1400);}
  }
} catch(error){stopReason="capture-error";console.error(String(error));process.exitCode=1;}
console.log(JSON.stringify({output:save(),captured:posts.size,stopReason,complete:false}));
