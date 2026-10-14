# Second Brain — personal AI learning platform

A local-first web app that turns the Markdown `Library/` into a
searchable research atlas and learning tracker: browse, filter, take notes & highlights, track
read/unread, spaced-repetition review, a knowledge-graph constellation, learning roadmaps,
progress dashboards, and a ⌘K command palette.

The Atlas interface includes light/dark themes, responsive reading lists, URL-based filters,
accent-insensitive search, visible citations, and a calendar picker that preserves partial
publication dates. Resource and topic counts are calculated from the actual library.

- **Content is Markdown, canonical.** `scripts/parse-content.ts` parses `../Library/*.md` into
  `src/data/content.json` at build/dev time. Edit the Markdown → the app updates.
- **Personal state is private.** Previously saved guest progress remains in this browser's IndexedDB;
  the configured public site now presents a GitHub sign-in gate before opening the UI. Signed-in users get a separate
  local cache and a private, revisioned cloud snapshot for cross-device sync. RLS limits cloud rows
  to their owner, and concurrent edits require an explicit choice instead of silent overwrites.
  The public Markdown library remains shared and read-only to visitors. Back up personal data from
  **Settings → Export backup**; GitHub/AI credentials and sync metadata are excluded from downloads.
- **Static-hostable.** Builds to plain files for GitHub Pages.

The GitHub sign-in gate hides the UI from signed-out visitors, **not** the static files or bundled
Library data served by GitHub Pages. Do not put confidential documents in the public Library.

## Develop

```bash
bun install
bun run dev            # http://localhost:5273  (re-parses Markdown first)
bun run serve          # optional: local writeback server so "Add resource" can edit Markdown
bun test               # parser, stable IDs, dates, URL matching and publishing tests
```

Run `dev` and `serve` together to add resources from the UI and have them written back into the
right `Library/*.md` file (then re-parsed and hot-reloaded). Without `serve` (e.g. the hosted site),
"Add resource" gives you a ready-to-paste Markdown snippet instead.

## Build & deploy

```bash
bun run build          # -> dist/ (parses Markdown, generates route shells and 404.html)
bun run preview
```

Hosting is **GitHub Pages**. After reviewing and committing changes, an explicitly approved push
to `main` or `master` triggers `.github/workflows/deploy.yml`. That workflow builds `app/` and
publishes it. A successful local build does not mean the public website has been updated.

The postbuild step copies Vite's root HTML to `<route>/index.html` for known app pages,
every current resource, canonical topics, and legacy topic/source redirects. Direct links
therefore resolve to real static files on Pages (HTTP 200 after any trailing-slash redirect).
Query filters remain in the URL and BrowserRouter still handles client-side navigation.
Unknown and newly published resource IDs retain the `404.html` fallback until the next build.

For a project site, use `BASE_PATH=/Second_Brain/ bun run build`. Route shells preserve
Vite's built absolute asset paths unchanged; the hosting base is not duplicated inside `dist/`.

## Enable private accounts

The account UI is deliberately inactive until the database security rules are installed.
The project URL and publishable key alone cannot create tables or policies. Never put a database
password, service-role key, or Supabase secret key into `VITE_*`, Git, or a public issue.

1. In the project's **Supabase Dashboard → SQL Editor**, run the entire
   [`supabase/migrations/20261012_personal_snapshots.sql`](supabase/migrations/20261012_personal_snapshots.sql).
   Confirm `public.personal_snapshots` has RLS enabled and four owner-only policies. Do not
   enable the browser config before this step.
2. In **Authentication → URL Configuration**, set Site URL to
   `https://splendor1811.github.io/` and add that exact URL to Redirect URLs. For local testing,
   add `http://localhost:5273/` as another allowed redirect. Enable GitHub under **Authentication
   → Sign In / Providers** after creating a GitHub OAuth App with callback URL
   `https://<project-ref>.supabase.co/auth/v1/callback`. Keep its Client Secret only in Supabase.
3. For development, copy `.env.example` to `.env.local` and fill the public project URL and
   publishable key. For GitHub Pages, set repository **Settings → Secrets and variables → Actions
   → Variables**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. The workflow already
   reads them. Rebuild/redeploy after setting the variables.
4. Sign in with two test emails in separate browser profiles. Confirm each sees only its own
   Done/Favorite/notes, then edit the same account on two devices and check the conflict prompt.
   Existing guest data is *not* silently merged into an account; export/import a backup if desired.

GitHub OAuth does not use email Magic Links, so custom SMTP is not required for this sign-in path.
If adding email sign-in later, configure custom SMTP before inviting arbitrary public users;
also review Auth rate limits and CAPTCHA for a public deployment. Signed-in data is still cached in that browser profile: avoid shared
profiles, and use **Sign out** to clear that account's local cache.

## Sources and ongoing curation

The library uses 12 AI research domains plus a separate Life, Career & Finance area, with concept tags for cross-domain discovery. Publishers
such as Thinking Machines are source filters, not domains. Existing resource IDs are preserved
in `<!-- resource-id: ... -->` comments: keep these when renaming or moving entries so notes,
favorites and reading progress remain attached. Old topic URLs redirect to their replacement.

