#!/usr/bin/env node
/**
 * Build search index using MiniSearch
 * Runs during prebuild phase before Astro build
 */

import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createGzip } from 'zlib';
import { pipeline } from 'stream/promises';
import { createReadStream, createWriteStream } from 'fs';
import MiniSearch from 'minisearch';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '../..');
const PUBLISHING_DIR = join(PROJECT_ROOT, 'data/publishing');
const PUBLIC_DIR = join(__dirname, '../public');

console.log('🔍 Building search index...');

async function buildSearchIndex() {
  // Read all JSON files from publishing directory
  let files;
  try {
    files = await readdir(PUBLISHING_DIR);
  } catch (err) {
    console.log('⚠️  No publishing directory found, skipping search index');
    // Create empty index
    await writeFile(
      join(PUBLIC_DIR, 'search-index.json'),
      JSON.stringify({ documents: [], index: {} }),
      'utf-8'
    );
    return { count: 0, size: 0 };
  }

  const jsonFiles = files.filter(f => f.endsWith('.json'));
  
  if (jsonFiles.length === 0) {
    console.log('⚠️  No dashboard data found, creating empty search index');
    await writeFile(
      join(PUBLIC_DIR, 'search-index.json'),
      JSON.stringify({ documents: [], index: {} }),
      'utf-8'
    );
    return { count: 0, size: 0 };
  }

  // Configure MiniSearch
  const miniSearch = new MiniSearch({
    fields: ['date', 'title', 'summary', 'tags', 'full_text'],
    storeFields: ['date', 'title', 'summary', 'permalink', 'tags'],
    searchOptions: {
      boost: { title: 2, tags: 1.5 },
      fuzzy: 0.2
    }
  });

  const documents = [];

  for (const file of jsonFiles) {
    const filePath = join(PUBLISHING_DIR, file);
    const content = await readFile(filePath, 'utf-8');
    const payload = JSON.parse(content);

    // Build full_text from summary and sections
    const sectionsText = payload.sections
      ?.map(s => `${s.heading} ${s.content}`)
      .join(' ') || '';
    
    const full_text = [
      payload.summary,
      sectionsText,
      payload.strategic_implications,
      payload.notable_developments?.join(' ')
    ].filter(Boolean).join(' ');

    documents.push({
      id: payload.date,
      date: payload.date,
      title: payload.title,
      summary: payload.summary,
      tags: payload.tags?.join(' ') || '',
      full_text: full_text,
      permalink: payload.permalink
    });
  }

  // Add documents to index
  miniSearch.addAll(documents);

  // Export index
  const indexData = {
    documents: documents.map(({ id, date, title, summary, permalink, tags }) => ({
      id,
      date,
      title,
      summary,
      permalink,
      tags: tags.split(' ').filter(Boolean)
    })),
    index: miniSearch.toJSON()
  };

  const indexPath = join(PUBLIC_DIR, 'search-index.json');
  const indexJson = JSON.stringify(indexData);
  await writeFile(indexPath, indexJson, 'utf-8');

  // Check file size
  const stats = await stat(indexPath);
  const sizeMB = stats.size / (1024 * 1024);

  // Compress if > 2MB
  if (sizeMB > 2) {
    console.log(`📦 Index is ${sizeMB.toFixed(2)}MB, compressing...`);
    const gzipPath = `${indexPath}.gz`;
    await pipeline(
      createReadStream(indexPath),
      createGzip(),
      createWriteStream(gzipPath)
    );
    const gzipStats = await stat(gzipPath);
    const gzipSizeMB = gzipStats.size / (1024 * 1024);
    console.log(`✅ Compressed to ${gzipSizeMB.toFixed(2)}MB`);
  }

  return { count: documents.length, size: sizeMB };
}

try {
  const result = await buildSearchIndex();
  console.log(`✅ Search index built: ${result.count} documents indexed`);
  console.log(`📊 Index size: ${result.size.toFixed(2)}MB`);
} catch (err) {
  console.error('❌ Search index build failed:', err.message);
  process.exit(1);
}
