/**
 * Worker pool for CPU-intensive tasks
 */

interface Task<T> {
  id: string
  fn: () => T
  resolve: (value: T) => void
  reject: (error: Error) => void
}

export class WorkerPool<T> {
  private tasks: Task<T>[] = []
  private workers: Set<number> = new Set()
  private maxWorkers: number

  constructor(maxWorkers: number = 4) {
    this.maxWorkers = maxWorkers
  }

  async execute<R>(fn: () => R): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      const task: Task<R> = {
        id: Math.random().toString(36),
        fn,
        resolve,
        reject,
      }

      this.tasks.push(task as unknown as Task<T>)
      this.processNext()
    })
  }

  private processNext(): void {
    if (this.workers.size >= this.maxWorkers || this.tasks.length === 0) {
      return
    }

    const task = this.tasks.shift()
    if (!task) {return}

    const workerId = Math.random()
    this.workers.add(workerId)

    setTimeout(() => {
      try {
        const result = task.fn()
        task.resolve(result)
      } catch (error) {
        task.reject(error as Error)
      } finally {
        this.workers.delete(workerId)
        this.processNext()
      }
    }, 0)
  }

  getStats(): { active: number; queued: number } {
    return {
      active: this.workers.size,
      queued: this.tasks.length,
    }
  }
}
