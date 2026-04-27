/**
 * usePageContext Hook
 * Provides current page information based on router location
 */

import { useLocation } from '@tanstack/react-router';
import { getPageKeyByPath, normalizePath, PAGE_REGISTRY } from '@/lib/pageRegistry';

export interface PageContext {
  pageKey: string | null;
  path: string;
  label: string | null;
  isAvailable: boolean;
}

export function usePageContext(): PageContext {
  const location = useLocation();
  const normalizedPath = normalizePath(location.pathname);
  const pageKey = getPageKeyByPath(normalizedPath);
  const pageInfo = pageKey ? PAGE_REGISTRY[pageKey] : null;
  
  return {
    pageKey: pageKey ?? null,
    path: normalizedPath,
    label: pageInfo?.label ?? null,
    isAvailable: pageKey !== null
  };
}
