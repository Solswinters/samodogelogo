/**
 * A* pathfinding algorithm for AI navigation
 */

interface Node {
  x: number
  y: number
  g: number
  h: number
  f: number
  parent: Node | null
}

function heuristic(a: Node, b: Node): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

function getNeighbors(node: Node, grid: boolean[][], diagonal = false): Node[] {
  const neighbors: Node[] = []
  const directions = diagonal
    ? [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ]
    : [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]

  for (const [dx, dy] of directions) {
    const nx = node.x + dx
    const ny = node.y + dy

    if (nx >= 0 && nx < grid.length && ny >= 0 && ny < grid[0]!.length && grid[nx]![ny]) {
      neighbors.push({
        x: nx,
        y: ny,
        g: 0,
        h: 0,
        f: 0,
        parent: null,
      })
    }
  }

  return neighbors
}

export function findPath(
  start: { x: number; y: number },
  end: { x: number; y: number },
  grid: boolean[][],
  diagonal = false
): { x: number; y: number }[] | null {
  const startNode: Node = { ...start, g: 0, h: 0, f: 0, parent: null }
  const endNode: Node = { ...end, g: 0, h: 0, f: 0, parent: null }

  startNode.h = heuristic(startNode, endNode)
  startNode.f = startNode.g + startNode.h

  const openList: Node[] = [startNode]
  const closedList: Set<string> = new Set()

  while (openList.length > 0) {
    openList.sort((a, b) => a.f - b.f)
    const current = openList.shift()!

    if (current.x === endNode.x && current.y === endNode.y) {
      const path: { x: number; y: number }[] = []
      let node: Node | null = current

      while (node) {
        path.unshift({ x: node.x, y: node.y })
        node = node.parent
      }

      return path
    }

    closedList.add(`${current.x},${current.y}`)

    const neighbors = getNeighbors(current, grid, diagonal)

    for (const neighbor of neighbors) {
      const key = `${neighbor.x},${neighbor.y}`

      if (closedList.has(key)) {
        continue
      }

      neighbor.g = current.g + 1
      neighbor.h = heuristic(neighbor, endNode)
      neighbor.f = neighbor.g + neighbor.h
      neighbor.parent = current

      const existingIndex = openList.findIndex(n => n.x === neighbor.x && n.y === neighbor.y)

      if (existingIndex === -1) {
        openList.push(neighbor)
      } else if (neighbor.g < openList[existingIndex]!.g) {
        openList[existingIndex] = neighbor
      }
    }
  }

  return null
}
