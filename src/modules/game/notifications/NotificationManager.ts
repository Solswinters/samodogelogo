/**
 * In-game notification system
 */

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  duration: number
  timestamp: number
}

export class NotificationManager {
  private notifications: Notification[] = []
  private maxNotifications: number = 5
  private callbacks: Set<(notification: Notification) => void> = new Set()

  show(
    type: Notification['type'],
    title: string,
    message: string,
    duration: number = 3000
  ): string {
    const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

    const notification: Notification = {
      id,
      type,
      title,
      message,
      duration,
      timestamp: Date.now(),
    }

    this.notifications.push(notification)

    // Keep only max notifications
    if (this.notifications.length > this.maxNotifications) {
      this.notifications.shift()
    }

    // Trigger callbacks
    this.callbacks.forEach((cb) => cb(notification))

    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id)
      }, duration)
    }

    return id
  }

  dismiss(id: string): boolean {
    const index = this.notifications.findIndex((n) => n.id === id)
    if (index !== -1) {
      this.notifications.splice(index, 1)
      return true
    }
    return false
  }

  dismissAll(): void {
    this.notifications = []
  }

  getActive(): Notification[] {
    return [...this.notifications]
  }

  onNotification(callback: (notification: Notification) => void): () => void {
    this.callbacks.add(callback)
    return () => this.callbacks.delete(callback)
  }

  // Convenience methods
  info(title: string, message: string, duration?: number): string {
    return this.show('info', title, message, duration)
  }

  success(title: string, message: string, duration?: number): string {
    return this.show('success', title, message, duration)
  }

  warning(title: string, message: string, duration?: number): string {
    return this.show('warning', title, message, duration)
  }

  error(title: string, message: string, duration?: number): string {
    return this.show('error', title, message, duration)
  }
}

/**
 * notificationManager utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of notificationManager.
 */
export const notificationManager = new NotificationManager()
