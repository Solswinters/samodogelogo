'use client'

import React from 'react'
import { cn } from '@/shared/utils/cn'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: {
    track: 'w-8 h-4',
    thumb: 'w-3 h-3',
    translate: 'translate-x-4',
  },
  md: {
    track: 'w-11 h-6',
    thumb: 'w-5 h-5',
    translate: 'translate-x-5',
  },
  lg: {
    track: 'w-14 h-7',
    thumb: 'w-6 h-6',
    translate: 'translate-x-7',
  },
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className,
}) => {
  const sizes = sizeClasses[size]

  return (
    <label
      className={cn(
        'flex items-center gap-3 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={cn(
            'rounded-full transition-colors',
            sizes.track,
            checked ? 'bg-blue-600' : 'bg-gray-600'
          )}
        >
          <div
            className={cn(
              'absolute top-0.5 left-0.5 rounded-full bg-white transition-transform',
              sizes.thumb,
              checked && sizes.translate
            )}
          />
        </div>
      </div>
      {label && <span className="text-sm text-gray-300">{label}</span>}
    </label>
  )
}

export default Switch
