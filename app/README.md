# Second Brain — personal AI learning platform

A local-first web app that turns the Markdown `Library/` (12 topics, 178 resources) into a
knowledge-management and learning-tracker: browse, filter, take notes & highlights, track
read/unread, spaced-repetition review, a knowledge-graph constellation, learning roadmaps,
progress dashboards, and a ⌘K command palette.

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
bun test               # parser unit tests
```

Run `dev` and `serve` together to add resources from the UI and have them written back into the
right `Library/*.md` file (then re-parsed and hot-reloaded). Without `serve` (e.g. the hosted site),
"Add resource" gives you a ready-to-paste Markdown snippet instead.

## Build & deploy

```bash
bun run build          # -> dist/ (also parses Markdown, writes a 404.html SPA fallback)
bun run preview
```

Hosting on **GitHub Pages**: make `Second_Brain/` its own GitHub repo and push. The included
workflow (`.github/workflows/deploy.yml`) builds `app/` with the correct base path and publishes.
Enable Pages → Source: **GitHub Actions**.

## Keyboard

`⌘K` command palette · `?` shortcuts · `g` then `d/l/t/g/v/…` to navigate · `⇧T` toggle theme.

## Optional AI

Off by default. **Settings → AI features** enables Claude-powered note drafting with your own
Anthropic API key (stored locally, sent only to Anthropic).

## Structure

```
scripts/parse-content.ts   Markdown → content.json   (dev-server.ts = optional writeback)
src/data/                  schema, parser (+ tests), topic styles, generated content.json
src/lib/                   db (Dexie), search, graph, srs, stats, export, ai, mdWriteback
src/components/            shell + reusable UI (Sidebar, ResourceCard, CommandPalette, …)
src/features/<area>/       one folder per surface (dashboard, library, resource, graph, …)
```
