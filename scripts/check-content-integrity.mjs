#!/usr/bin/env node
/**
 * Content integrity: ConceptAnim slugs, playground IDs, probability canon.
 * Run: node scripts/check-content-integrity.mjs
 */
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(ROOT, 'content/docs');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(p)));
    else if (e.name.endsWith('.mdx') && e.name !== 'index.mdx') files.push(p);
  }
  return files;
}

function extractSlugs(lessonConceptsSrc) {
  const slugs = new Set();
  for (const m of lessonConceptsSrc.matchAll(/'([^']+)':\s*\{/g)) slugs.add(m[1]);
  return slugs;
}

function extractConceptNames(conceptAnimSrc) {
  const names = new Set();
  const block = conceptAnimSrc.match(/const concepts[\s\S]*?= \{([\s\S]*?)\n\};/);
  if (!block) return names;
  for (const m of block[1].matchAll(/'([^']+)':/g)) names.add(m[1]);
  return names;
}

function extractPlaygroundIds(src) {
  const ids = new Set();
  for (const m of src.matchAll(/'part-\d[^']*':\s*\{/g)) ids.add(m[0].slice(1, m[0].indexOf("'|" )));
  for (const m of src.matchAll(/'(part-\d[^']+)':\s*\{/g)) ids.add(m[1]);
  return ids;
}

const errors = [];
const warnings = [];

const lessonConcepts = await readFile(join(ROOT, 'components/diagrams/lesson-concepts.ts'), 'utf8');
const conceptAnim = await readFile(join(ROOT, 'components/diagrams/ConceptAnim.tsx'), 'utf8');
const sharedData = await readFile(join(ROOT, 'components/diagrams/shared-data.ts'), 'utf8');
const pgMain = await readFile(join(ROOT, 'components/playground/playgrounds.ts'), 'utf8');
const pg35 = await readFile(join(ROOT, 'components/playground/playgrounds-part03-05.ts'), 'utf8');
const pg69 = await readFile(join(ROOT, 'components/playground/playgrounds-part06-09.ts'), 'utf8');

const knownSlugs = extractSlugs(lessonConcepts);
const knownNames = extractConceptNames(conceptAnim);
const knownPlaygrounds = new Set([
  ...extractPlaygroundIds(pgMain),
  ...extractPlaygroundIds(pg35),
  ...extractPlaygroundIds(pg69),
]);

if (!sharedData.includes('probs: [0.5, 0.25, 0.25]')) {
  errors.push('shared-data NEXT_AFTER_I_LIKE must be [0.5, 0.25, 0.25]');
}

for (const m of lessonConcepts.matchAll(/name:\s*'([^']+)'/g)) {
  if (!knownNames.has(m[1])) errors.push(`lesson-concepts name not in ConceptAnim: ${m[1]}`);
}

const files = await walk(DOCS);
const usedSlugs = new Set();
const usedPlaygrounds = new Set();

for (const file of files) {
  const content = await readFile(file, 'utf8');
  const rel = file.slice(ROOT.length + 1);

  for (const m of content.matchAll(/<ConceptAnim\s+slug="([^"]+)"/g)) {
    usedSlugs.add(m[1]);
    if (!knownSlugs.has(m[1])) errors.push(`${rel}: unknown ConceptAnim slug ${m[1]}`);
  }

  for (const m of content.matchAll(/<(?:Playground|CodeRun)\s+[^>]*id="([^"]+)"/g)) {
    usedPlaygrounds.add(m[1]);
    if (!knownPlaygrounds.has(m[1])) errors.push(`${rel}: unknown Playground id ${m[1]}`);
  }

  if (/72%|0\.72|apple 72|banana 18|mango 10/.test(content) && !rel.includes('part-legacy')) {
    errors.push(`${rel}: forbidden 72/18/10 probability (use 50/25/25)`);
  }
}

const bigramPredict = await readFile(join(ROOT, 'components/diagrams/BigramPredictAnim.tsx'), 'utf8');
if (/p:\s*0\.72|0\.18,\s*0\.1/.test(bigramPredict)) {
  errors.push('BigramPredictAnim still hardcodes 72/18/10');
}

const sampling = await readFile(join(ROOT, 'components/diagrams/SamplingBarsAnim.tsx'), 'utf8');
if (/probs\s*=\s*\[0\.72/.test(sampling)) {
  errors.push('SamplingBarsAnim default still 72/18/10');
}

console.log(`Checked ${files.length} lessons`);
console.log(`ConceptAnim slugs used: ${usedSlugs.size}/${knownSlugs.size}`);
console.log(`Playground ids used: ${usedPlaygrounds.size}`);

if (warnings.length) {
  console.log('\nWarnings:');
  for (const w of warnings) console.log('  ⚠', w);
}

if (errors.length) {
  console.error('\nIntegrity errors:');
  for (const e of errors) console.error('  ✗', e);
  process.exit(1);
}

console.log('\n✓ Content integrity OK');
