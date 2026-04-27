/**
 * Theme Configuration & Persistence
 * Manages global and page-specific color token overrides
 */

export enum ThemeScope {
  GLOBAL = 'GLOBAL',
  SINGLE_PAGE = 'SINGLE_PAGE',
  MULTI_PAGE = 'MULTI_PAGE'
}

export interface ColorTokenValue {
  value: string; // oklch or hex color
  scope: ThemeScope;
  appliedTo?: string[]; // page keys for MULTI_PAGE scope
  timestamp?: number;
}

export interface PageThemeOverrides {
  [tokenName: string]: ColorTokenValue;
}

export interface ThemeOverrideConfig {
  version: number;
  global: PageThemeOverrides;
  pageOverrides: {
    [pageKey: string]: PageThemeOverrides;
  };
  lastModified?: number;
}

// Default empty config
const DEFAULT_CONFIG: ThemeOverrideConfig = {
  version: 1,
  global: {},
  pageOverrides: {}
};

const STORAGE_KEY = 'fares_cv:theme_overrides';
const DEBOUNCE_DELAY = 500;

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Load theme config from localStorage
 */
export function loadThemeConfig(): ThemeOverrideConfig {
  try {
    if (typeof window === 'undefined') return DEFAULT_CONFIG;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_CONFIG;
    
    const parsed = JSON.parse(stored) as ThemeOverrideConfig;
    
    // Validate version
    if (parsed.version !== DEFAULT_CONFIG.version) {
      console.warn('[v0] Theme config version mismatch, using defaults');
      return DEFAULT_CONFIG;
    }
    
    return parsed;
  } catch (error) {
    console.error('[v0] Failed to load theme config:', error);
    return DEFAULT_CONFIG;
  }
}

/**
 * Save theme config to localStorage (debounced)
 */
export function saveThemeConfig(config: ThemeOverrideConfig): void {
  // Clear previous debounce timer
  if (debounceTimer) clearTimeout(debounceTimer);
  
  debounceTimer = setTimeout(() => {
    try {
      if (typeof window === 'undefined') return;
      
      config.lastModified = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      
      // Dispatch custom event for cross-tab sync
      window.dispatchEvent(
        new CustomEvent('theme-config-changed', { detail: config })
      );
    } catch (error) {
      console.error('[v0] Failed to save theme config:', error);
    }
  }, DEBOUNCE_DELAY);
}

/**
 * Set a global color token
 */
export function setGlobalToken(
  config: ThemeOverrideConfig,
  tokenName: string,
  value: string
): ThemeOverrideConfig {
  return {
    ...config,
    global: {
      ...config.global,
      [tokenName]: {
        value,
        scope: ThemeScope.GLOBAL,
        timestamp: Date.now()
      }
    }
  };
}

/**
 * Set a page-specific color token
 */
export function setPageToken(
  config: ThemeOverrideConfig,
  pageKey: string,
  tokenName: string,
  value: string
): ThemeOverrideConfig {
  return {
    ...config,
    pageOverrides: {
      ...config.pageOverrides,
      [pageKey]: {
        ...config.pageOverrides[pageKey],
        [tokenName]: {
          value,
          scope: ThemeScope.SINGLE_PAGE,
          timestamp: Date.now()
        }
      }
    }
  };
}

/**
 * Set a multi-page color token (applied to multiple pages)
 */
export function setMultiPageToken(
  config: ThemeOverrideConfig,
  tokenName: string,
  value: string,
  pageKeys: string[]
): ThemeOverrideConfig {
  const updated = { ...config };
  
  pageKeys.forEach(pageKey => {
    updated.pageOverrides = {
      ...updated.pageOverrides,
      [pageKey]: {
        ...updated.pageOverrides[pageKey],
        [tokenName]: {
          value,
          scope: ThemeScope.MULTI_PAGE,
          appliedTo: pageKeys,
          timestamp: Date.now()
        }
      }
    };
  });
  
  return updated;
}

/**
 * Get effective color for a token on a specific page
 * Respects hierarchy: page-specific > global > undefined
 */
export function getEffectiveColor(
  config: ThemeOverrideConfig,
  pageKey: string,
  tokenName: string
): string | undefined {
  // Check page-specific override first
  const pageOverride = config.pageOverrides[pageKey]?.[tokenName];
  if (pageOverride) return pageOverride.value;
  
  // Fall back to global
  const globalOverride = config.global[tokenName];
  if (globalOverride) return globalOverride.value;
  
  return undefined;
}

/**
 * Reset global theme to defaults
 */
export function resetGlobalTheme(config: ThemeOverrideConfig): ThemeOverrideConfig {
  return {
    ...config,
    global: {}
  };
}

/**
 * Reset page-specific theme to defaults
 */
export function resetPageTheme(config: ThemeOverrideConfig, pageKey: string): ThemeOverrideConfig {
  const updated = { ...config };
  delete updated.pageOverrides[pageKey];
  return updated;
}

/**
 * Remove a specific token from global config
 */
export function removeGlobalToken(
  config: ThemeOverrideConfig,
  tokenName: string
): ThemeOverrideConfig {
  const updated = { ...config };
  delete updated.global[tokenName];
  return updated;
}

/**
 * Remove a specific token from page config
 */
export function removePageToken(
  config: ThemeOverrideConfig,
  pageKey: string,
  tokenName: string
): ThemeOverrideConfig {
  const updated = { ...config };
  if (updated.pageOverrides[pageKey]) {
    delete updated.pageOverrides[pageKey][tokenName];
  }
  return updated;
}
