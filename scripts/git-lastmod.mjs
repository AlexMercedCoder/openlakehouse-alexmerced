// Git-derived sitemap lastmod: the date of the last commit that touched the
// source file(s) behind a URL. Returns undefined when git history is not
// available (for example a shallow clone), so the sitemap omits lastmod
// instead of stamping every URL with the build date.
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let gitOk;
function hasHistory() {
  if (gitOk !== undefined) return gitOk;
  try {
    const shallow = execFileSync('git', ['rev-parse', '--is-shallow-repository'], { cwd: root }).toString().trim();
    gitOk = shallow === 'false';
  } catch {
    gitOk = false;
  }
  return gitOk;
}

function candidates(pathname) {
  const clean = pathname.replace(/^\/+|\/+$/g, '');
  const out = [];
  if (!clean) return ['src/pages/index.astro'];
  out.push(`src/pages/${clean}.astro`, `src/pages/${clean}/index.astro`);
  const slug = clean.split('/').pop();
  const contentDir = path.join(root, 'src/content');
  if (existsSync(contentDir)) {
    for (const col of readdirSync(contentDir)) {
      for (const ext of ['md', 'mdx']) out.push(`src/content/${col}/${slug}.${ext}`);
    }
  }
  return out;
}

export function gitLastmod(url) {
  if (!hasHistory()) return undefined;
  const files = candidates(new URL(url).pathname).filter((f) => existsSync(path.join(root, f)));
  if (!files.length) return undefined;
  try {
    const iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', ...files], { cwd: root }).toString().trim();
    return iso ? new Date(iso) : undefined;
  } catch {
    return undefined;
  }
}
