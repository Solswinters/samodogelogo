import React, { forwardRef } from 'react'
import { cn } from '@/shared/utils/cn'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, resize = 'vertical', disabled, ...props }, ref) => {
    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    }

    return (
      <textarea
        ref={ref}
        disabled={disabled}
        className={cn(
          'block w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          error
            ? 'border-red-300 text-red-900 focus:ring-red-500 dark:border-red-600 dark:text-red-50'
            : 'border-gray-300 text-gray-900 dark:border-gray-600 dark:text-gray-50',
          'bg-white dark:bg-gray-800',
          resizeClasses[resize],
          className
        )}
        aria-invalid={!!error}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'
