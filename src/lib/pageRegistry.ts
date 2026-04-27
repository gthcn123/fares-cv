/**
 * Page Registry
 * Centralized mapping of all routes with human-readable labels for theme targeting
 */

export interface PageInfo {
  path: string;
  label: string;
  description?: string;
}

export const PAGE_REGISTRY: Record<string, PageInfo> = {
  home: {
    path: '/',
    label: 'Home',
    description: 'Landing and hero section'
  },
  explore: {
    path: '/explore',
    label: 'Explore',
    description: 'Workshop and project showcase'
  },
  comments: {
    path: '/comments',
    label: 'Comments',
    description: 'Comments section'
  }
};

/**
 * Get all available pages for multi-page selection
 */
export function getAllPages(): Array<{ key: string; path: string; label: string }> {
  return Object.entries(PAGE_REGISTRY).map(([key, info]) => ({
    key,
    path: info.path,
    label: info.label
  }));
}

/**
 * Get page info by path
 */
export function getPageByPath(path: string): PageInfo | null {
  const entry = Object.entries(PAGE_REGISTRY).find(([_, info]) => info.path === path);
  return entry ? entry[1] : null;
}

/**
 * Get page key by path
 */
export function getPageKeyByPath(path: string): string | null {
  const entry = Object.entries(PAGE_REGISTRY).find(([_, info]) => info.path === path);
  return entry ? entry[0] : null;
}

/**
 * Normalize path for comparison
 */
export function normalizePath(path: string): string {
  return path.replace(/\/$/, '') || '/';
}
