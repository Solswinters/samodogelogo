/**
 * Command palette component
 */

'use client'

import { useState, useEffect } from 'react'
import { useEventListener } from '@/shared/hooks/useEventListener'

export interface Command {
  id: string
  label: string
  shortcut?: string
  onExecute: () => void
  icon?: string
}

export interface CommandPaletteProps {
  commands: Command[]
  placeholder?: string
}

export function CommandPalette({
  commands,
  placeholder = 'Search commands...',
}: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  )

  useEventListener('keydown', (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setIsOpen(true)
    }
    if (e.key === 'Escape') {
      setIsOpen(false)
      setQuery('')
    }
  })

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      filteredCommands[selectedIndex]?.onExecute()
      setIsOpen(false)
      setQuery('')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm pt-20">
      <div className="w-full max-w-2xl rounded-lg bg-gray-800 shadow-2xl">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus
          className="w-full rounded-t-lg border-b border-gray-700 bg-gray-800 px-6 py-4 text-white placeholder-gray-500 focus:outline-none"
        />
        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.map((cmd, i) => (
            <button
              key={cmd.id}
              onClick={() => {
                cmd.onExecute()
                setIsOpen(false)
                setQuery('')
              }}
              className={`flex w-full items-center justify-between px-6 py-3 text-left transition-colors ${
                i === selectedIndex ? 'bg-purple-500/20' : 'hover:bg-gray-750'
              }`}
            >
              <div className="flex items-center gap-3">
                {cmd.icon && <span className="text-xl">{cmd.icon}</span>}
                <span className="text-white">{cmd.label}</span>
              </div>
              {cmd.shortcut && (
                <kbd className="rounded bg-gray-700 px-2 py-1 text-xs text-gray-300">
                  {cmd.shortcut}
                </kbd>
              )}
            </button>
          ))}
          {filteredCommands.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-400">No commands found</div>
          )}
        </div>
      </div>
    </div>
  )
}
