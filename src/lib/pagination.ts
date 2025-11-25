/**
 * Pagination utilities
 */

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

/**
 * calculatePagination utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of calculatePagination.
 */
export function calculatePagination(params: PaginationParams, total: number): PaginationMeta {
  const { page, pageSize } = params
  const totalPages = Math.ceil(total / pageSize)

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}

/**
 * paginate utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of paginate.
 */
export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const startIndex = (page - 1) * pageSize
  return items.slice(startIndex, startIndex + pageSize)
}

/**
 * getPageRange utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getPageRange.
 */
export function getPageRange(
  currentPage: number,
  totalPages: number,
  maxPages: number = 5
): number[] {
  const half = Math.floor(maxPages / 2)
  let start = Math.max(1, currentPage - half)
  const end = Math.min(totalPages, start + maxPages - 1)

  if (end - start + 1 < maxPages) {
    start = Math.max(1, end - maxPages + 1)
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}
