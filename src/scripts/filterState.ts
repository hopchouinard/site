interface Dashboard {
  date: string;
  title: string;
  summary: string;
  tags: string[];
  categories: string[];
  url: string;
}

interface FilterState {
  selectedTags: Set<string>;
  selectedCategories: Set<string>;
  searchQuery: string;
  allDashboards: Dashboard[];
  searchResultIds: string[] | null; // IDs from MiniSearch, sorted by relevance
}

class FilterStateManager {
  private state: FilterState = {
    selectedTags: new Set(),
    selectedCategories: new Set(),
    searchQuery: '',
    allDashboards: [],
    searchResultIds: null
  };
  
  private listeners: Set<() => void> = new Set();
  
  constructor(dashboards: Dashboard[]) {
    this.state.allDashboards = dashboards;
  }
  
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  private notify() {
    this.listeners.forEach(listener => listener());
  }
  
  toggleTag(tag: string) {
    if (this.state.selectedTags.has(tag)) {
      this.state.selectedTags.delete(tag);
    } else {
      this.state.selectedTags.add(tag);
    }
    this.notify();
  }
  
  toggleCategory(category: string) {
    if (this.state.selectedCategories.has(category)) {
      this.state.selectedCategories.delete(category);
    } else {
      this.state.selectedCategories.add(category);
    }
    this.notify();
  }
  
  setSearchQuery(query: string, searchResultIds: string[] | null = null) {
    this.state.searchQuery = query.toLowerCase();
    this.state.searchResultIds = searchResultIds;
    this.notify();
  }
  
  clearTagFilters() {
    this.state.selectedTags.clear();
    this.notify();
  }
  
  clearAllFilters() {
    this.state.selectedTags.clear();
    this.state.selectedCategories.clear();
    this.state.searchQuery = '';
    this.state.searchResultIds = null;
    this.notify();
  }
  
  getFilteredDashboards(): Dashboard[] {
    let filtered = this.state.allDashboards;
    
    // Apply search first (if MiniSearch results are available)
    if (this.state.searchQuery && this.state.searchResultIds !== null) {
      // Use MiniSearch ranked results
      const searchResultSet = new Set(this.state.searchResultIds);
      filtered = filtered.filter(dashboard => searchResultSet.has(dashboard.date));
      
      // Sort by search relevance (order from MiniSearch)
      const orderMap = new Map(this.state.searchResultIds.map((id, index) => [id, index]));
      filtered.sort((a, b) => {
        const orderA = orderMap.get(a.date) ?? Infinity;
        const orderB = orderMap.get(b.date) ?? Infinity;
        return orderA - orderB;
      });
    } else if (this.state.searchQuery) {
      // Fallback to simple string matching if MiniSearch not available
      filtered = filtered.filter(dashboard => {
        const searchableText = `${dashboard.title} ${dashboard.summary} ${dashboard.tags.join(' ')}`.toLowerCase();
        return searchableText.includes(this.state.searchQuery);
      });
    }
    
    // Apply tag filters
    if (this.state.selectedTags.size > 0) {
      filtered = filtered.filter(dashboard =>
        dashboard.tags.some(tag => this.state.selectedTags.has(tag))
      );
    }
    
    // Apply category filters
    if (this.state.selectedCategories.size > 0) {
      filtered = filtered.filter(dashboard =>
        dashboard.categories.some(cat => this.state.selectedCategories.has(cat))
      );
    }
    
    return filtered;
  }
  
  getState() {
    return { ...this.state };
  }
}

export { FilterStateManager };
export type { Dashboard, FilterState };
