/**
 * Theme Overrides Provider
 * Wraps the application to enable granular theme customization
 */

import { ReactNode } from 'react';
import { useThemeOverrides } from '@/hooks/useThemeOverrides';

export function ThemeOverridesProvider({ children }: { children: ReactNode }) {
  // Initialize theme overrides system
  useThemeOverrides();

  return <>{children}</>;
}
