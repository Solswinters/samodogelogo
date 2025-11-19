'use client'

import React from 'react'
import { cn } from '@/shared/utils/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const variantStyles = {
  default: 'bg-gray-600 text-gray-100',
  success: 'bg-green-600 text-green-100',
  warning: 'bg-yellow-600 text-yellow-100',
  error: 'bg-red-600 text-red-100',
  info: 'bg-blue-600 text-blue-100',
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  )
}

export default Badge
