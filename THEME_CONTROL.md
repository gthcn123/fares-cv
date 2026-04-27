# Granular Page-Level Theme Control System

A sophisticated, professional theme customization interface that allows pixel-perfect control over individual color tokens with flexible scoping options.

## Overview

The theme control system enables three distinct levels of customization:

1. **Global Settings** - Apply colors to the entire website
2. **Page-Specific Settings** - Customize individual pages independently
3. **Multi-Page Settings** - Apply settings to multiple selected pages at once

Each control is individually editable, allowing granular customization of all 50+ color tokens one by one.

## Architecture

### Core Components

#### 1. **Page Registry** (`src/lib/pageRegistry.ts`)
- Centralized mapping of all routes with labels
- Independent page targeting (no homepage dependency)
- Functions: `getAllPages()`, `getPageByPath()`, `getPageKeyByPath()`

#### 2. **Theme Config** (`src/lib/themeConfig.ts`)
- Configuration storage and persistence
- Three scope types: `GLOBAL`, `SINGLE_PAGE`, `MULTI_PAGE`
- Functions:
  - `loadThemeConfig()` - Load from localStorage
  - `saveThemeConfig()` - Persist to localStorage
  - `setGlobalToken()` - Set global color
  - `setPageToken()` - Set page-specific color
  - `setMultiPageToken()` - Set color for multiple pages
  - `getEffectiveColor()` - Get color with scope hierarchy
  - `resetGlobalTheme()`, `resetPageTheme()` - Reset to defaults

#### 3. **CSS Variable Injector** (`src/lib/cssVariableInjector.ts`)
- Dynamically injects theme overrides into the DOM
- Functions:
  - `injectGlobalTheme()` - Inject global overrides to `:root`
  - `injectPageTheme()` - Inject page-specific overrides to `html, body`
  - `clearPageTheme()` - Remove page overrides
  - `clearAllThemes()` - Clear all injections

#### 4. **Custom Hooks**

**`usePageContext()`** (`src/hooks/usePageContext.ts`)
```typescript
const { pageKey, path, label, isAvailable } = usePageContext();
```
Provides current page information based on router location.

**`useThemeOverrides()`** (`src/hooks/useThemeOverrides.ts`)
```typescript
const {
  config,                        // Current config state
  updateGlobalToken,            // (name, value) => void
  updatePageToken,              // (pageKey, name, value) => void
  updateMultiPageToken,         // (name, value, pageKeys) => void
  resetGlobal,                  // () => void
  resetPage,                    // (pageKey) => void
  getColor                      // (pageKey, name) => string | undefined
} = useThemeOverrides();
```
Manages theme configuration state with automatic DOM injection.

#### 5. **UI Components**

**`TokenEditor.tsx`**
- Individual color token control
- Features:
  - Color swatch preview
  - Color picker
  - Hex/oklch input
  - Current value display
  - Reset to default button
  - Expandable for detailed control

**`TokenGroup.tsx`**
- Accordion wrapper for token categories
- Organizes tokens into collapsible sections
- Reduces visual clutter

**`ThemeControlPanel.tsx`**
- Three-tab professional interface
- Token organization in 8 groups:
  - Foundation (backgrounds, text)
  - Interactive Elements (buttons, links)
  - Status & Muted (warnings, disabled)
  - Section Bands (alternating sections)
  - Borders & Inputs
  - Surface Layers
  - Sidebar
  - Chart Colors
- Page selector (no pre-selection required)
- Multi-page checkbox grid
- Live preview with instant updates
- Reset buttons per scope

### Integration

**`ThemeOverridesProvider.tsx`**
- Wraps the application to enable theme customization
- Initializes the `useThemeOverrides()` hook

**Root Route (`src/routes/__root.tsx`)**
- Integrates `ThemeOverridesProvider` in the component tree
- Positioned after `ThemeProvider` for proper cascade

## Usage Guide

### Accessing the Control Panel

Navigate to `/theme-editor` to access the full theme customization interface.

### Global Customization

1. Click the "Global Settings" tab
2. Expand token groups (e.g., "Foundation", "Interactive Elements")
3. Click on any token to expand it
4. Use the color picker or enter hex/oklch values
5. Changes apply immediately to all pages

### Page-Specific Customization

1. Click the "Page-Specific" tab
2. Select your target page from the dropdown (no homepage forcing required)
3. Expand token groups as needed
4. Customize tokens for that page only
5. Changes apply only to the selected page
6. Switch pages to see different customizations

### Multi-Page Customization

1. Click the "Multi-Page" tab
2. Check the boxes for all pages you want to customize
3. Expand token groups and customize tokens
4. Click save to apply changes to all selected pages
5. Unselected pages remain unchanged

