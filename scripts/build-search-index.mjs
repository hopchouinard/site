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
const SOURCE_MANIFESTS_DIR = join(PROJECT_ROOT, 'data/publishing/source_manifests');
const STATIC_SOURCE_DIR = join(PROJECT_ROOT, 'site/static/source');
const PUBLIC_DIR = join(__dirname, '../public');
const DASHBOARD_FILE_REGEX = /^\d{4}-\d{2}-\d{2}\.json$/;

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

  // Skip auxiliary JSON artifacts (tag dumps, notes, etc.) that share the
  // publishing directory but aren't dashboard payloads.
  const jsonFiles = files.filter(f => DASHBOARD_FILE_REGEX.test(f));
  
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
    fields: ['date', 'title', 'summary', 'tags', 'full_text', 'path', 'artifactType', 'scope'],
    storeFields: ['date', 'title', 'summary', 'permalink', 'tags', 'scope', 'path', 'artifactType', 'snippet'],
    searchOptions: {
      boost: { title: 2, tags: 1.5, path: 1.2 },
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
      permalink: payload.permalink,
      scope: 'processed',
      path: '',
      artifactType: '',
      snippet: payload.summary?.substring(0, 280) || ''
    });
  }

  // Index source artifacts from manifests
  let manifestFiles = [];
  try {
    manifestFiles = await readdir(SOURCE_MANIFESTS_DIR);
    manifestFiles = manifestFiles.filter(f => f.endsWith('.json'));
  } catch (err) {
    console.log('⚠️  No source manifests found, skipping source artifact indexing');
  }

  for (const manifestFile of manifestFiles) {
    const manifestPath = join(SOURCE_MANIFESTS_DIR, manifestFile);
    const manifestContent = await readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);

    for (const artifact of manifest.artifacts || []) {
      // Read artifact content if it's a text file and under 200KB
      let artifactContent = '';
      if (artifact.sizeBytes && artifact.sizeBytes < 200000 &&
          (artifact.mime?.startsWith('text/') || artifact.mime?.includes('json'))) {
        try {
          const artifactPath = join(STATIC_SOURCE_DIR, manifest.date, artifact.relativePath);
          const fileContent = await readFile(artifactPath, 'utf-8');
          // Truncate to 10KB for search index to avoid bloat
          artifactContent = fileContent.substring(0, 10240);
        } catch (err) {
          // If file doesn't exist yet, use preview from manifest
          artifactContent = artifact.preview || '';
        }
      } else {
        artifactContent = artifact.preview || '';
      }

      // Create snippet from content or preview
      const snippet = artifactContent.substring(0, 280) || artifact.preview || '';

      documents.push({
        id: `${manifest.date}::source::${artifact.relativePath}`,
        date: manifest.date,
        title: artifact.relativePath.split('/').pop() || artifact.relativePath,
        summary: snippet,
        tags: artifact.tags?.join(' ') || '',
        full_text: artifactContent,
        permalink: `/daily/${manifest.date}/source/${encodeURIComponent(artifact.relativePath)}`,
        scope: 'source',
        path: artifact.relativePath,
        artifactType: artifact.artifactType,
        snippet: snippet
      });
    }
  }

  // Add documents to index
  miniSearch.addAll(documents);

  // Export index
  const indexData = {
    documents: documents.map(({ id, date, title, summary, permalink, tags, scope, path, artifactType, snippet }) => ({
      id,
      date,
      title,
      summary,
      permalink,
      tags: tags.split(' ').filter(Boolean),
      scope,
      path,
      artifactType,
      snippet
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
