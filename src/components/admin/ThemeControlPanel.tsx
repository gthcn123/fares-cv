/**
 * Theme Control Panel
 * Professional granular theme customization interface with three scopes:
 * 1. Global settings
 * 2. Page-specific settings
 * 3. Multi-page settings
 */

import React, { useState, useMemo } from 'react';
import { useThemeOverrides } from '@/hooks/useThemeOverrides';
import { usePageContext } from '@/hooks/usePageContext';
import { getAllPages } from '@/lib/pageRegistry';
import { TokenEditor } from './TokenEditor';
import { TokenGroup } from './TokenGroup';

// Define all color tokens grouped by category
const TOKEN_GROUPS = [
  {
    id: 'foundation',
    title: 'Foundation',
    description: 'Base background and text colors',
    tokens: [
      { name: '--background', display: 'Background' },
      { name: '--foreground', display: 'Foreground' },
      { name: '--card', display: 'Card Background' },
      { name: '--card-foreground', display: 'Card Foreground' },
      { name: '--popover', display: 'Popover Background' },
      { name: '--popover-foreground', display: 'Popover Foreground' }
    ]
  },
  {
    id: 'interactive',
    title: 'Interactive Elements',
    description: 'Buttons, links, and active states',
    tokens: [
      { name: '--primary', display: 'Primary' },
      { name: '--primary-foreground', display: 'Primary Foreground' },
      { name: '--primary-soft', display: 'Primary Soft' },
      { name: '--primary-deep', display: 'Primary Deep' },
      { name: '--primary-glow', display: 'Primary Glow' },
      { name: '--secondary', display: 'Secondary' },
      { name: '--secondary-foreground', display: 'Secondary Foreground' },
      { name: '--accent', display: 'Accent' },
      { name: '--accent-foreground', display: 'Accent Foreground' }
    ]
  },
  {
    id: 'status',
    title: 'Status & Muted',
    description: 'Disabled, warning, and neutral states',
    tokens: [
      { name: '--muted', display: 'Muted' },
      { name: '--muted-foreground', display: 'Muted Foreground' },
      { name: '--destructive', display: 'Destructive' },
      { name: '--destructive-foreground', display: 'Destructive Foreground' }
    ]
  },
  {
    id: 'bands',
    title: 'Section Bands',
    description: 'Alternating section backgrounds',
    tokens: [
      { name: '--band-light', display: 'Band Light' },
      { name: '--band-light-foreground', display: 'Band Light Foreground' },
      { name: '--band-dark', display: 'Band Dark' },
      { name: '--band-dark-foreground', display: 'Band Dark Foreground' },
      { name: '--band-primary', display: 'Band Primary' },
      { name: '--band-primary-foreground', display: 'Band Primary Foreground' },
      { name: '--band-surface', display: 'Band Surface' },
      { name: '--band-surface-foreground', display: 'Band Surface Foreground' },
      { name: '--band-soft', display: 'Band Soft' },
      { name: '--band-soft-foreground', display: 'Band Soft Foreground' }
    ]
  },
  {
    id: 'inputs',
    title: 'Borders & Inputs',
    description: 'Input fields and borders',
    tokens: [
      { name: '--border', display: 'Border' },
      { name: '--input', display: 'Input' },
      { name: '--ring', display: 'Focus Ring' }
    ]
  },
  {
    id: 'surfaces',
    title: 'Surface Layers',
    description: 'Layered depth surfaces',
    tokens: [
      { name: '--surface-1', display: 'Surface Level 1' },
      { name: '--surface-2', display: 'Surface Level 2' },
      { name: '--surface-3', display: 'Surface Level 3' },
      { name: '--hairline', display: 'Hairline Border' }
    ]
  },
  {
    id: 'sidebar',
    title: 'Sidebar',
    description: 'Sidebar styling',
    tokens: [
      { name: '--sidebar', display: 'Sidebar Background' },
      { name: '--sidebar-foreground', display: 'Sidebar Foreground' },
      { name: '--sidebar-primary', display: 'Sidebar Primary' },
      { name: '--sidebar-primary-foreground', display: 'Sidebar Primary Foreground' },
      { name: '--sidebar-accent', display: 'Sidebar Accent' },
      { name: '--sidebar-accent-foreground', display: 'Sidebar Accent Foreground' },
      { name: '--sidebar-border', display: 'Sidebar Border' },
      { name: '--sidebar-ring', display: 'Sidebar Ring' }
    ]
  },
  {
    id: 'charts',
    title: 'Chart Colors',
    description: 'Data visualization colors',
    tokens: [
      { name: '--chart-1', display: 'Chart Color 1' },
      { name: '--chart-2', display: 'Chart Color 2' },
      { name: '--chart-3', display: 'Chart Color 3' },
      { name: '--chart-4', display: 'Chart Color 4' },
      { name: '--chart-5', display: 'Chart Color 5' }
    ]
  },
  {
    id: 'shadows',
    title: 'Shadows & Effects',
    description: 'Shadow definitions and visual effects',
    tokens: [
      { name: '--shadow-pill', display: 'Pill Shadow' },
      { name: '--shadow-soft', display: 'Soft Shadow' },
      { name: '--shadow-elevated', display: 'Elevated Shadow' },
      { name: '--shadow-glow', display: 'Glow Shadow' }
    ]
  },
  {
    id: 'gradients',
    title: 'Gradients',
    description: 'Gradient definitions for backgrounds and text',
    tokens: [
      { name: '--gradient-hero', display: 'Hero Gradient' },
      { name: '--gradient-primary', display: 'Primary Gradient' },
      { name: '--gradient-mesh', display: 'Mesh Gradient' }
    ]
  },
  {
    id: 'effects',
    title: 'Border & Radius',
    description: 'Border radius and spacing effects',
    tokens: [
      { name: '--radius', display: 'Border Radius (in rem)' }
    ]
  },
  {
    id: 'typography',
    title: 'Typography',
    description: 'Font families and text styling',
    tokens: [
      { name: '--font-display', display: 'Display Font Family' },
      { name: '--font-body', display: 'Body Font Family' },
      { name: '--font-mono', display: 'Monospace Font Family' }
    ]
  }
];

