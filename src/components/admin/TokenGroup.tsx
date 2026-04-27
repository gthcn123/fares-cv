/**
 * Token Group
 * Accordion wrapper for organizing tokens by category
 */

import React, { useState } from 'react';

export interface TokenGroupProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function TokenGroup({
  title,
  description,
  children,
  defaultExpanded = false
}: TokenGroupProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between gap-3 bg-secondary/50 hover:bg-secondary/70 transition-colors font-medium text-foreground"
      >
        <div className="flex-1 text-left">
          <div className="text-sm font-semibold">{title}</div>
          {description && (
            <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
          )}
        </div>
        <div
          className={`transition-transform text-muted-foreground flex-shrink-0 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        >
          ▼
        </div>
      </button>

      {isExpanded && (
        <div className="divide-y divide-border">
          {children}
        </div>
      )}
    </div>
  );
}
