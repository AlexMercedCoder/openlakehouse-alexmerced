// Git-derived content dates for pages, used by JSON-LD (datePublished,
// dateModified) and the sitemap (lastmod).
//
// published = the first commit that added the source file.
// modified  = the last commit that changed it, skipping commits that only
//             touch shared chrome (network head, footer, consent banner,
//             analytics guard, framework upgrades). Put "[mechanical]" in
//             the subject of any metadata-only or chrome-only commit and it
//             is skipped too, so the dates track real content changes.
//
// Returns {} when git history is unavailable (for example a shallow clone),
// so pages and the sitemap omit dates rather than stamping the build date.
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const SKIP =
  /\[mechanical\]|network head|network footer|footer groups|cta strip|consent mode|report analytics only from the real domain|move to astro|webmcp|trailing-slash canonicals/i;

let gitOk;
function hasHistory() {
  if (gitOk !== undefined) return gitOk;
  try {
    gitOk = execFileSync('git', ['rev-parse', '--is-shallow-repository'], { cwd: root }).toString().trim() === 'false';
  } catch {
    gitOk = false;
  }
  return gitOk;
}

const cache = new Map();
function fileLog(file) {
  if (cache.has(file)) return cache.get(file);
  let rows = [];
  try {
    const out = execFileSync('git', ['log', '--follow', '--format=%cI%x09%s', '--', file], { cwd: root }).toString();
    rows = out
      .split('\n')
      .filter((line) => line.includes('\t'))
      .map((line) => {
        const [date, ...rest] = line.split('\t');
        return { date, subject: rest.join('\t') };
      });
  } catch {
    rows = [];
  }
  cache.set(file, rows);
  return rows;
}

/** Dates for a set of source files (paths relative to the repo root). */
export function fileDates(files) {
  if (!hasHistory()) return {};
  let published;
  let modified;
  for (const file of files) {
    if (!existsSync(path.join(root, file))) continue;
    const rows = fileLog(file); // newest first
    if (!rows.length) continue;
    const first = rows[rows.length - 1].date;
    const content = rows.find((row) => !SKIP.test(row.subject));
    const last = content ? content.date : first;
    if (!published || first < published) published = first;
    if (!modified || last > modified) modified = last;
  }
  if (!published) return {};
  if (modified < published) modified = published;
  return { published: published.slice(0, 10), modified: modified.slice(0, 10), modifiedIso: modified };
}

/** Source files behind a URL path: the page file, or a content entry with the same slug. */
export function sourcesFor(pathname) {
  const clean = pathname.replace(/^\/+|\/+$/g, '');
  if (!clean) return ['src/pages/index.astro'];
  const out = [`src/pages/${clean}.astro`, `src/pages/${clean}/index.astro`];
  const slug = clean.split('/').pop();
  const contentDir = path.join(root, 'src/content');
  if (clean.includes('/') && existsSync(contentDir)) {
    for (const col of readdirSync(contentDir)) {
      for (const ext of ['md', 'mdx']) out.push(`src/content/${col}/${slug}.${ext}`);
    }
  }
  return out.filter((f) => existsSync(path.join(root, f)));
}

/** Sitemap lastmod for a full URL, or undefined. */
export function lastmodFor(url) {
  const { modifiedIso } = fileDates(sourcesFor(new URL(url).pathname));
  return modifiedIso ? new Date(modifiedIso) : undefined;
}
