/**
 * Generates agent/catalog.py and agent/knowledge/catalog.md from
 * src/data/projects.ts so the agent knows every project on the site.
 *
 * Run from the repo root:  node scripts/gen-catalog.mjs
 */
import { buildSync } from 'esbuild';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const CATEGORY_LABEL = { frontend: 'Frontend', fullstack: 'Full-stack', ai: 'AI' };

const result = buildSync({
  entryPoints: ['src/data/projects.ts'],
  bundle: true,
  format: 'esm',
  write: false,
  platform: 'node',
});
const out = join(mkdtempSync(join(tmpdir(), 'gen-catalog-')), 'projects.mjs');
writeFileSync(out, result.outputFiles[0].text);
const { projects } = await import(pathToFileURL(out).href);

if (!Array.isArray(projects) || projects.length === 0) {
  throw new Error('no projects parsed from src/data/projects.ts');
}

const py = `"""Project catalog — generated from src/data/projects.ts.

Regenerate with:  node scripts/gen-catalog.mjs
"""

ALL_PROJECTS = ${JSON.stringify(projects, null, 2)}
`;
writeFileSync('agent/catalog.py', py);

const md = projects
  .map((p) => {
    const lines = [
      `## proj-${p.slug}`,
      `${p.title} — ${CATEGORY_LABEL[p.category] ?? p.category} project`,
      `Tech: ${p.tech.join(', ')}`,
      `Description: ${p.description}`,
    ];
    if (p.role) lines.push(`Role: ${p.role}`);
    if (p.highlights?.length) lines.push(`Highlights: ${p.highlights.join('; ')}`);
    if (p.client) lines.push(`Client: ${p.client}`);
    if (p.timeline) lines.push(`Timeline: ${p.timeline}`);
    lines.push(`Live: ${p.live || 'not deployed'} | GitHub: ${p.github}`);
    return lines.join('\n');
  })
  .join('\n\n');
writeFileSync(
  'agent/knowledge/catalog.md',
  `<!-- generated from src/data/projects.ts — run scripts/gen-catalog.mjs -->\n\n${md}\n`,
);

console.log(`wrote agent/catalog.py and agent/knowledge/catalog.md (${projects.length} projects)`);
