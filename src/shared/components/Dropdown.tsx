import React, { useState, useRef, useEffect, createContext, useContext } from 'react'
import { cn } from '@/shared/utils/cn'
import { useClickOutside } from '@/hooks/useClickOutside'

interface DropdownContextValue {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const DropdownContext = createContext<DropdownContextValue | undefined>(undefined)

const useDropdownContext = () => {
  const context = useContext(DropdownContext)
  if (!context) {
    throw new Error('Dropdown components must be used within a Dropdown component')
  }
  return context
}

export interface DropdownProps {
  children: React.ReactNode
}

export const Dropdown: React.FC<DropdownProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useClickOutside(dropdownRef, () => setIsOpen(false))

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div ref={dropdownRef} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

export interface DropdownTriggerProps {
  children: React.ReactNode
  className?: string
}

export const DropdownTrigger: React.FC<DropdownTriggerProps> = ({ children, className }) => {
  const { isOpen, setIsOpen } = useDropdownContext()

  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={cn('inline-flex items-center', className)}
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      {children}
    </button>
  )
}

export interface DropdownContentProps {
  children: React.ReactNode
  className?: string
  align?: 'start' | 'center' | 'end'
}

export const DropdownContent: React.FC<DropdownContentProps> = ({
  children,
  className,
  align = 'start',
}) => {
  const { isOpen } = useDropdownContext()

  if (!isOpen) return null

  const alignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  }

  return (
    <div
      className={cn(
        'absolute z-50 mt-2 min-w-[12rem] rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800',
        'focus:outline-none',
        alignmentClasses[align],
        className
      )}
      role="menu"
    >
      {children}
    </div>
  )
}

export interface DropdownItemProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  onClick,
  className,
  disabled = false,
}) => {
  const { setIsOpen } = useDropdownContext()

  const handleClick = () => {
    if (!disabled) {
      onClick?.()
      setIsOpen(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
        'first:rounded-t-md last:rounded-b-md',
        'transition-colors',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      role="menuitem"
    >
      {children}
    </button>
  )
}

export interface DropdownSeparatorProps {
  className?: string
}

export const DropdownSeparator: React.FC<DropdownSeparatorProps> = ({ className }) => {
  return (
    <div className={cn('my-1 h-px bg-gray-200 dark:bg-gray-700', className)} role="separator" />
  )
}
