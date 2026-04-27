/**
 * Theme Editor Button
 * Quick access floating button to the theme control panel
 */

import { useLocation } from '@tanstack/react-router';
import { motion } from 'framer-motion';

export function ThemeEditorButton() {
  const location = useLocation();
  const isOnThemeEditor = location.pathname === '/theme-editor';

  if (isOnThemeEditor) return null;

  return (
    <motion.a
      href="/theme-editor"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg flex items-center justify-center cursor-pointer transition-colors group"
      title="Open Theme Editor"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.5a2 2 0 00-1 .293m0 0A4.11 4.11 0 0115.5 7m0 0h.5a2 2 0 012 2v12a2 2 0 01-2 2h-5a2 2 0 01-2-2v-.5"
        />
      </svg>
      <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs font-medium bg-foreground text-background rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Theme Editor
      </span>
    </motion.a>
  );
}
