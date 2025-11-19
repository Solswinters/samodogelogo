/**
 * Spatial hashing for efficient collision detection
 */

export interface Bounded {
  x: number
  y: number
  width: number
  height: number
}

export class SpatialHash<T extends Bounded> {
  private cellSize: number
  private cells: Map<string, Set<T>>

  constructor(cellSize = 100) {
    this.cellSize = cellSize
    this.cells = new Map()
  }

  private getCellKey(x: number, y: number): string {
    const cellX = Math.floor(x / this.cellSize)
    const cellY = Math.floor(y / this.cellSize)
    return `${cellX},${cellY}`
  }

  private getCellsForObject(obj: T): string[] {
    const cells: string[] = []
    const minX = Math.floor(obj.x / this.cellSize)
    const minY = Math.floor(obj.y / this.cellSize)
    const maxX = Math.floor((obj.x + obj.width) / this.cellSize)
    const maxY = Math.floor((obj.y + obj.height) / this.cellSize)

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        cells.push(`${x},${y}`)
      }
    }

    return cells
  }

  insert(obj: T): void {
    const cells = this.getCellsForObject(obj)

    for (const cellKey of cells) {
      if (!this.cells.has(cellKey)) {
        this.cells.set(cellKey, new Set())
      }
      this.cells.get(cellKey)?.add(obj)
    }
  }

  remove(obj: T): void {
    const cells = this.getCellsForObject(obj)

    for (const cellKey of cells) {
      this.cells.get(cellKey)?.delete(obj)

      // Clean up empty cells
      if (this.cells.get(cellKey)?.size === 0) {
        this.cells.delete(cellKey)
      }
    }
  }

  getNearby(obj: T): Set<T> {
    const nearby = new Set<T>()
    const cells = this.getCellsForObject(obj)

    for (const cellKey of cells) {
      const cellObjects = this.cells.get(cellKey)
      if (cellObjects) {
        cellObjects.forEach(o => {
          if (o !== obj) {
            nearby.add(o)
          }
        })
      }
    }

    return nearby
  }

  getInRadius(x: number, y: number, radius: number): Set<T> {
    const nearby = new Set<T>()
    const radiusSq = radius * radius

    const minCellX = Math.floor((x - radius) / this.cellSize)
    const minCellY = Math.floor((y - radius) / this.cellSize)
    const maxCellX = Math.floor((x + radius) / this.cellSize)
    const maxCellY = Math.floor((y + radius) / this.cellSize)

    for (let cx = minCellX; cx <= maxCellX; cx++) {
      for (let cy = minCellY; cy <= maxCellY; cy++) {
        const cellKey = `${cx},${cy}`
        const cellObjects = this.cells.get(cellKey)

        if (cellObjects) {
          cellObjects.forEach(obj => {
            const dx = obj.x + obj.width / 2 - x
            const dy = obj.y + obj.height / 2 - y
            if (dx * dx + dy * dy <= radiusSq) {
              nearby.add(obj)
            }
          })
        }
      }
    }

    return nearby
  }

  clear(): void {
    this.cells.clear()
  }

  getStats() {
    let totalObjects = 0
    this.cells.forEach(cell => {
      totalObjects += cell.size
    })

    return {
      cellCount: this.cells.size,
      totalObjects,
      cellSize: this.cellSize,
    }
  }
}
