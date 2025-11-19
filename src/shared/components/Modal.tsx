'use client'

import React, { useEffect, useRef } from 'react'
import { useUIStore } from '@/stores/ui-store'
import { cn } from '@/shared/utils/cn'

interface ModalProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnBackdrop?: boolean
  showClose?: boolean
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
}

export const Modal: React.FC<ModalProps> = ({
  children,
  size = 'md',
  closeOnBackdrop = true,
  showClose = true,
}) => {
  const modal = useUIStore(state => state.modal)
  const closeModal = useUIStore(state => state.closeModal)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (modal.isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [modal.isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modal.isOpen) {
        closeModal()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [modal.isOpen, closeModal])

  if (!modal.isOpen) {
    return null
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      closeModal()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={cn(
          'relative w-full rounded-xl bg-gray-800 text-white shadow-2xl',
          'animate-in fade-in zoom-in-95 duration-200',
          sizeClasses[size]
        )}
      >
        {showClose && (
          <button
            onClick={closeModal}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            ×
          </button>
        )}
        {children}
      </div>
    </div>
  )
}

interface ModalHeaderProps {
  children: React.ReactNode
  className?: string
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ children, className }) => {
  return (
    <div className={cn('border-b border-gray-700 px-6 py-4', className)}>
      <h2 className="text-2xl font-bold">{children}</h2>
    </div>
  )
}

interface ModalBodyProps {
  children: React.ReactNode
  className?: string
}

export const ModalBody: React.FC<ModalBodyProps> = ({ children, className }) => {
  return <div className={cn('px-6 py-4', className)}>{children}</div>
}

interface ModalFooterProps {
  children: React.ReactNode
  className?: string
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ children, className }) => {
  return (
    <div className={cn('border-t border-gray-700 px-6 py-4 flex justify-end gap-3', className)}>
      {children}
    </div>
  )
}

export default Modal
