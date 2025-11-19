/**
 * Keyboard shortcut display component
 */

'use client'

export interface KeyboardShortcutProps {
  keys: string[]
  description?: string
  size?: 'sm' | 'md' | 'lg'
}

export function KeyboardShortcut({ keys, description, size = 'md' }: KeyboardShortcutProps) {
  const sizeClasses = {
    sm: 'text-xs px-1 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {keys.map((key, i) => (
          <kbd
            key={i}
            className={`rounded border border-gray-600 bg-gray-800 font-mono font-semibold text-gray-300 shadow ${sizeClasses[size]}`}
          >
            {key}
          </kbd>
        ))}
      </div>
      {description && <span className="text-sm text-gray-400">{description}</span>}
    </div>
  )
}
