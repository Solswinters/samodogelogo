import React, { forwardRef } from 'react'
import { cn } from '@/shared/utils/cn'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className, disabled, ...props }, ref) => {
    return (
      <label
        className={cn(
          'inline-flex items-start gap-2',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          className
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          disabled={disabled}
          className={cn(
            'mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 transition-colors',
            'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            'disabled:cursor-not-allowed',
            'dark:border-gray-600 dark:bg-gray-800'
          )}
          {...props}
        />
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

Checkbox.displayName = 'Checkbox'
