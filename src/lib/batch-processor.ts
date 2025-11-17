/**
 * Batch processor for efficient bulk operations
 */

export class BatchProcessor<T> {
  private batch: T[] = []
  private timer: NodeJS.Timeout | null = null

  constructor(
    private processFn: (items: T[]) => Promise<void>,
    private batchSize: number = 10,
    private maxWait: number = 1000
  ) {}

  add(item: T): void {
    this.batch.push(item)

    if (this.batch.length >= this.batchSize) {
      void this.flush()
    } else if (!this.timer) {
      this.timer = setTimeout(() => {
        void this.flush()
      }, this.maxWait)
    }
  }

  async flush(): Promise<void> {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }

    if (this.batch.length === 0) {return}

    const items = [...this.batch]
    this.batch = []

    await this.processFn(items)
  }

  async close(): Promise<void> {
    await this.flush()
  }

  getQueueSize(): number {
    return this.batch.length
  }
}
