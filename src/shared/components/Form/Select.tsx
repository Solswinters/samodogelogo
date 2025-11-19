/**
 * Select component
 */

'use client'

import { SelectHTMLAttributes } from 'react'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  options: SelectOption[]
  placeholder?: string
  error?: boolean
}

export function Select({ options, placeholder, error, ...props }: SelectProps) {
  return (
    <select
      className={`block w-full rounded-lg border bg-gray-800 px-4 py-2 text-white transition-colors focus:outline-none focus:ring-2 ${
        error ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-purple-500'
      }`}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map(option => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
