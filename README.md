# luis-aparicio.github.io

Personal portfolio: Astro + Tailwind, deployed to GitHub Pages. Projects are **synced from my GitHub
repos** with the `gh` CLI, so a repo describes itself and the site picks it up.

## Showing a repo on the site

1. Add the `portfolio` topic to the repo: `gh repo edit --add-topic portfolio`
2. (Optional, for a richer card) add `.portfolio/project.yml` and media to the repo:

```yaml
# yaml-language-server: $schema=https://luis-aparicio.github.io/schema/project.schema.json
title: Crochet Pattern Designer
description: Full-stack TypeScript app for designing and generating crochet patterns.
skills: [TypeScript, Full Stack, Claude Code]
status: In Progress
featured: true
links:
  - { label: Live Demo, url: https://example.com, kind: live }
media:                       # paths are relative to .portfolio/; first item is the card cover
  - media/editor.png
  - { file: media/demo.mp4, poster: media/demo-poster.jpg, caption: Walkthrough }
```

Without a manifest the card is built from the repo's description, homepage and topics. Set
`hidden: true` to keep the topic but skip the project. Media over 25 MB is skipped; keep videos
short H.264 `.mp4`s. Public repos get an automatic Source link; private repos don't.

## How it syncs

`scripts/sync-projects.mjs` (run by `npm run dev` / `npm run build`, or `npm run sync`) lists the
owner's repos with the topic via `gh`, downloads each manifest and its media, and writes the
git-ignored `src/data/synced/*.json` and `public/synced/`. `src/lib/projects.ts` merges these with
the hand-written projects in `src/config.ts`.

Locally it uses your `gh` login (private repos included). A failed sync warns and keeps the previous
output; in CI (`CI=true`) it fails the build instead, so the deployed site never silently loses
projects.

## Deploy

`.github/workflows/deploy.yml` builds and deploys on every push to `master`, nightly, and on demand
(`gh workflow run deploy.yml`). The default `GITHUB_TOKEN` can only read **public** repos. To
include private repos, create a fine-grained token with read-only `Contents` + `Metadata` on them
and store it as the `PORTFOLIO_TOKEN` secret:

```bash
gh secret set PORTFOLIO_TOKEN
```

Remember that anything synced from a private repo is published on the public site.

## Develop

```bash
npm install
npm run dev     # syncs, then serves on :4321
npm run build   # syncs, then builds to dist/
```
