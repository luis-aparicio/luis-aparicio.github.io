#!/usr/bin/env node
// Sync portfolio projects from GitHub using the `gh` CLI.
//
// Every repo carrying the `portfolio` topic is a project. Its showcase data lives in
// `.portfolio/project.yml` (+ media files next to it). Repos without a manifest still get a
// basic card from their GitHub description, homepage and topics. See README.md.
//
// Output (both git-ignored, regenerated on every dev/build):
//   src/data/synced/<repo>.json   normalized Project objects, read by src/lib/projects.ts
//   public/synced/<repo>/...      media downloaded from the repo's .portfolio/ folder
//
// Env: PORTFOLIO_OWNER (default luis-aparicio), PORTFOLIO_TOPIC (default portfolio),
//      GH_TOKEN (auth for CI), GH_BIN (override the gh binary, used by tests).
// Flags: --soft  warn and keep the previous output instead of failing (ignored when CI=true,
//                so a broken sync never deploys a site that silently lost its projects).

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'yaml';

const run = promisify(execFile);
const GH = process.env.GH_BIN || 'gh';
const OWNER = process.env.PORTFOLIO_OWNER || 'luis-aparicio';
const TOPIC = process.env.PORTFOLIO_TOPIC || 'portfolio';
const MANIFEST_DIR = '.portfolio';
const DATA_OUT = 'src/data/synced';
const MEDIA_OUT = 'public/synced';
const MAX_MEDIA_BYTES = 25 * 1024 * 1024; // keep the site repo/deploys light
const soft = process.argv.includes('--soft') && !process.env.CI;

const VIDEO_EXT = new Set(['.mp4', '.webm', '.mov']);
const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.svg']);

const warn = (repo, msg) => console.warn(`  ! ${repo}: ${msg}`);

async function gh(args, { binary = false } = {}) {
  const { stdout } = await run(GH, args, {
    encoding: binary ? 'buffer' : 'utf8',
    maxBuffer: 128 * 1024 * 1024,
  });
  return stdout;
}

/** Fetch a file's raw bytes from a repo's default branch; null when it doesn't exist. */
async function fetchFile(repo, relPath) {
  const apiPath = relPath.split('/').map(encodeURIComponent).join('/');
  try {
    return await gh(
      ['api', '-H', 'Accept: application/vnd.github.raw', `repos/${OWNER}/${repo}/contents/${apiPath}`],
      { binary: true },
    );
  } catch (err) {
    if (/404|Not Found/i.test(`${err.stderr ?? ''}${err.message}`)) return null;
    throw err;
  }
}

/** Resolve a manifest-relative media path, rejecting anything that escapes .portfolio/. */
function safeRel(file) {
  if (typeof file !== 'string' || !file) return null;
  const norm = path.posix.normalize(file);
  if (norm.startsWith('..') || path.posix.isAbsolute(norm)) return null;
  return norm;
}

function mediaType(file, declared) {
  if (declared === 'image' || declared === 'video') return declared;
  const ext = path.posix.extname(file).toLowerCase();
  if (VIDEO_EXT.has(ext)) return 'video';
  return IMAGE_EXT.has(ext) ? 'image' : null;
}

const prettify = (name) => name.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const asList = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string' && x.trim()) : []);

/** Build one project (+ the media files to write) from repo metadata and its manifest. */
async function buildProject(repo, manifest) {
  const m = manifest ?? {};
  const files = []; // { dest, data }
  const publicUrl = (rel) => `/synced/${repo.name}/${rel}`;

  async function pull(rel) {
    const safe = safeRel(rel);
    if (!safe) return warn(repo.name, `ignoring unsafe media path "${rel}"`), null;
    const data = await fetchFile(repo.name, `${MANIFEST_DIR}/${safe}`);
    if (!data) return warn(repo.name, `media file not found: ${MANIFEST_DIR}/${safe}`), null;
    if (data.length > MAX_MEDIA_BYTES) {
      return warn(repo.name, `${safe} is ${(data.length / 1048576).toFixed(1)} MB (limit 25 MB), skipped`), null;
    }
    files.push({ dest: path.join(MEDIA_OUT, repo.name, safe), data });
    return publicUrl(safe);
  }

  const media = [];
  for (const raw of Array.isArray(m.media) ? m.media : []) {
    const item = typeof raw === 'string' ? { file: raw } : raw;
    const type = item && mediaType(String(item.file ?? ''), item.type);
    if (!item || !type) {
      warn(repo.name, `skipping media entry ${JSON.stringify(raw)} (unknown type)`);
      continue;
    }
    const src = await pull(item.file);
    if (!src) continue;
    const entry = { src, type, caption: item.caption, alt: item.alt };
    if (type === 'video') {
      if (item.poster) entry.poster = (await pull(item.poster)) ?? undefined;
      if (!entry.poster) warn(repo.name, `video ${item.file} has no usable poster; it can't be a card cover`);
    }
    media.push(entry);
  }

  const topics = (repo.repositoryTopics ?? [])
    .map((t) => t?.name ?? t?.topic?.name ?? t)
    .filter((t) => typeof t === 'string' && t !== TOPIC);

  const links = Array.isArray(m.links)
    ? m.links.filter((l) => l?.label && l?.url).map((l) => ({
        label: String(l.label),
        url: String(l.url),
        kind: l.kind ?? (/github\.com/.test(l.url) ? 'github' : undefined),
      }))
    : [];
  const isPublic = repo.visibility === 'PUBLIC';
  if (isPublic && !links.some((l) => l.kind === 'github')) {
    links.push({ label: 'Source', url: repo.url, kind: 'github' });
  }
  if (repo.homepageUrl && !links.some((l) => l.url === repo.homepageUrl)) {
    links.unshift({ label: 'Live Demo', url: repo.homepageUrl, kind: 'live' });
  }

  const skills = asList(m.skills);
  const project = {
    repo: repo.name,
    name: m.title || prettify(repo.name),
    description: m.description || repo.description || '',
    skills: skills.length ? skills : topics,
    status: m.status || undefined,
    featured: m.featured === true || undefined,
    order: Number.isFinite(m.order) ? m.order : undefined,
    links,
    media,
  };
  if (!project.description) warn(repo.name, 'no description (add one to .portfolio/project.yml or the repo)');
  return { project, files };
}

