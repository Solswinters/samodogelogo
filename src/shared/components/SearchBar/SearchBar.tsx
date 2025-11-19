/**
 * Search bar component
 */

'use client'

import { useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'

export interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
  debounceMs?: number
  disabled?: boolean
}

export function SearchBar({
  placeholder = 'Search...',
  onSearch,
  debounceMs = 300,
  disabled = false,
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, debounceMs)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  // Effect to call onSearch when debounced value changes
  React.useEffect(() => {
    onSearch(debouncedQuery)
  }, [debouncedQuery, onSearch])

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-lg border border-gray-600 bg-gray-800 py-2 pl-10 pr-10 text-white placeholder-gray-500 transition-colors focus:border-purple-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
        🔍
      </div>
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
        >
          ×
        </button>
      )}
    </div>
  )
}