type TabType = 'global' | 'page' | 'multi';

interface SelectedPages {
  [key: string]: boolean;
}

export function ThemeControlPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('global');
  const [selectedPageKey, setSelectedPageKey] = useState<string>('home');
  const [selectedPages, setSelectedPages] = useState<SelectedPages>({});

  const { config, updateGlobalToken, updatePageToken, updateMultiPageToken, resetGlobal, resetPage } =
    useThemeOverrides();
  const currentPage = usePageContext();
  const allPages = getAllPages();

  // Get all tokens for rendering
  const allTokens = useMemo(() => {
    return TOKEN_GROUPS.flatMap((group) => group.tokens);
  }, []);

  // Handle global token change
  const handleGlobalTokenChange = (tokenName: string, value: string) => {
    updateGlobalToken(tokenName, value);
  };

  // Handle page token change
  const handlePageTokenChange = (tokenName: string, value: string) => {
    updatePageToken(selectedPageKey, tokenName, value);
  };

  // Handle multi-page token change
  const handleMultiPageTokenChange = (tokenName: string, value: string) => {
    const selectedKeys = Object.entries(selectedPages)
      .filter(([_, selected]) => selected)
      .map(([key]) => key);

    if (selectedKeys.length > 0) {
      updateMultiPageToken(tokenName, value, selectedKeys);
    }
  };

  // Handle multi-page selection
  const togglePageSelection = (pageKey: string) => {
    setSelectedPages((prev) => ({
      ...prev,
      [pageKey]: !prev[pageKey]
    }));
  };

  // Get effective values for current scope
  const getDisplayValue = (tokenName: string): string => {
    if (activeTab === 'global') {
      return config.global[tokenName]?.value || 'inherit';
    } else if (activeTab === 'page') {
      return config.pageOverrides[selectedPageKey]?.[tokenName]?.value || 'inherit';
    }
    return 'inherit';
  };

  const selectedPageCount = Object.values(selectedPages).filter(Boolean).length;

  return (
    <div className="w-full max-w-2xl mx-auto bg-background rounded-lg border border-border overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-secondary/50 px-6 py-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Theme Control Panel</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Customize colors with granular control over global, page-specific, and multi-page settings.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('global')}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'global'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Global Settings
        </button>
        <button
          onClick={() => setActiveTab('page')}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'page'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Page-Specific
        </button>
        <button
          onClick={() => setActiveTab('multi')}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'multi'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Multi-Page
        </button>
      </div>

      {/* Content */}
      <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
        {/* GLOBAL SETTINGS TAB */}
        {activeTab === 'global' && (
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              {TOKEN_GROUPS.map((group) => (
                <TokenGroup
                  key={group.id}
                  title={group.title}
                  description={group.description}
                  defaultExpanded={group.id === 'foundation'}
                >
                  {group.tokens.map((token) => (
                    <TokenEditor
                      key={token.name}
                      tokenName={token.name}
                      displayName={token.display}
                      currentValue={getDisplayValue(token.name)}
                      onValueChange={(value) => handleGlobalTokenChange(token.name, value)}
                      currentBackground="var(--background)"
                    />
                  ))}
                </TokenGroup>
              ))}
            </div>

            {/* Global Actions */}
            <div className="border-t border-border pt-6 space-y-3">
              <button
                onClick={resetGlobal}
                disabled={Object.keys(config.global).length === 0}
                className="w-full px-4 py-2 bg-destructive/10 hover:bg-destructive/20 disabled:opacity-50 disabled:cursor-not-allowed text-destructive text-sm font-medium rounded border border-destructive/30 transition-colors"
              >
                Reset Global Theme
              </button>
              <p className="text-xs text-muted-foreground text-center">
                {Object.keys(config.global).length} global override(s) applied
              </p>
            </div>
          </div>
        )}

        {/* PAGE-SPECIFIC SETTINGS TAB */}
        {activeTab === 'page' && (
          <div className="p-6 space-y-6">
            {/* Page selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Select Target Page
              </label>
              <select
                value={selectedPageKey}
                onChange={(e) => setSelectedPageKey(e.target.value)}
                className="w-full px-3 py-2 rounded border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {allPages.map((page) => (
                  <option key={page.key} value={page.key}>
                    {page.label}
                    {currentPage.pageKey === page.key ? ' (current page)' : ''}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Configure colors for this page independently. Changes apply only to this page.
              </p>
            </div>

            {/* Token groups */}
            <div className="space-y-4">
              {TOKEN_GROUPS.map((group) => (
                <TokenGroup
                  key={group.id}
                  title={group.title}
                  description={group.description}
                  defaultExpanded={group.id === 'foundation'}
                >
                  {group.tokens.map((token) => (
                    <TokenEditor
                      key={token.name}
                      tokenName={token.name}
                      displayName={token.display}
                      currentValue={getDisplayValue(token.name)}
                      onValueChange={(value) => handlePageTokenChange(token.name, value)}
                      currentBackground="var(--background)"
                    />
                  ))}
                </TokenGroup>
              ))}
            </div>

            {/* Page Actions */}
            <div className="border-t border-border pt-6 space-y-3">
              <button
                onClick={() => resetPage(selectedPageKey)}
                disabled={!config.pageOverrides[selectedPageKey] || Object.keys(config.pageOverrides[selectedPageKey]).length === 0}
                className="w-full px-4 py-2 bg-destructive/10 hover:bg-destructive/20 disabled:opacity-50 disabled:cursor-not-allowed text-destructive text-sm font-medium rounded border border-destructive/30 transition-colors"
              >
                Reset This Page Theme
              </button>
              <p className="text-xs text-muted-foreground text-center">
                {Object.keys(config.pageOverrides[selectedPageKey] || {}).length} override(s) for this page
              </p>
            </div>
          </div>
        )}

        {/* MULTI-PAGE SETTINGS TAB */}
        {activeTab === 'multi' && (
          <div className="p-6 space-y-6">
            {/* Page selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Select Target Pages ({selectedPageCount})
              </label>
              <div className="grid grid-cols-2 gap-2">
                {allPages.map((page) => (
                  <label key={page.key} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPages[page.key] || false}
                      onChange={() => togglePageSelection(page.key)}
                      className="w-4 h-4 rounded border-input cursor-pointer"
                    />
                    <span className="text-sm text-foreground">
                      {page.label}
                      {currentPage.pageKey === page.key ? ' (current)' : ''}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Select multiple pages to apply the same color settings to all of them at once.
              </p>
            </div>

            {selectedPageCount > 0 ? (
              <>
                {/* Token groups */}
                <div className="space-y-4">
                  {TOKEN_GROUPS.map((group) => (
                    <TokenGroup
                      key={group.id}
                      title={group.title}
                      description={group.description}
                      defaultExpanded={group.id === 'foundation'}
                    >
                      {group.tokens.map((token) => (
                        <TokenEditor
                          key={token.name}
                          tokenName={token.name}
                          displayName={token.display}
                          currentValue="inherit"
                          onValueChange={(value) => handleMultiPageTokenChange(token.name, value)}
                          currentBackground="var(--background)"
                        />
                      ))}
                    </TokenGroup>
                  ))}
                </div>

                {/* Multi-page Actions */}
                <div className="border-t border-border pt-6 space-y-3">
                  <p className="text-xs text-muted-foreground text-center">
                    Changes will be applied to {selectedPageCount} page(s): {allPages
                      .filter((p) => selectedPages[p.key])
                      .map((p) => p.label)
                      .join(', ')}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">Select at least one page to continue</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
