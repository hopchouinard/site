/**
 * Search Manager
 * 
 * Handles full-text search using MiniSearch library.
 * Loads search index and performs ranked searches across dashboard content.
 */

import MiniSearch from 'minisearch';

interface SearchIndexData {
  documents: Array<{
    id: string;
    date: string;
    title: string;
    summary: string;
    permalink: string;
    tags: string[];
  }>;
  index: any;
}

interface SearchResult {
  id: string;
  score: number;
  match: {
    title?: string[];
    summary?: string[];
    tags?: string[];
  };
}

let miniSearchInstance: MiniSearch | null = null;
let documentsMap: Map<string, any> = new Map();

/**
 * Initialize the search index by loading from /search-index.json
 * Should be called once when the page loads
 */
export async function initializeSearch(): Promise<boolean> {
  try {
    const response = await fetch('/search-index.json');
    
    if (!response.ok) {
      console.warn('Search index not found, search will be disabled');
      return false;
    }
    
    const data: SearchIndexData = await response.json();
    
    // Store documents for quick lookup
    data.documents.forEach(doc => {
      documentsMap.set(doc.id, doc);
    });
    
    // Create MiniSearch instance
    miniSearchInstance = new MiniSearch({
      fields: ['title', 'summary', 'tags', 'full_text'],
      storeFields: ['id', 'date', 'title', 'summary', 'permalink', 'tags'],
      searchOptions: {
        boost: { title: 2, tags: 1.5 },
        fuzzy: 0.2,
        prefix: true
      }
    });
    
    // Load the index
    miniSearchInstance = MiniSearch.loadJSON(JSON.stringify(data.index), {
      fields: ['title', 'summary', 'tags', 'full_text'],
      storeFields: ['id', 'date', 'title', 'summary', 'permalink', 'tags'],
      searchOptions: {
        boost: { title: 2, tags: 1.5 },
        fuzzy: 0.2,
        prefix: true
      }
    });
    
    console.log(`✅ Search initialized with ${data.documents.length} documents`);
    return true;
  } catch (error) {
    console.error('Failed to initialize search:', error);
    return false;
  }
}

/**
 * Perform a search query and return ranked results
 * @param query - Search query string
 * @returns Array of document IDs sorted by relevance, or null if search not available
 */
export function performSearch(query: string): string[] | null {
  if (!miniSearchInstance || !query || query.trim().length === 0) {
    return null;
  }
  
  try {
    const results: SearchResult[] = miniSearchInstance.search(query, {
      boost: { title: 2, tags: 1.5 },
      fuzzy: 0.2,
      prefix: true
    });
    
    // Return just the IDs (dates) sorted by score
    return results.map(result => result.id);
  } catch (error) {
    console.error('Search error:', error);
    return null;
  }
}

/**
 * Check if search is available
 */
export function isSearchAvailable(): boolean {
  return miniSearchInstance !== null;
}

/**
 * Get document by ID from the search index
 */
export function getDocument(id: string) {
  return documentsMap.get(id);
}

/**
 * Highlight matching terms in text (simple implementation)
 * For a more sophisticated approach, consider using mark.js library
 * @param text - Text to highlight
 * @param query - Search query
 * @returns Text with <mark> tags around matches
 */
export function highlightMatches(text: string, query: string): string {
  if (!query || query.trim().length === 0) {
    return text;
  }
  
  // Split query into terms
  const terms = query.toLowerCase().split(/\s+/);
  let highlightedText = text;
  
  terms.forEach(term => {
    if (term.length < 2) return; // Skip very short terms
    
    // Case-insensitive replacement with mark tags
    const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
  });
  
  return highlightedText;
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
