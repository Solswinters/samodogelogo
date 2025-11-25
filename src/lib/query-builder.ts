/**
 * URL query builder utility
 */

export class QueryBuilder {
  private params: Map<string, string> = new Map()

  add(key: string, value: string | number | boolean | null | undefined): this {
    if (value !== null && value !== undefined) {
      this.params.set(key, String(value))
    }
    return this
  }

  addMultiple(params: Record<string, string | number | boolean | null | undefined>): this {
    Object.entries(params).forEach(([key, value]) => {
      this.add(key, value)
    })
    return this
  }

  remove(key: string): this {
    this.params.delete(key)
    return this
  }

  clear(): this {
    this.params.clear()
    return this
  }

  build(): string {
    if (this.params.size === 0) {
      return ''
    }

    const queryString = Array.from(this.params.entries())
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')

    return `?${queryString}`
  }

  toString(): string {
    return this.build()
  }
}

/**
 * buildQuery utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of buildQuery.
 */
export function buildQuery(
  params: Record<string, string | number | boolean | null | undefined>
): string {
  return new QueryBuilder().addMultiple(params).build()
}
