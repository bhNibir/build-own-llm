#!/usr/bin/env bun
/**
 * Golden visual patch: slug-based ConceptAnim, dedupe visuals, content fixes.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LESSON_CONCEPTS } from '../components/diagrams/lesson-concepts';

const DOCS = join(dirname(fileURLToPath(import.meta.url)), '../content/docs');

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(p)));
    else if (e.name.endsWith('.mdx') && e.name !== 'index.mdx') files.push(p);
  }
  return files;
}

function patchConceptAnim(content: string, slug: string): string {
  if (!LESSON_CONCEPTS[slug]) return content;
  // Replace any existing ConceptAnim with slug-only version
  const tag = `<ConceptAnim slug="${slug}" />\n\n`;
  if (content.includes('<ConceptAnim')) {
    content = content.replace(/<ConceptAnim[^>]*\/?>\n*/g, '');
  }
  const h1 = content.match(/^# .+\n\n/m);
  if (h1) {
    const idx = content.indexOf(h1[0]) + h1[0].length;
    return content.slice(0, idx) + tag + content.slice(idx);
  }
  return tag + content;
}

function dedupeVisuals(content: string): string {
  // Remove Illustration when ConceptAnim present
  if (content.includes('<ConceptAnim')) {
    content = content.replace(/<Illustration[^>]*\/>\n*/g, '');
    content = content.replace(/<TokenFlow\s*\/>\n*/g, '');
  }
  return content;
}

function contentFixes(content: string, slug: string): string {
  // Unify probabilities
  content = content.replace(/apple 50%/g, 'apple 72%');
  content = content.replace(/banana 25%/g, 'banana 18%');
  content = content.replace(/mango 25%/g, 'mango 10%');
  content = content.replace(/P\(apple \| like\)/g, 'P(apple | i like)');

  if (slug === 'part-01-tokenizer/01-llm-kivabe-kaj-kore') {
    content = content.replace(
      /```\n(is → 100% chance)\n```/,
      '```\n(end of sentence — model learns from corpus)\n```',
    );
    // Remove duplicate second ConceptAnim block if pipeline-zoom needed - handled by single slug
    content = content.replace(/## পুরো Pipeline[\s\S]*?পরের Part-এ।\n\n/g, '');
  }

  if (slug === 'part-00-intro/03-roadmap') {
    content = content.replace(/# 🗺️ Course Roadmap/, '# Course Roadmap');
    content = content.replace(/\| 1 \| Data Pipeline \|/g, '| 1 | [Tokenizer](/docs/part-01-tokenizer) |');
    content = content.replace(/\| 0 \| Introduction \|/g, '| 0 | [Introduction](/docs/part-00-intro) |');
    content = content.replace(/\| Status \|\n\|[-| ]+\|\n([\s\S]*?)\n\n## Learning order/, (m) =>
      m.replace(/\| ✅ Ready \|/g, '| Available |'),
    );
    // Simplify mermaid - remove fake done classes
    content = content.replace(
      /```mermaid[\s\S]*?```\n\n## All 10 Modules/,
      '## All 10 Modules',
    );
  }

  if (slug === 'part-00-intro/01-what-is-llm') {
    content = content.replace(/# 🤖 What is an LLM\?/, '# What is an LLM?');
    content = content.replace(
      /```mermaid[\s\S]*?```\n\n## Autoregressive/,
      '## Autoregressive',
    );
    content = content.replace(
      /\{ emoji: "1️⃣"/g,
      '{ title: "1"',
    );
    content = content.replace(/\{ emoji: "2️⃣"/g, '{ title: "2"');
    content = content.replace(/\{ emoji: "3️⃣"/g, '{ title: "3"');
    content = content.replace(/\{ emoji: "4️⃣"/g, '{ title: "4"');
  }

  if (slug === 'part-01-tokenizer/05-encoding') {
    content = content.replace(/## কোড\n\n## গুরুত্বপূর্ণ/, '## গুরুত্বপূর্ণ');
  }

  return content;
}

const files = await walk(DOCS);
let updated = 0;
for (const file of files) {
  const slug = relative(DOCS, file).replace(/\.mdx$/, '');
  let content = await readFile(file, 'utf8');
  const orig = content;
  content = patchConceptAnim(content, slug);
  content = dedupeVisuals(content);
  content = contentFixes(content, slug);
  if (content !== orig) {
    await writeFile(file, content);
    updated++;
  }
}

console.log(`Golden patch: updated ${updated} lesson files`);
