/** A conservative key for source deduplication; original URLs are always retained. */
export function canonicalUrl(raw: string): string {
  try {
    const u = new URL(raw);
    if (!["http:", "https:"].includes(u.protocol)) return raw;
    u.hash = "";
    u.hostname = u.hostname.replace(/^www\./, "").replace(/^twitter\.com$/, "x.com");
    for (const key of [...u.searchParams.keys()]) {
      if (/^utm_/.test(key)) u.searchParams.delete(key);
    }
    if (u.hostname === "youtu.be") {
      const video = u.pathname.slice(1);
      u.hostname = "youtube.com";
      u.pathname = "/watch";
      u.searchParams.set("v", video);
    }
    if (u.hostname === "youtube.com") {
      for (const key of ["si", "feature"]) u.searchParams.delete(key);
      if (u.pathname === "/watch" && u.searchParams.has("v")) {
        for (const key of ["list", "index", "t", "start"]) u.searchParams.delete(key);
      }
    }
    if (u.hostname === "github.com") u.searchParams.delete("tab");
    if (u.hostname === "arxiv.org") u.pathname = u.pathname.replace(/^\/pdf\//, "/abs/").replace(/\.pdf$/, "").replace(/v\d+$/, "");
    u.pathname = u.pathname.replace(/\/$/, "");
    u.searchParams.sort();
    return u.toString();
  } catch { return raw; }
}
