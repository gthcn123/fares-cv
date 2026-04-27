/**
 * CSS Variable Injector
 * Dynamically injects theme overrides into the DOM
 */

const GLOBAL_STYLE_ID = 'theme-global-overrides';
const PAGE_STYLE_ID_PREFIX = 'theme-page-override-';

/**
 * Generate CSS for global overrides
 */
function generateGlobalCSS(overrides: Record<string, string>): string {
  if (Object.keys(overrides).length === 0) return '';
  
  const declarations = Object.entries(overrides)
    .map(([token, value]) => `  ${token}: ${value} !important;`)
    .join('\n');
  
  return `:root {\n${declarations}\n}`;
}

/**
 * Generate CSS for page-specific overrides (using CSS custom property cascade)
 */
function generatePageCSS(overrides: Record<string, string>): string {
  if (Object.keys(overrides).length === 0) return '';
  
  const declarations = Object.entries(overrides)
    .map(([token, value]) => `  ${token}: ${value} !important;`)
    .join('\n');
  
  return `html, body {\n${declarations}\n}`;
}

/**
 * Inject global theme overrides into the DOM
 */
export function injectGlobalTheme(overrides: Record<string, string>): void {
  if (typeof document === 'undefined') return;
  
  // Remove existing style if present
  const existing = document.getElementById(GLOBAL_STYLE_ID);
  if (existing) existing.remove();
  
  // Create and inject new style
  const css = generateGlobalCSS(overrides);
  if (!css) return; // No overrides to inject
  
  const style = document.createElement('style');
  style.id = GLOBAL_STYLE_ID;
  style.textContent = css;
  style.setAttribute('data-scope', 'global');
  
  document.head.appendChild(style);
}

/**
 * Inject page-specific theme overrides into the DOM
 */
export function injectPageTheme(pageKey: string, overrides: Record<string, string>): void {
  if (typeof document === 'undefined') return;
  
  const styleId = `${PAGE_STYLE_ID_PREFIX}${pageKey}`;
  
  // Remove existing style if present
  const existing = document.getElementById(styleId);
  if (existing) existing.remove();
  
  // Create and inject new style
  const css = generatePageCSS(overrides);
  if (!css) return; // No overrides to inject
  
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = css;
  style.setAttribute('data-scope', 'page');
  style.setAttribute('data-page', pageKey);
  
  document.head.appendChild(style);
}

/**
 * Clear all page-specific theme overrides for a specific page
 */
export function clearPageTheme(pageKey: string): void {
  if (typeof document === 'undefined') return;
  
  const styleId = `${PAGE_STYLE_ID_PREFIX}${pageKey}`;
  const existing = document.getElementById(styleId);
  if (existing) existing.remove();
}

/**
 * Clear all theme overrides (both global and page-specific)
 */
export function clearAllThemes(): void {
  if (typeof document === 'undefined') return;
  
  // Clear global
  const globalStyle = document.getElementById(GLOBAL_STYLE_ID);
  if (globalStyle) globalStyle.remove();
  
  // Clear page-specific
  const pageStyles = document.querySelectorAll(`[data-scope="page"]`);
  pageStyles.forEach(style => style.remove());
}

/**
 * Convert oklch to hex (basic implementation)
 * For more accurate conversion, consider a dedicated library
 */
export function oklchToHex(oklch: string): string {
  // This is a simplified version. For production, use a proper color library
  // For now, return the input if it's already hex
  if (oklch.startsWith('#')) return oklch;
  
  // If it's oklch, we'd need canvas or a library to convert
  // For now, return a placeholder
  return '#000000';
}

/**
 * Check if a value is a valid CSS color
 */
export function isValidCSSColor(value: string): boolean {
  if (typeof document === 'undefined') return false;
  
  const element = document.createElement('div');
  element.style.color = value;
  return element.style.color !== '';
}

/**
 * Get all injected theme styles
 */
export function getInjectedThemeStyles(): {
  global: HTMLStyleElement | null;
  pages: HTMLStyleElement[];
} {
  if (typeof document === 'undefined') {
    return { global: null, pages: [] };
  }
  
  const global = document.getElementById(GLOBAL_STYLE_ID) as HTMLStyleElement | null;
  const pages = Array.from(document.querySelectorAll(`[data-scope="page"]`)) as HTMLStyleElement[];
  
  return { global, pages };
}
