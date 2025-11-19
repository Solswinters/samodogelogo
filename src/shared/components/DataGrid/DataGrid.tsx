/**
 * Advanced data grid component
 */

'use client'

import { useState } from 'react'

export interface Column<T> {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
  width?: string
}

export interface DataGridProps<T> {
  data: T[]
  columns: Column<T>[]
  onRowClick?: (item: T) => void
  sortable?: boolean
  selectable?: boolean
  onSelectionChange?: (selected: T[]) => void
}

export function DataGrid<T extends Record<string, unknown>>({
  data,
  columns,
  onRowClick,
  sortable = false,
  selectable = false,
  onSelectionChange,
}: DataGridProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const handleSort = (key: string) => {
    if (!sortable) return
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const handleSelect = (index: number) => {
    const newSelected = new Set(selected)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelected(newSelected)
    onSelectionChange?.(Array.from(newSelected).map(i => data[i]!))
  }

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        const aVal = a[sortKey]
        const bVal = b[sortKey]
        if (aVal === bVal) return 0
        const comparison = aVal! < bVal! ? -1 : 1
        return sortDirection === 'asc' ? comparison : -comparison
      })
    : data

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="w-full text-left text-sm text-gray-300">
        <thead className="bg-gray-800 text-xs uppercase text-gray-400">
          <tr>
            {selectable && <th className="px-4 py-3 w-12" />}
            {columns.map(column => (
              <th
                key={column.key}
                className={`px-6 py-3 ${column.sortable || sortable ? 'cursor-pointer hover:bg-gray-750' : ''}`}
                style={{ width: column.width }}
                onClick={() => (column.sortable || sortable) && handleSort(column.key)}
              >
                <div className="flex items-center gap-2">
                  {column.header}
                  {sortKey === column.key && <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr
              key={index}
              className={`border-b border-gray-700 transition-colors ${
                onRowClick ? 'cursor-pointer hover:bg-gray-800' : ''
              } ${selected.has(index) ? 'bg-purple-500/10' : ''}`}
              onClick={() => onRowClick?.(item)}
            >
              {selectable && (
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selected.has(index)}
                    onChange={() => handleSelect(index)}
                    onClick={e => e.stopPropagation()}
                    className="h-4 w-4"
                  />
                </td>
              )}
              {columns.map(column => (
                <td key={column.key} className="px-6 py-4">
                  {column.render ? column.render(item) : (item[column.key] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {sortedData.length === 0 && (
        <div className="bg-gray-800 py-8 text-center text-gray-400">No data available</div>
      )}
    </div>
  )
}
