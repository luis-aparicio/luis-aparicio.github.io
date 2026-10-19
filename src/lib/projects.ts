import { config, type Project } from '../config';

// Written by `npm run sync` (scripts/sync-projects.mjs); absent until the first sync.
const synced = import.meta.glob<Project>('../data/synced/*.json', { eager: true, import: 'default' });

/** Hand-written projects from config.ts merged with synced repos: featured first, then `order`. */
export function getProjects(): Project[] {
  const all = [...config.projects, ...Object.values(synced)];
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
