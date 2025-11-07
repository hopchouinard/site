#!/usr/bin/env node
/**
 * Ingestion script: Converts data/publishing/*.json to Astro content collection
 * Runs during prebuild phase before Astro build
 */

import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '../..');
const PUBLISHING_DIR = join(PROJECT_ROOT, 'data/publishing');
const CONTENT_DIR = join(__dirname, '../src/content/dashboards');
const DATA_DIR = join(__dirname, '../src/data');

console.log('📦 Starting content ingestion...');

async function ensureDir(path) {
  try {
    await mkdir(path, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function ingestDashboards() {
  await ensureDir(CONTENT_DIR);
  await ensureDir(DATA_DIR);

  // Read all JSON files from publishing directory
  let files;
  try {
    files = await readdir(PUBLISHING_DIR);
  } catch (err) {
    console.log('⚠️  No publishing directory found, creating sample data...');
    await ensureDir(PUBLISHING_DIR);
    return { count: 0, tags: new Set() };
  }

  const jsonFiles = files.filter(f => f.endsWith('.json'));
  
  if (jsonFiles.length === 0) {
    console.log('⚠️  No dashboard data found in data/publishing/');
    return { count: 0, tags: new Set() };
  }

  const allTags = new Set();
  let processed = 0;

  for (const file of jsonFiles) {
    const filePath = join(PUBLISHING_DIR, file);
    const content = await readFile(filePath, 'utf-8');
    const payload = JSON.parse(content);

    // Aggregate tags
    payload.tags?.forEach(tag => allTags.add(tag));

    // Create frontmatter
    const frontmatter = {
      date: payload.date,
      generated: payload.generated,
      domains_count: payload.domains_count,
      title: payload.title,
      summary: payload.summary,
      tags: payload.tags || [],
      categories: payload.categories || [],
      sections: payload.sections || [],
      notable_developments: payload.notable_developments || [],
      strategic_implications: payload.strategic_implications || '',
      recommendations: payload.recommendations || [],
      permalink: payload.permalink
    };

    // Create markdown file with frontmatter
    const markdownContent = `---
date: ${JSON.stringify(frontmatter.date)}
generated: ${JSON.stringify(frontmatter.generated)}
domains_count: ${frontmatter.domains_count}
title: ${JSON.stringify(frontmatter.title)}
summary: ${JSON.stringify(frontmatter.summary)}
tags: ${JSON.stringify(frontmatter.tags)}
categories: ${JSON.stringify(frontmatter.categories)}
sections: ${JSON.stringify(frontmatter.sections)}
notable_developments: ${JSON.stringify(frontmatter.notable_developments)}
strategic_implications: ${JSON.stringify(frontmatter.strategic_implications)}
recommendations: ${JSON.stringify(frontmatter.recommendations)}
permalink: ${JSON.stringify(frontmatter.permalink)}
---

${payload.raw_markdown || ''}
`;

    const outputFile = join(CONTENT_DIR, `${payload.date}.md`);
    await writeFile(outputFile, markdownContent, 'utf-8');
    processed++;
  }

  // Write aggregated tags to data file
  const tagsArray = Array.from(allTags).sort();
  await writeFile(
    join(DATA_DIR, 'tags.json'),
    JSON.stringify(tagsArray, null, 2),
    'utf-8'
  );

  return { count: processed, tags: allTags };
}

try {
  const result = await ingestDashboards();
  console.log(`✅ Ingestion complete: ${result.count} dashboards processed`);
  console.log(`🏷️  Extracted ${result.tags.size} unique tags`);
} catch (err) {
  console.error('❌ Ingestion failed:', err.message);
  process.exit(1);
}
