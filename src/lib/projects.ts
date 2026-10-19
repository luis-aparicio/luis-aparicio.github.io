import { config, type Project } from '../config';

// Written by `npm run sync` (scripts/sync-projects.mjs); absent until the first sync.
const synced = import.meta.glob<Project>('../data/synced/*.json', { eager: true, import: 'default' });

/**
 * Hand-written projects from config.ts merged with synced repos: featured first, then `order`.
 * A hand-written project with `repo` set is a fallback: it is replaced when that repo syncs
 * (e.g. a private repo the build token can't read yet).
 */
export function getProjects(): Project[] {
  const syncedProjects = Object.values(synced);
  const syncedRepos = new Set(syncedProjects.map((p) => p.repo));
  const handWritten = config.projects.filter((p) => !p.repo || !syncedRepos.has(p.repo));
  const all = [...handWritten, ...syncedProjects];
  return all
    .map((p, i) => ({ p, i }))
    .sort(
      (a, b) =>
        Number(!!b.p.featured) - Number(!!a.p.featured) ||
        (a.p.order ?? 100) - (b.p.order ?? 100) ||
        a.i - b.i,
    )
    .map(({ p }) => p);
}
