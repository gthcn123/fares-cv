/**
 * Token Editor
 * Individual color token control with picker and value display
 */

import React, { useState, useCallback } from 'react';

export interface TokenEditorProps {
  tokenName: string;
  displayName: string;
  currentValue: string;
  defaultValue?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  currentBackground?: string; // Current background for visual reference
}

export function TokenEditor({
  tokenName,
  displayName,
  currentValue,
  defaultValue,
  onValueChange,
  disabled = false,
  currentBackground = 'var(--background)'
}: TokenEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState(currentValue);

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      onValueChange(value);
    },
    [onValueChange]
  );

  // Handle color picker change
  const handleColorPickerChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      onValueChange(value);
    },
    [onValueChange]
  );

  // Reset to default
  const handleReset = useCallback(() => {
    if (defaultValue) {
      setInputValue(defaultValue);
      onValueChange(defaultValue);
    }
  }, [defaultValue, onValueChange]);

  // Check if is hex color
  const isHex = inputValue.startsWith('#');

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        disabled={disabled}
        className="w-full px-4 py-3 flex items-center justify-between gap-3 hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <div className="flex items-center gap-3 flex-1 text-left">
          {/* Color swatch */}
          <div
            className="w-6 h-6 rounded border border-border flex-shrink-0"
            style={{
              backgroundColor: isHex ? inputValue : 'currentColor',
              opacity: isHex ? 1 : 0.7
            }}
            title={inputValue}
          />
          <div className="flex-1">
            <div className="font-medium text-sm text-foreground">
              {displayName}
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              {tokenName}
            </div>
          </div>
        </div>

        {/* Current value display */}
        <div className="text-right flex-shrink-0">
          <div className="text-xs font-mono text-muted-foreground px-2 py-1 bg-muted rounded">
            {inputValue}
          </div>
        </div>

        {/* Chevron */}
        <div
          className={`transition-transform flex-shrink-0 text-muted-foreground ${
            isExpanded ? 'rotate-180' : ''
          }`}
        >
          ▼
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 py-4 bg-muted/30 border-t border-border space-y-4">
          {/* Live preview of color on background */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-foreground">
              Live Preview
            </label>
            <div 
              className="p-6 rounded-lg border border-border flex flex-col gap-3"
              style={{ backgroundColor: currentBackground }}
            >
              <div className="text-sm font-medium" style={{ color: inputValue }}>
                Sample Text
              </div>
              <div className="text-xs" style={{ color: inputValue, opacity: 0.7 }}>
                Text with 70% opacity
              </div>
              <div 
                className="h-6 rounded border border-border"
                style={{ backgroundColor: inputValue }}
              />
            </div>
          </div>

          {/* Color picker */}
          <div className="flex items-center gap-3">
            <label htmlFor={`picker-${tokenName}`} className="text-xs font-medium text-foreground">
              Color Picker
            </label>
            <input
              id={`picker-${tokenName}`}
              type="color"
              value={isHex ? inputValue : '#000000'}
              onChange={handleColorPickerChange}
              disabled={disabled}
              className="w-12 h-10 cursor-pointer rounded border border-border"
            />
          </div>

          {/* Text input for hex/oklch */}
          <div className="flex flex-col gap-2">
            <label htmlFor={`input-${tokenName}`} className="text-xs font-medium text-foreground">
              Value (Hex or OKLCH)
            </label>
            <input
              id={`input-${tokenName}`}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              disabled={disabled}
              placeholder="e.g., #5482B4 or oklch(0.482 0.18 268)"
              className="px-3 py-2 text-sm font-mono rounded border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            {defaultValue && inputValue !== defaultValue && (
              <button
                onClick={handleReset}
                disabled={disabled}
                className="text-xs px-3 py-1.5 rounded border border-border text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Reset to Default
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
