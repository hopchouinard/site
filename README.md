# NeuroHelix Site

Static site frontend for NeuroHelix AI research intelligence dashboards. Built with Astro v5, Tailwind CSS v4, and MiniSearch.

## 🚀 Project Structure

```text
/
├── public/              # Static assets (logo, hero image, search index)
├── scripts/            # Prebuild scripts (ingest, search index)
├── src/
│   ├── components/     # Reusable Astro components
│   ├── content/        # Content collections (dashboards)
│   ├── data/           # Generated data (tags, stats)
│   ├── layouts/        # Page layouts
│   ├── pages/          # Site pages (index, dashboard routes)
│   ├── scripts/        # Client-side scripts (search, filters)
│   └── styles/         # Global and component styles
└── package.json
```

## ✨ Features

- **Full-Text Search:** MiniSearch-powered ranked search with fuzzy matching
- **Smart Filtering:** Filter by tags and categories with instant updates
- **GitHub-Style Markdown:** Beautiful typography with Fira Code + Inter
- **Heading Anchors:** Deep linking to specific sections (#executive-summary)
- **Responsive Design:** Mobile-first with smooth transitions
- **Accessibility:** WCAG AA compliant with keyboard navigation
- **Dark Theme:** Modern dark UI with purple accent colors

## 🧞 Commands

All commands are run from the site directory:

| Command | Action |
| :------ | :----- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start dev server at `localhost:4321` |
| `pnpm build` | **Run prebuild + build** production site to `./dist/` |
| `pnpm preview` | Preview production build locally |
| `node scripts/ingest.mjs` | Manually run data ingestion (prebuild) |
| `node scripts/build-search-index.mjs` | Manually build search index (prebuild) |
| `pnpm astro check` | Type-check the project |

### Two-Phase Build Process

The build has two phases:
1. **Prebuild:** Ingests JSON data → Markdown + search index
2. **Astro Build:** Static site generation

The `pnpm build` command automatically runs both phases.

## 🔍 Search Implementation

The site features MiniSearch for client-side full-text search:
- Search index generated during prebuild from `../data/publishing/*.json`
- Indexes: title (2x boost), summary, tags (1.5x boost), full_text
- Fuzzy matching (0.2) and prefix search enabled
- Falls back to simple string matching if index unavailable

## 📊 Data Pipeline

```
Parent: ../data/publishing/*.json
    ↓
scripts/ingest.mjs
    ↓
src/content/dashboards/*.md + src/data/*.json
    ↓
Astro Content Collections
    ↓
Static Site (dist/)
```

## 📊 Cloudflare Analytics

The site is configured to use Cloudflare Web Analytics (privacy-friendly, no cookies).

**Setup:**
1. Get token from Cloudflare Dashboard (Analytics & Logs → Web Analytics)
2. Create `.env` file in site directory:
   ```env
   PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN=your_token_here
   ```
3. For production: Add token to Cloudflare Pages environment variables

See **CLOUDFLARE_ANALYTICS_SETUP.md** for detailed instructions.

## 📚 Documentation

- **IMPLEMENTATION_SUMMARY.md** - Complete implementation details
- **CLOUDFLARE_ANALYTICS_SETUP.md** - Analytics configuration guide
- **WARP.md** - Project context for AI assistants
- **Astro Docs:** [docs.astro.build](https://docs.astro.build)

## 🚀 Deployment

Designed for Cloudflare Pages:
- Build command: `pnpm build`
- Output directory: `dist`
- Node version: 18+