### Color Token Reference

#### Foundation Group
- `--background` - Main background color
- `--foreground` - Primary text color
- `--card` - Card backgrounds
- `--card-foreground` - Card text
- `--popover` - Dropdown/popover backgrounds
- `--popover-foreground` - Dropdown text

#### Interactive Elements
- `--primary` - Primary button/link color
- `--primary-foreground` - Primary button text
- `--primary-soft` - Soft variant
- `--primary-deep` - Deep variant
- `--primary-glow` - Glowing effect color
- `--secondary` - Secondary UI elements
- `--secondary-foreground` - Secondary text
- `--accent` - Accent highlights
- `--accent-foreground` - Accent text

#### Status & Muted
- `--muted` - Disabled/placeholder backgrounds
- `--muted-foreground` - Disabled text
- `--destructive` - Error/delete actions
- `--destructive-foreground` - Error text

#### Section Bands
- `--band-light` - Light section background
- `--band-light-foreground` - Light section text
- `--band-dark` - Dark section background
- `--band-dark-foreground` - Dark section text
- `--band-primary` - Primary section
- `--band-primary-foreground` - Primary section text
- `--band-surface` - Surface sections
- `--band-surface-foreground` - Surface text
- `--band-soft` - Soft sections
- `--band-soft-foreground` - Soft section text

#### Borders & Inputs
- `--border` - Border color
- `--input` - Input field background
- `--ring` - Focus ring color

#### Surface Layers
- `--surface-1` - Top layer
- `--surface-2` - Middle layer
- `--surface-3` - Bottom layer
- `--hairline` - Subtle borders

#### Sidebar
- `--sidebar` - Sidebar background
- `--sidebar-foreground` - Sidebar text
- `--sidebar-primary` - Active sidebar item
- `--sidebar-primary-foreground` - Active item text
- `--sidebar-accent` - Accent in sidebar
- `--sidebar-accent-foreground` - Accent text
- `--sidebar-border` - Sidebar borders
- `--sidebar-ring` - Sidebar focus ring

#### Chart Colors
- `--chart-1` through `--chart-5` - Data visualization colors

## Data Persistence

### Storage Format

Configuration is stored in localStorage under key: `fares_cv:theme_overrides`

```typescript
{
  version: 1,
  global: {
    '--primary': { value: 'oklch(...)', scope: 'GLOBAL', timestamp: 1234567890 },
    ...
  },
  pageOverrides: {
    'home': {
      '--background': { value: '#C2E8FF', scope: 'SINGLE_PAGE', timestamp: 1234567890 },
      ...
    },
    ...
  },
  lastModified: 1234567890
}
```

### Cross-Tab Sync

Changes in one browser tab are automatically reflected in all other tabs via the `storage` event listener.

### Auto-Save

Configuration changes are debounced (500ms) before persisting to localStorage to minimize writes.

## Advanced Usage

### Programmatic Access

Access the theme configuration from any component:

```typescript
import { useThemeOverrides } from '@/hooks/useThemeOverrides';

function MyComponent() {
  const { config, updateGlobalToken, getColor } = useThemeOverrides();
  
  // Get current color for a token on a specific page
  const pageColor = getColor('home', '--primary');
  
  // Update global color
  updateGlobalToken('--primary', '#5482B4');
}
```

### Scope Hierarchy

When retrieving a color value, the system respects this priority:
1. Page-specific override (if set)
2. Global override (if set)
3. Default CSS value

### Color Format Support

Both hex and OKLCH color formats are supported:
- Hex: `#5482B4`
- OKLCH: `oklch(0.482 0.18 268)`

The system validates colors using the browser's CSS parser.

## Performance Considerations

- Theme injections use `!important` to ensure override precedence
- CSS variables leverage the cascade for efficient rendering
- Debounced persistence prevents excessive localStorage writes
- Page registry enables O(1) page lookups
- Token groups prevent rendering all tokens at once

## Troubleshooting

### Changes not appearing

1. Check browser DevTools → Application → LocalStorage
2. Verify `fares_cv:theme_overrides` key exists
3. Check browser console for error messages
4. Clear cache and refresh if needed

### Colors reverting

- Ensure `ThemeOverridesProvider` is in the component tree
- Check if browser storage is enabled
- Verify localStorage quota is not exceeded

### Page selector not showing all pages

1. Check `src/lib/pageRegistry.ts` for page definitions
2. Ensure routes match the page keys
3. Add missing pages to the registry

## Future Enhancements

- Color palette presets
- Theme export/import
- Undo/redo history
- Real-time collaboration
- A/B testing support
- Analytics integration
- Theme templates gallery
