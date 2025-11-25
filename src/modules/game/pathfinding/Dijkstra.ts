/**
 * Dijkstra pathfinding algorithm
 */

interface DijkstraNode {
  x: number
  y: number
  distance: number
  parent: DijkstraNode | null
}

/**
 * dijkstra utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of dijkstra.
 */
export function dijkstra(
  start: { x: number; y: number },
  end: { x: number; y: number },
  grid: number[][]
): { x: number; y: number }[] | null {
  const rows = grid.length
  const cols = grid[0]?.length ?? 0

  const distances: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Infinity))
  const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false))
  const parents: (DijkstraNode | null)[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(null)
  )

  distances[start.x]![start.y] = 0

  const queue: DijkstraNode[] = [{ ...start, distance: 0, parent: null }]

  while (queue.length > 0) {
    queue.sort((a, b) => a.distance - b.distance)
    const current = queue.shift()!

    if (current.x === end.x && current.y === end.y) {
      const path: { x: number; y: number }[] = []
      let node: DijkstraNode | null = current

      while (node) {
        path.unshift({ x: node.x, y: node.y })
        node = node.parent
      }

      return path
    }

    if (visited[current.x]![current.y]) {
      continue
    }

    visited[current.x]![current.y] = true

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]

    for (const [dx, dy] of directions) {
      const nx = current.x + dx
      const ny = current.y + dy

      if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && !visited[nx]![ny]) {
        const weight = grid[nx]![ny] ?? Infinity
        const newDistance = current.distance + weight

        if (newDistance < distances[nx]![ny]!) {
          distances[nx]![ny] = newDistance
          parents[nx]![ny] = current

          queue.push({
            x: nx,
            y: ny,
            distance: newDistance,
            parent: current,
          })
        }
      }
    }
  }

  return null
}