- `../Library/provenance.json` records acquisition origin, source URL and review scope,
  separately from publication dates. Missing dates are not guessed. `Recently added` uses the
  first Git commit that included each Library entry (matching a unique historical URL for pre-ID
  entries), not the publication or capture date. Full Git history is fetched in CI. Seven legacy
  entries with duplicate URLs or a changed URL have their original commit timestamps recorded
  explicitly in `provenance.addedAt`. The 178 entries already in the initial 2026-07-09 commit
  are only known to have been present **by** that date; their earlier individual addition dates
  cannot be reconstructed from this repository. Newly curated entries can explicitly set
  `provenance.addedAt` until committed, but only a commit-backed date is independently auditable.
- `../Library/intake.json` powers **Sources & inbox**, including pending references and explicit
  coverage limits. Only curated public references belong in this file. Pending X reposts with a
  capture timestamp appear in the dashboard's review feed, but are not represented as Library
  resources until explicitly added. A scoped source note is enough to add one; full-paper review is
  not a prerequisite. The Library's “Recently added”
  sort uses Library addition times; publication dates remain a separate sort.
- `bun scripts/capture-edge.ts` inventories open Edge tabs and compares normalized URLs against
  the generated library. Raw browser snapshots and audit evidence stay in ignored `.local-audit/`;
  they are not bundled or published. Run the content parser before a fresh comparison.
- `bun scripts/capture-x.ts --window WINDOW_ID --tab TAB_ID --pages 250` reads visible posts in
  the selected, signed-in Edge profile tab. Edge must permit JavaScript from Apple Events. This
  starts at the top and scrolls that tab (`--resume` keeps its current position), but never reads
  credentials or posts anything. Private checkpoints are saved every 20 scroll frames. Timeline observations alone
  cannot prove a complete repost archive, and original tweet dates are not repost dates.

Capture is an inventory step, not automatic knowledge creation. Read the primary source,
check existing entries, write a concise sourced note, then record its verification status.
Unreadable or metadata-only sources stay in the inbox until reviewed.

On the owner's Mac, `com.splendor1811.second-brain-weekly-sync` runs every Monday at 09:00
Asia/Ho_Chi_Minh. It checks the newest matching `Splendor1811/reposts` tab in signed-in Edge
and Lilian Weng's public RSS feed. New links are committed to `Library/intake.json` as
`needs-review` when the visible post/card contains AI-research terms, then pushed to `main`
(which triggers the Pages deployment); an unrelated external link alone is not enough to
enter the public AI inbox, and no article is
automatically summarized or promoted into the curated library. It will not sweep other Edge
tabs. X is skipped if Edge or that exact repost tab is unavailable, or if the tab is focused;
visible timeline capture cannot prove complete coverage and does not inspect author replies,
so inbox notes explicitly ask for manual source-link checking. Runs require this Mac to be
awake, network access, Edge's Apple Events JavaScript permission, and `gh` authentication.

To inspect it: `launchctl print gui/$(id -u)/com.splendor1811.second-brain-weekly-sync`.
To pause it: `launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/com.splendor1811.second-brain-weekly-sync.plist`.
The installed LaunchAgent is user-local and is not part of the public website.

For X references, inspect the author's own replies as well as the root post: source links
often appear only in a self-reply or link card. Keep the root-post and source-link reply
permalinks in `provenance.discoveryLinks`, and the actual paper/article in `sourceUrl`.
Do not attribute a quoted post or another person's comment to the root author. Record
limited or unreadable thread scans explicitly; reviewing one linked article does not mean
every link in that conversation has been reviewed. An older original-post date alone does
not establish that a repost falls outside the requested date range.

The content build checks source trails before publication: unknown resource/domain references,
duplicate inbox IDs, invalid statuses, credential-bearing URLs, and local/private address
literals fail the build. A primary-reviewed entry must include its source URL and review scope.
These checks do not replace manual privacy review or verify an article's factual claims.

For a read-only responsive smoke test against a running preview:

```bash
uv run --with playwright python scripts/qa-browser.py http://127.0.0.1:5275 ../.local-audit/qa-final
```

This uses an isolated Chrome context at 390, 768 and 1440 pixels and does not touch your browser
history, credentials or reading data.

## Keyboard

`⌘K` command palette · `?` shortcuts · `g` then `d/l/t/g/v/…` to navigate · `⇧T` toggle theme.

## Optional AI

Off by default. **Settings → AI features** enables Claude-powered note drafting with your own
Anthropic API key (stored locally, sent only to Anthropic).

## Structure

```
scripts/parse-content.ts   Markdown → content.json   (dev-server.ts = optional writeback)
scripts/generate-routes.ts Known BrowserRouter URLs → static route shells + 404.html
scripts/capture-*.ts       Private, read-only source inventories in ../.local-audit/
src/data/                  schema, parser (+ tests), topic styles, generated content.json
src/lib/                   db (Dexie), search, graph, srs, stats, export, ai, mdWriteback
src/components/            shell + reusable UI (Sidebar, ResourceCard, CommandPalette, …)
src/features/<area>/       one folder per surface (dashboard, library, resource, graph, …)
```
