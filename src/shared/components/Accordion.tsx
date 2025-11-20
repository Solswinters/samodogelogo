import React, { createContext, useContext, useState } from 'react'
import { cn } from '@/shared/utils/cn'

interface AccordionContextValue {
  activeItem: string | null
  setActiveItem: (id: string | null) => void
}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined)

const useAccordionContext = () => {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion')
  }
  return context
}

export interface AccordionProps {
  children: React.ReactNode
  className?: string
  defaultActiveItem?: string
}

export const Accordion: React.FC<AccordionProps> = ({
  children,
  className,
  defaultActiveItem = null,
}) => {
  const [activeItem, setActiveItem] = useState<string | null>(defaultActiveItem)

  return (
    <AccordionContext.Provider value={{ activeItem, setActiveItem }}>
      <div className={cn('space-y-2', className)}>{children}</div>
    </AccordionContext.Provider>
  )
}

export interface AccordionItemProps {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ id, title, children, className }) => {
  const { activeItem, setActiveItem } = useAccordionContext()
  const isOpen = activeItem === id

  const toggle = () => {
    setActiveItem(isOpen ? null : id)
  }

  return (
    <div className={cn('rounded-lg border border-gray-200 dark:border-gray-700', className)}>
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-gray-900 dark:text-gray-50">{title}</span>
        <svg
          className={cn('h-5 w-5 text-gray-500 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">{children}</div>
      )}
    </div>
  )
}
