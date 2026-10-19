import { config, type Project } from '../config';

// Written by `npm run sync` (scripts/sync-projects.mjs); absent until the first sync.
const synced = import.meta.glob<Project>('../data/synced/*.json', { eager: true, import: 'default' });

/**
 * Hand-written projects from config.ts merged with synced repos. Projects named in
 * `config.projectOrder` come first, in that order; the rest follow: featured first, then `order`.
 * A hand-written project with `repo` set is a fallback: it is replaced when that repo syncs
 * (e.g. a private repo the build token can't read yet).
 */
const rank = (p: Project) => {
  const i = config.projectOrder.indexOf(p.repo ?? p.name);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
};

export function getProjects(): Project[] {
  const syncedProjects = Object.values(synced);
  const syncedRepos = new Set(syncedProjects.map((p) => p.repo));
  const handWritten = config.projects.filter((p) => !p.repo || !syncedRepos.has(p.repo));
  const all = [...handWritten, ...syncedProjects];
  return all
    .map((p, i) => ({ p, i }))
    .sort(
      (a, b) =>
        rank(a.p) - rank(b.p) ||
        Number(!!b.p.featured) - Number(!!a.p.featured) ||
        (a.p.order ?? 100) - (b.p.order ?? 100) ||
        a.i - b.i,
    )
    .map(({ p }) => p);
}
