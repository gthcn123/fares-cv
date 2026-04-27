/**
 * useThemeOverrides Hook
 * Manages theme configuration state and provides mutation functions
 */

import { useState, useEffect, useCallback } from 'react';
import {
  loadThemeConfig,
  saveThemeConfig,
  setGlobalToken,
  setPageToken,
  setMultiPageToken,
  resetGlobalTheme,
  resetPageTheme,
  getEffectiveColor,
  ThemeOverrideConfig,
  ThemeScope
} from '@/lib/themeConfig';
import { injectGlobalTheme, injectPageTheme, clearPageTheme } from '@/lib/cssVariableInjector';

export function useThemeOverrides() {
  const [config, setConfig] = useState<ThemeOverrideConfig>(() => loadThemeConfig());

  // Listen for cross-tab theme changes
  useEffect(() => {
    const handleStorageChange = (e: CustomEvent<ThemeOverrideConfig>) => {
      setConfig(e.detail);
    };

    window.addEventListener('theme-config-changed', handleStorageChange as EventListener);
    return () => {
      window.removeEventListener('theme-config-changed', handleStorageChange as EventListener);
    };
  }, []);

  // Inject theme changes into DOM
  useEffect(() => {
    // Inject global overrides
    const globalOverrides: Record<string, string> = {};
    Object.entries(config.global).forEach(([token, override]) => {
      globalOverrides[token] = override.value;
    });
    if (Object.keys(globalOverrides).length > 0) {
      injectGlobalTheme(globalOverrides);
    }

    // Inject page-specific overrides
    Object.entries(config.pageOverrides).forEach(([pageKey, overrides]) => {
      const pageOverrides: Record<string, string> = {};
      Object.entries(overrides).forEach(([token, override]) => {
        pageOverrides[token] = override.value;
      });
      if (Object.keys(pageOverrides).length > 0) {
        injectPageTheme(pageKey, pageOverrides);
      } else {
        clearPageTheme(pageKey);
      }
    });
  }, [config]);

  // Update and persist config
  const updateConfig = useCallback((newConfig: ThemeOverrideConfig) => {
    setConfig(newConfig);
    saveThemeConfig(newConfig);
  }, []);

  // Global token mutation
  const updateGlobalToken = useCallback(
    (tokenName: string, value: string) => {
      const newConfig = setGlobalToken(config, tokenName, value);
      updateConfig(newConfig);
    },
    [config, updateConfig]
  );

  // Page-specific token mutation
  const updatePageToken = useCallback(
    (pageKey: string, tokenName: string, value: string) => {
      const newConfig = setPageToken(config, pageKey, tokenName, value);
      updateConfig(newConfig);
    },
    [config, updateConfig]
  );

  // Multi-page token mutation
  const updateMultiPageToken = useCallback(
    (tokenName: string, value: string, pageKeys: string[]) => {
      const newConfig = setMultiPageToken(config, tokenName, value, pageKeys);
      updateConfig(newConfig);
    },
    [config, updateConfig]
  );

  // Reset functions
  const resetGlobal = useCallback(() => {
    const newConfig = resetGlobalTheme(config);
    updateConfig(newConfig);
  }, [config, updateConfig]);

  const resetPage = useCallback(
    (pageKey: string) => {
      const newConfig = resetPageTheme(config, pageKey);
      updateConfig(newConfig);
    },
    [config, updateConfig]
  );

  // Get effective color
  const getColor = useCallback(
    (pageKey: string, tokenName: string) => {
      return getEffectiveColor(config, pageKey, tokenName);
    },
    [config]
  );

  return {
    config,
    updateGlobalToken,
    updatePageToken,
    updateMultiPageToken,
    resetGlobal,
    resetPage,
    getColor
  };
}
