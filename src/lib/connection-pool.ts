/**
 * Generic connection pool implementation
 */

interface PoolOptions {
  minSize: number
  maxSize: number
  acquireTimeout: number
}

export class ConnectionPool<T> {
  private available: T[] = []
  private inUse = new Set<T>()
  private createFn: () => Promise<T>
  private destroyFn: (conn: T) => Promise<void>
  private options: PoolOptions

  constructor(
    createFn: () => Promise<T>,
    destroyFn: (conn: T) => Promise<void>,
    options: Partial<PoolOptions> = {}
  ) {
    this.createFn = createFn
    this.destroyFn = destroyFn
    this.options = {
      minSize: 2,
      maxSize: 10,
      acquireTimeout: 30000,
      ...options,
    }
  }

  async initialize(): Promise<void> {
    const promises = Array.from({ length: this.options.minSize }, () => this.createFn())
    const connections = await Promise.all(promises)
    this.available.push(...connections)
  }

  async acquire(): Promise<T> {
    if (this.available.length > 0) {
      const conn = this.available.pop()!
      this.inUse.add(conn)
      return conn
    }

    if (this.inUse.size < this.options.maxSize) {
      const conn = await this.createFn()
      this.inUse.add(conn)
      return conn
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Connection acquire timeout'))
      }, this.options.acquireTimeout)

      const check = setInterval(() => {
        if (this.available.length > 0) {
          clearInterval(check)
          clearTimeout(timeout)
          const conn = this.available.pop()!
          this.inUse.add(conn)
          resolve(conn)
        }
      }, 100)
    })
  }

  async release(conn: T): Promise<void> {
    this.inUse.delete(conn)
    this.available.push(conn)
  }

  async drain(): Promise<void> {
    const allConnections = [...this.available, ...Array.from(this.inUse)]
    await Promise.all(allConnections.map(conn => this.destroyFn(conn)))
    this.available = []
    this.inUse.clear()
  }

  getStats(): { available: number; inUse: number; total: number } {
    return {
      available: this.available.length,
      inUse: this.inUse.size,
      total: this.available.length + this.inUse.size,
    }
  }
}
