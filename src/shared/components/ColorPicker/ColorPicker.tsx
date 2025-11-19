/**
 * Color picker component
 */

'use client'

export interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  presetColors?: string[]
  disabled?: boolean
}

const DEFAULT_PRESETS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#eab308', // yellow
  '#84cc16', // lime
  '#22c55e', // green
  '#10b981', // emerald
  '#14b8a6', // teal
  '#06b6d4', // cyan
  '#0ea5e9', // blue
  '#3b82f6', // indigo
  '#6366f1', // violet
  '#8b5cf6', // purple
  '#a855f7', // fuchsia
  '#ec4899', // pink
  '#f43f5e', // rose
]

export function ColorPicker({
  value,
  onChange,
  presetColors = DEFAULT_PRESETS,
  disabled = false,
}: ColorPickerProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          className="h-10 w-10 cursor-pointer rounded border-2 border-gray-600 bg-transparent disabled:cursor-not-allowed disabled:opacity-50"
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          className="flex-1 rounded border border-gray-600 bg-gray-800 px-3 py-2 font-mono text-sm text-white focus:border-purple-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="#000000"
        />
      </div>
      <div className="grid grid-cols-8 gap-2">
        {presetColors.map(color => (
          <button
            key={color}
            onClick={() => onChange(color)}
            disabled={disabled}
            className={`h-8 w-8 rounded border-2 transition-all hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50 ${
              value.toLowerCase() === color.toLowerCase()
                ? 'border-white ring-2 ring-purple-500'
                : 'border-gray-600'
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  )
}
