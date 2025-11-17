/**
 * Task scheduler for delayed and recurring operations
 */

interface ScheduledTask {
  id: string
  fn: () => void | Promise<void>
  interval?: number
  timeout?: NodeJS.Timeout
  isRecurring: boolean
}

export class Scheduler {
  private tasks: Map<string, ScheduledTask> = new Map()

  /**
   * Schedule a one-time task
   */
  schedule(id: string, fn: () => void | Promise<void>, delay: number): void {
    this.cancel(id)

    const timeout = setTimeout(() => {
      void this.executeTask(fn)
      this.tasks.delete(id)
    }, delay)

    this.tasks.set(id, { id, fn, timeout, isRecurring: false })
  }

  /**
   * Schedule a recurring task
   */
  scheduleRecurring(id: string, fn: () => void | Promise<void>, interval: number): void {
    this.cancel(id)

    const executeRecurring = (): void => {
      void this.executeTask(fn)
      const task = this.tasks.get(id)
      if (task) {
        task.timeout = setTimeout(executeRecurring, interval)
      }
    }

    const timeout = setTimeout(executeRecurring, interval)
    this.tasks.set(id, { id, fn, interval, timeout, isRecurring: true })
  }

  /**
   * Cancel a scheduled task
   */
  cancel(id: string): void {
    const task = this.tasks.get(id)
    if (task?.timeout) {
      clearTimeout(task.timeout)
    }
    this.tasks.delete(id)
  }

  /**
   * Cancel all scheduled tasks
   */
  cancelAll(): void {
    for (const task of Array.from(this.tasks.values())) {
      if (task.timeout) {
        clearTimeout(task.timeout)
      }
    }
    this.tasks.clear()
  }

  /**
   * Check if a task is scheduled
   */
  has(id: string): boolean {
    return this.tasks.has(id)
  }

  /**
   * Get all scheduled task IDs
   */
  getTaskIds(): string[] {
    return Array.from(this.tasks.keys())
  }

  private async executeTask(fn: () => void | Promise<void>): Promise<void> {
    try {
      await fn()
    } catch (error) {
      console.error('Scheduled task failed:', error)
    }
  }
}

// Singleton instance
export const scheduler = new Scheduler()
