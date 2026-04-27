# Theme Control Quick Start Guide

## In 30 Seconds

1. **Click** the palette icon (bottom-right) on any page
2. **Choose a tab**: Global / Page-Specific / Multi-Page
3. **Pick a token** and change its color
4. **Done!** Changes save automatically and appear instantly

## The Three Tabs

### 🌍 Global Settings
```
Customize entire website at once
- Expand token groups (Foundation, Interactive, etc.)
- Click any token to edit
- Changes apply to ALL pages
```

### 📄 Page-Specific Settings
```
Customize individual pages independently
- Select target page from dropdown
- Customize tokens for ONLY that page
- Other pages unaffected
- No homepage required first
```

### 📋 Multi-Page Settings
```
Apply same settings to multiple pages
- Check boxes for target pages
- Customize tokens
- Changes apply to selected pages only
- Other pages remain unchanged
```

## Token Quick Reference

### Colors You Can Change (50+)

#### Backgrounds & Text
- `--background`, `--foreground` (main)
- `--card`, `--card-foreground` (cards)
- `--popover`, `--popover-foreground` (dropdowns)

#### Buttons & Links
- `--primary`, `--primary-foreground` (main buttons)
- `--secondary`, `--secondary-foreground` (secondary)
- `--accent`, `--accent-foreground` (accents)

#### States & Sections
- `--muted`, `--muted-foreground` (disabled)
- `--destructive` (delete/error)
- `--band-*` (10 section colors)

#### UI Details
- `--border` (lines)
- `--input` (input fields)
- `--ring` (focus outline)
- `--surface-1/2/3` (layers)

#### Sidebar & Charts
- `--sidebar-*` (8 sidebar colors)
- `--chart-1` through `--chart-5` (data viz)

## Color Formats

Enter either format:
```
Hex:  #5482B4
OKLCH: oklch(0.482 0.18 268)
```

## Save & Persistence

✅ **Saves automatically** to your browser
✅ **Persists on refresh** - changes are permanent
✅ **Syncs across tabs** - changes appear in all open tabs
✅ **Easy reset** - each scope has a reset button

## Examples

### Make Global Dark
1. Global Settings tab
2. Expand "Foundation"
3. Click `--background`
4. Set to `#011025`
5. Done! Whole site darkens

### Custom Home Page
1. Page-Specific tab
2. Select "Home"
3. Customize tokens
4. Switch to /explore - different colors!
5. Switch back to home - colors return

### Blue Accent on Two Pages
1. Multi-Page tab
2. Check "Home" and "Explore"
3. Expand "Interactive Elements"
4. Click `--primary`
5. Set to your blue
6. Applied to both pages!

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Changes disappear | Check localStorage enabled in browser |
| Can't find a color | Look in the right token group |
| Page not in dropdown | Add to `src/lib/pageRegistry.ts` |
| Color looks weird | Use valid hex (#RGB or #RRGGBB) or oklch value |

## Keyboard Shortcuts

- **Tab** - Switch between input fields
- **Enter** - Confirm color change
- **Escape** - Close expanded token

## Pro Tips

✨ **Live Preview**: Open site in two windows, customize in one, see changes in other

✨ **Test Quickly**: Use Global Settings to rapid-fire try colors

✨ **Batch Edit**: Multi-Page tab to apply one change to multiple pages

✨ **Export Colors**: Check localStorage to see your exact color values

## Browser Storage

Your customizations are stored at:
```
DevTools → Application → LocalStorage
Key: fares_cv:theme_overrides
```

View the exact structure of your saved configuration here.

## Next Level: Programmatic Access

From any React component:

```typescript
import { useThemeOverrides } from '@/hooks/useThemeOverrides';

export function MyComponent() {
  const { config, updateGlobalToken, getColor } = useThemeOverrides();
  
  // Get current primary color on home page
  const homeColor = getColor('home', '--primary');
  
  // Update global primary
  updateGlobalToken('--primary', '#FF0000');
}
```

## Still Lost?

- Read full docs: `THEME_CONTROL.md`
- Check implementation: `THEME_CONTROL_IMPLEMENTATION.md`
- Explore code: `src/components/admin/ThemeControlPanel.tsx`

---

**That's it!** You now have complete control over your theme. Have fun customizing!
