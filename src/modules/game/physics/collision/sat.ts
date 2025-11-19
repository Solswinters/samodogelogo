/**
 * Separating Axis Theorem (SAT) collision detection
 */

export interface Vector2D {
  x: number
  y: number
}

export interface Polygon {
  vertices: Vector2D[]
}

function dotProduct(a: Vector2D, b: Vector2D): number {
  return a.x * b.x + a.y * b.y
}

function projectPolygon(polygon: Polygon, axis: Vector2D): { min: number; max: number } {
  let min = dotProduct(polygon.vertices[0] as Vector2D, axis)
  let max = min

  for (let i = 1; i < polygon.vertices.length; i++) {
    const projection = dotProduct(polygon.vertices[i] as Vector2D, axis)
    if (projection < min) {
      min = projection
    }
    if (projection > max) {
      max = projection
    }
  }

  return { min, max }
}

function overlap(
  proj1: { min: number; max: number },
  proj2: { min: number; max: number }
): boolean {
  return proj1.max >= proj2.min && proj2.max >= proj1.min
}

function getNormals(polygon: Polygon): Vector2D[] {
  const normals: Vector2D[] = []

  for (let i = 0; i < polygon.vertices.length; i++) {
    const v1 = polygon.vertices[i] as Vector2D
    const v2 = polygon.vertices[(i + 1) % polygon.vertices.length] as Vector2D

    const edge = {
      x: v2.x - v1.x,
      y: v2.y - v1.y,
    }

    // Get perpendicular normal
    const normal = {
      x: -edge.y,
      y: edge.x,
    }

    // Normalize
    const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y)
    normals.push({
      x: normal.x / length,
      y: normal.y / length,
    })
  }

  return normals
}

export function checkSATCollision(poly1: Polygon, poly2: Polygon): boolean {
  const axes = [...getNormals(poly1), ...getNormals(poly2)]

  for (const axis of axes) {
    const proj1 = projectPolygon(poly1, axis)
    const proj2 = projectPolygon(poly2, axis)

    if (!overlap(proj1, proj2)) {
      return false
    }
  }

  return true
}

export function rectangleToPolygon(x: number, y: number, width: number, height: number): Polygon {
  return {
    vertices: [
      { x, y },
      { x: x + width, y },
      { x: x + width, y: y + height },
      { x, y: y + height },
    ],
  }
}
