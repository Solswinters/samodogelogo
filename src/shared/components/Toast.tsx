'use client'

import React, { useEffect } from 'react'
import { useUIStore } from '@/stores/ui-store'
import { cn } from '@/shared/utils/cn'

const toastIcons = {
  success: '✓',
  error: '✗',
  warning: '⚠',
  info: 'ℹ',
}

const toastStyles = {
  success: 'bg-green-600 border-green-500',
  error: 'bg-red-600 border-red-500',
  warning: 'bg-yellow-600 border-yellow-500',
  info: 'bg-blue-600 border-blue-500',
}

export const Toast: React.FC = () => {
  const toasts = useUIStore(state => state.toasts)
  const removeToast = useUIStore(state => state.removeToast)

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

interface ToastItemProps {
  toast: {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    duration?: number
  }
  onRemove: (id: string) => void
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        onRemove(toast.id)
      }, toast.duration)

      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, onRemove])

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg',
        'animate-in slide-in-from-right-full duration-300',
        'min-w-[300px] max-w-md',
        toastStyles[toast.type]
      )}
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white font-bold">
        {toastIcons[toast.type]}
      </div>
      <p className="flex-1 text-sm font-medium text-white">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex h-5 w-5 items-center justify-center rounded hover:bg-white/20 text-white transition-colors"
      >
        ×
      </button>
    </div>
  )
}

export default Toast
