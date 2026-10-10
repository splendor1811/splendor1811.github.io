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
- **Your data is yours.** Progress, notes, highlights, favorites, reviews and activity live in the
  browser (IndexedDB). Back them up as JSON from **Settings → Export backup**.
- **Static-hostable.** Builds to plain files for GitHub Pages.

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
bun run build          # -> dist/ (also parses Markdown, writes a 404.html SPA fallback)
bun run preview
```

Hosting is **GitHub Pages**. After reviewing and committing changes, an explicitly approved push
to `main` or `master` triggers `.github/workflows/deploy.yml`. That workflow builds `app/` and
publishes it. A successful local build does not mean the public website has been updated.

## Sources and ongoing curation

The library uses 12 research domains, with concept tags for cross-domain discovery. Publishers
such as Thinking Machines are source filters, not domains. Existing resource IDs are preserved
in `<!-- resource-id: ... -->` comments: keep these when renaming or moving entries so notes,
favorites and reading progress remain attached. Old topic URLs redirect to their replacement.

- `../Library/provenance.json` records acquisition origin, source URL and verification date,
  separately from publication dates. Missing dates are not guessed.
- `../Library/intake.json` powers **Sources & inbox**, including pending references and explicit
  coverage limits. Only curated public references belong in this file.
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
Unreadable or metadata-only sources stay in the inbox until reviewed. No recurring background
sync is installed.

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
scripts/capture-*.ts       Private, read-only source inventories in ../.local-audit/
src/data/                  schema, parser (+ tests), topic styles, generated content.json
src/lib/                   db (Dexie), search, graph, srs, stats, export, ai, mdWriteback
src/components/            shell + reusable UI (Sidebar, ResourceCard, CommandPalette, …)
src/features/<area>/       one folder per surface (dashboard, library, resource, graph, …)
```
