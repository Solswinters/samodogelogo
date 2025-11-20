import React, { forwardRef } from 'react'
import { cn } from '@/shared/utils/cn'

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, description, className, disabled, checked, onChange, ...props }, ref) => {
    return (
      <label
        className={cn(
          'inline-flex items-center gap-3',
          disabled && 'cursor-not-allowed opacity-50',
          !disabled && 'cursor-pointer',
          className
        )}
      >
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className="peer sr-only"
            disabled={disabled}
            checked={checked}
            onChange={onChange}
            {...props}
          />
          <div
            className={cn(
              'block h-6 w-11 rounded-full transition-colors',
              'peer-checked:bg-blue-600',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2',
              !disabled && !checked && 'bg-gray-300 dark:bg-gray-600',
              disabled && 'cursor-not-allowed'
            )}
          />
          <div
            className={cn(
              'absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform',
              'peer-checked:translate-x-5'
            )}
          />
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className="text-sm font-medium text-gray-900 dark:text-gray-50">{label}</span>
            )}
            {description && (
              <span className="text-xs text-gray-500 dark:text-gray-400">{description}</span>
            )}
          </div>
        )}
      </label>
    )
  }
)

Switch.displayName = 'Switch'
