/**
 * Toast notification system
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info'
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export interface ToastOptions {
  type?: ToastType
  duration?: number
  position?: ToastPosition
  closable?: boolean
  onClose?: () => void
}

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration: number
  position: ToastPosition
  closable: boolean
  timestamp: number
  onClose?: () => void
}

type ToastListener = (toasts: Toast[]) => void

export class ToastManager {
  private static instance: ToastManager | null = null
  private toasts: Toast[] = []
  private listeners: Set<ToastListener> = new Set()
  private idCounter = 0

  private constructor() {}

  static getInstance(): ToastManager {
    if (!this.instance) {
      this.instance = new ToastManager()
    }
    return this.instance
  }

  /**
   * Show a toast notification
   */
  show(message: string, options: ToastOptions = {}): string {
    const toast: Toast = {
      id: `toast-${this.idCounter++}`,
      message,
      type: options.type || 'info',
      duration: options.duration ?? 3000,
      position: options.position || 'top-right',
      closable: options.closable ?? true,
      timestamp: Date.now(),
      onClose: options.onClose,
    }

    this.toasts.push(toast)
    this.notifyListeners()

    // Auto dismiss
    if (toast.duration > 0) {
      setTimeout(() => {
        this.dismiss(toast.id)
      }, toast.duration)
    }

    return toast.id
  }

  /**
   * Show success toast
   */
  success(message: string, options: Omit<ToastOptions, 'type'> = {}): string {
    return this.show(message, { ...options, type: 'success' })
  }

  /**
   * Show error toast
   */
  error(message: string, options: Omit<ToastOptions, 'type'> = {}): string {
    return this.show(message, { ...options, type: 'error' })
  }

  /**
   * Show warning toast
   */
  warning(message: string, options: Omit<ToastOptions, 'type'> = {}): string {
    return this.show(message, { ...options, type: 'warning' })
  }

  /**
   * Show info toast
   */
  info(message: string, options: Omit<ToastOptions, 'type'> = {}): string {
    return this.show(message, { ...options, type: 'info' })
  }

  /**
   * Dismiss a toast
   */
  dismiss(id: string): void {
    const index = this.toasts.findIndex((t) => t.id === id)
    if (index !== -1) {
      const toast = this.toasts[index]
      this.toasts.splice(index, 1)
      toast.onClose?.()
      this.notifyListeners()
    }
  }

  /**
   * Dismiss all toasts
   */
  dismissAll(): void {
    this.toasts.forEach((toast) => toast.onClose?.())
    this.toasts = []
    this.notifyListeners()
  }

  /**
   * Get all active toasts
   */
  getToasts(): Toast[] {
    return [...this.toasts]
  }

  /**
   * Subscribe to toast changes
   */
  subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notifyListeners(): void {
    const toasts = this.getToasts()
    this.listeners.forEach((listener) => listener(toasts))
  }
}

// Export singleton instance
export const toast = ToastManager.getInstance()
