/**
 * Theme Editor Page
 * Full-featured theme customization interface
 */

import { createFileRoute } from '@tanstack/react-router';
import { ThemeControlPanel } from '@/components/admin/ThemeControlPanel';

function ThemeEditorPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Theme Customizer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Customize your portfolio's appearance with granular control over colors. Choose to apply settings globally, to specific pages, or to multiple pages at once.
          </p>
        </div>

        {/* Control Panel */}
        <div className="mb-12">
          <ThemeControlPanel />
        </div>

        {/* Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-secondary/30 rounded-lg p-6 border border-border">
            <h3 className="font-semibold text-foreground mb-2">Global Settings</h3>
            <p className="text-sm text-muted-foreground">
              Apply color changes to your entire website at once. Perfect for consistent brand colors across all pages.
            </p>
          </div>
          <div className="bg-secondary/30 rounded-lg p-6 border border-border">
            <h3 className="font-semibold text-foreground mb-2">Page-Specific</h3>
            <p className="text-sm text-muted-foreground">
              Customize colors for individual pages independently. Each page maintains its own theme overrides.
            </p>
          </div>
          <div className="bg-secondary/30 rounded-lg p-6 border border-border">
            <h3 className="font-semibold text-foreground mb-2">Multi-Page</h3>
            <p className="text-sm text-muted-foreground">
              Apply the same settings to multiple selected pages at once. Choose exactly which pages get updated.
            </p>
          </div>
        </div>

        {/* Live Preview Notice */}
        <div className="mt-12 bg-primary/10 border border-primary/30 rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-2">Live Preview</h3>
          <p className="text-sm text-muted-foreground">
            All changes are applied instantly. Navigate between pages to see page-specific customizations in action. Changes are automatically saved to your browser's local storage.
          </p>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/theme-editor')({
  component: ThemeEditorPage,
  head: () => ({
    meta: [
      { title: 'Theme Customizer' },
      { name: 'description', content: 'Customize your portfolio theme with granular color controls' }
    ]
  })
});
