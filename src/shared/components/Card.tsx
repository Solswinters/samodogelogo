'use client'

import React from 'react'
import { cn } from '@/shared/utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({ children, className, hover = false, onClick }) => {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-700 bg-gray-800 p-6',
        hover && 'transition-all hover:border-gray-600 hover:shadow-lg cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return <div className={cn('mb-4', className)}>{children}</div>
}

interface CardTitleProps {
  children: React.ReactNode
  className?: string
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
  return <h3 className={cn('text-xl font-bold text-white', className)}>{children}</h3>
}

interface CardDescriptionProps {
  children: React.ReactNode
  className?: string
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className }) => {
  return <p className={cn('text-sm text-gray-400', className)}>{children}</p>
}

interface CardBodyProps {
  children: React.ReactNode
  className?: string
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className }) => {
  return <div className={cn(className)}>{children}</div>
}

interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return <div className={cn('mt-4 flex gap-3', className)}>{children}</div>
}

export default Card
