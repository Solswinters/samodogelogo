/**
 * Accordion component
 */

'use client'

import { ReactNode, useState } from 'react'

export interface AccordionItem {
  id: string
  title: string
  content: ReactNode
}

export interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  defaultOpenItems?: string[]
}

export function Accordion({ items, allowMultiple = false, defaultOpenItems = [] }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpenItems))

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (!allowMultiple) {
          next.clear()
        }
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="space-y-2">
      {items.map(item => {
        const isOpen = openItems.has(item.id)
        return (
          <div key={item.id} className="rounded-lg border border-gray-700">
            <button
              onClick={() => toggleItem(item.id)}
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-700/50"
              aria-expanded={isOpen}
            >
              <span className="font-medium text-white">{item.title}</span>
              <svg
                className={`h-5 w-5 text-gray-400 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isOpen && (
              <div className="border-t border-gray-700 p-4 text-gray-300">{item.content}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