/**
 * Repos owned by OWNER that carry the topic, via the REST API. `gh repo list --topic` goes through
 * the search API, which does not reliably return private repos to fine-grained tokens; the
 * repos endpoints list everything the token can access. A user token (PORTFOLIO_TOKEN, or your
 * own login) uses /user/repos; the Actions GITHUB_TOKEN cannot, so it falls back to public repos.
 */
async function listTaggedRepos() {
  const page = async (endpoint) =>
    JSON.parse(await gh(['api', '--paginate', '--slurp', `${endpoint}${endpoint.includes('?') ? '&' : '?'}per_page=100`])).flat();
  let all;
  let source = 'user/repos';
  try {
    all = await page('user/repos?affiliation=owner');
  } catch {
    source = `users/${OWNER}/repos (public only)`;
    all = await page(`users/${OWNER}/repos`);
  }
  const owned = all.filter((r) => r.owner?.login?.toLowerCase() === OWNER.toLowerCase());
  const tagged = owned.filter((r) => !r.archived && (r.topics ?? []).includes(TOPIC));
  const priv = owned.filter((r) => r.private).length;
  console.log(`  ${owned.length} repo(s) visible via ${source} (${priv} private); ${tagged.length} tagged "${TOPIC}"`);
  return tagged.map((r) => ({
    name: r.name,
    description: r.description,
    homepageUrl: r.homepage,
    url: r.html_url,
    visibility: r.private ? 'PRIVATE' : 'PUBLIC',
    repositoryTopics: (r.topics ?? []).map((name) => ({ name })),
  }));
}

async function main() {
  console.log(`Syncing projects tagged "${TOPIC}" from ${OWNER}…`);
  const list = await listTaggedRepos();

  const projects = [];
  const files = [];
  for (const repo of list) {
    if (!/^[\w.-]+$/.test(repo.name)) continue; // never build a path from an odd name
    let manifest = null;
    try {
      const raw = await fetchFile(repo.name, `${MANIFEST_DIR}/project.yml`);
      if (raw) manifest = parse(raw.toString('utf8'));
    } catch (err) {
      warn(repo.name, `couldn't read ${MANIFEST_DIR}/project.yml (${String(err.message).split('\n')[0]}); using repo metadata`);
    }
    if (manifest?.hidden === true) {
      console.log(`  - ${repo.name} (hidden: true)`);
      continue;
    }
    const built = await buildProject(repo, manifest);
    projects.push(built.project);
    files.push(...built.files);
    console.log(`  ✓ ${repo.name}${manifest ? '' : ' (no manifest, repo metadata only)'} — ${built.project.media.length} media`);
  }

  // Everything fetched: now it's safe to replace the previous output.
  await rm(DATA_OUT, { recursive: true, force: true });
  await rm(MEDIA_OUT, { recursive: true, force: true });
  await mkdir(DATA_OUT, { recursive: true });
  for (const p of projects) {
    await writeFile(path.join(DATA_OUT, `${p.repo}.json`), JSON.stringify(p, null, 2) + '\n');
  }
  for (const f of files) {
    await mkdir(path.dirname(f.dest), { recursive: true });
    await writeFile(f.dest, f.data);
  }
  console.log(`Synced ${projects.length} project(s), ${files.length} media file(s).`);
}

main().catch((err) => {
  const msg = String(err.stderr || err.message || err).trim();
  if (soft) {
    console.warn(`Project sync skipped (${msg.split('\n')[0]}). Keeping previously synced data.`);
    return;
  }
  console.error(`Project sync failed: ${msg}`);
  process.exit(1);
});
