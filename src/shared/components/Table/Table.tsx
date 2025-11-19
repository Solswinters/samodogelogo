/**
 * Table component
 */

'use client'

import { ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: string
  render?: (item: T) => ReactNode
  width?: string
}

export interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string
  onRowClick?: (item: T) => void
  striped?: boolean
  hoverable?: boolean
}

export function Table<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  striped = false,
  hoverable = true,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-800 text-xs uppercase text-gray-400">
          <tr>
            {columns.map(column => (
              <th key={column.key} className="px-6 py-3" style={{ width: column.width }}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item)}
              className={`
                border-b border-gray-700 text-white
                ${striped && index % 2 === 1 ? 'bg-gray-800/50' : ''}
                ${hoverable ? 'hover:bg-gray-700/50' : ''}
                ${onRowClick ? 'cursor-pointer' : ''}
              `}
            >
              {columns.map(column => (
                <td key={column.key} className="px-6 py-4">
                  {column.render
                    ? column.render(item)
                    : (item as Record<string, unknown>)[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <div className="py-8 text-center text-gray-400">No data available</div>}
    </div>
  )
}
