/**
 * Generic object pool for memory efficiency
 */

export interface Poolable {
  reset(): void
}

export class ObjectPool<T extends Poolable> {
  private available: T[] = []
  private active: Set<T> = new Set()
  private factory: () => T
  private maxSize: number

  constructor(factory: () => T, initialSize: number = 10, maxSize: number = 100) {
    this.factory = factory
    this.maxSize = maxSize

    // Pre-allocate objects
    for (let i = 0; i < initialSize; i++) {
      this.available.push(factory())
    }
  }

  acquire(): T {
    let obj: T

    if (this.available.length > 0) {
      obj = this.available.pop() as T
    } else {
      obj = this.factory()
    }

    obj.reset()
    this.active.add(obj)
    return obj
  }

  release(obj: T): void {
    if (!this.active.has(obj)) {
      return
    }

    this.active.delete(obj)

    if (this.available.length < this.maxSize) {
      obj.reset()
      this.available.push(obj)
    }
  }

  releaseAll(): void {
    this.active.forEach(obj => {
      if (this.available.length < this.maxSize) {
        obj.reset()
        this.available.push(obj)
      }
    })
    this.active.clear()
  }

  getActive(): T[] {
    return Array.from(this.active)
  }

  getStats(): { active: number; available: number; total: number } {
    return {
      active: this.active.size,
      available: this.available.length,
      total: this.active.size + this.available.length,
    }
  }

  clear(): void {
    this.available = []
    this.active.clear()
  }
}
