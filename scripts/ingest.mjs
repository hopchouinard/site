#!/usr/bin/env node
/**
 * Ingestion script: Converts data/publishing/*.json to Astro content collection
 * Runs during prebuild phase before Astro build
 */

import { readdir, readFile, writeFile, mkdir, unlink } from 'fs/promises';
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

function calculateStats(dashboards) {
  if (dashboards.length === 0) {
    return {
      totalDashboards: 0,
      totalInsights: 0,
      daysPublished: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  // Calculate total insights (notable_developments)
  const totalInsights = dashboards.reduce((sum, d) => 
    sum + (d.notable_developments?.length || 0), 0
  );

  // Calculate days published (date range)
  const dates = dashboards
    .map(d => new Date(d.date))
    .sort((a, b) => a.getTime() - b.getTime());
  const firstDate = dates[0];
  const lastDate = dates[dates.length - 1];
  const diffTime = Math.abs(lastDate.getTime() - firstDate.getTime());
  const daysPublished = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both endpoints

  return {
    totalDashboards: dashboards.length,
    totalInsights,
    daysPublished,
    lastUpdated: new Date().toISOString()
  };
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

  // Clean up stale markdown files that don't have corresponding JSON files
  const existingMarkdownFiles = await readdir(CONTENT_DIR);
  const jsonFileDates = new Set(jsonFiles.map(f => f.replace('.json', '')));
  const staleFiles = existingMarkdownFiles.filter(f => 
    f.endsWith('.md') && !jsonFileDates.has(f.replace('.md', ''))
  );
  
  for (const staleFile of staleFiles) {
    const staleFilePath = join(CONTENT_DIR, staleFile);
    await unlink(staleFilePath);
    console.log(`🗑️  Removed stale file: ${staleFile}`);
  }

  const allTags = new Set();
  const tagFrequencies = {};
  const dashboards = [];
  let processed = 0;

  // Category mapping for deriving categories from tags
  const categoryMapping = {
    'AI Trends': ['AI', 'Machine Learning', 'Neural Networks', 'LLM', 'Generative', 'GPT', 'Claude', 'Gemini'],
    'Market Analysis': ['Funding', 'Startups', 'Investment', 'Market', 'Valuation', 'IPO', 'Acquisition'],
    'Regulation': ['Policy', 'Ethics', 'Governance', 'Compliance', 'Privacy', 'GDPR', 'Regulation'],
    'Strategy': ['Business', 'Competitive', 'Strategic', 'Planning', 'Enterprise'],
    'Tooling': ['Development', 'Infrastructure', 'Tools', 'Framework', 'Platform', 'DevOps']
  };

  for (const file of jsonFiles) {
    const filePath = join(PUBLISHING_DIR, file);
    const content = await readFile(filePath, 'utf-8');
    const payload = JSON.parse(content);

    // Aggregate tags and count frequencies
    (payload.tags || []).forEach(tag => {
      allTags.add(tag);
      tagFrequencies[tag] = (tagFrequencies[tag] || 0) + 1;
    });

    // Derive categories from tags
    const derivedCategories = new Set();
    (payload.tags || []).forEach(tag => {
      for (const [category, keywords] of Object.entries(categoryMapping)) {
        if (keywords.some(keyword => tag.toLowerCase().includes(keyword.toLowerCase()))) {
          derivedCategories.add(category);
        }
      }
    });
    payload.categories = Array.from(derivedCategories);

    // Store dashboard for stats calculation
    dashboards.push({
      date: payload.date,
      tags: payload.tags || [],
      categories: payload.categories,
      notable_developments: payload.notable_developments || [],
      sections: payload.sections || []
    });

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

  // Write tag frequencies (sorted by count descending)
  const sortedTagFrequencies = Object.entries(tagFrequencies)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  await writeFile(
    join(DATA_DIR, 'tag-frequencies.json'),
    JSON.stringify(sortedTagFrequencies, null, 2),
    'utf-8'
  );

  // Write category mappings
  await writeFile(
    join(DATA_DIR, 'categories.json'),
    JSON.stringify(categoryMapping, null, 2),
    'utf-8'
  );

  // Calculate and write stats
  const stats = calculateStats(dashboards);
  await writeFile(
    join(DATA_DIR, 'stats.json'),
    JSON.stringify(stats, null, 2),
    'utf-8'
  );

  return { count: processed, tags: allTags, stats };
}

try {
  const result = await ingestDashboards();
  console.log(`✅ Ingestion complete: ${result.count} dashboards processed`);
  console.log(`🏷️  Extracted ${result.tags.size} unique tags`);
  if (result.stats) {
    console.log(`📊 Stats: ${result.stats.totalInsights} insights over ${result.stats.daysPublished} days`);
  }
} catch (err) {
  console.error('❌ Ingestion failed:', err.message);
  process.exit(1);
}
