/**
 * Confirm dialog component
 */

'use client'

import { Button } from '@/shared/components/Button'
import { Dialog } from '@/shared/components/Dialog/Dialog'

export interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'danger'
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-gray-300">{message}</p>
        <div className="flex gap-3">
          <Button onClick={onClose} variant="outline" className="flex-1">
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            variant={variant === 'danger' ? 'default' : 'default'}
            className={`flex-1 ${variant === 'danger' ? 'bg-red-500 hover:bg-red-600' : ''}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
