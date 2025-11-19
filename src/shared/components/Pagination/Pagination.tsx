/**
 * Pagination component
 */

'use client'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showFirstLast?: boolean
  maxVisible?: number
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisible = 5,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const halfVisible = Math.floor(maxVisible / 2)

    let start = Math.max(1, currentPage - halfVisible)
    let end = Math.min(totalPages, currentPage + halfVisible)

    if (currentPage <= halfVisible) {
      end = Math.min(totalPages, maxVisible)
    }

    if (currentPage > totalPages - halfVisible) {
      start = Math.max(1, totalPages - maxVisible + 1)
    }

    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('...')
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="rounded px-3 py-2 text-sm text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-600 disabled:hover:bg-transparent"
          aria-label="First page"
        >
          ««
        </button>
      )}

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded px-3 py-2 text-sm text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-600 disabled:hover:bg-transparent"
        aria-label="Previous page"
      >
        «
      </button>

      {getPageNumbers().map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-600">
              ...
            </span>
          )
        }

        const pageNum = page as number
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`rounded px-3 py-2 text-sm transition-colors ${
              currentPage === pageNum ? 'bg-purple-500 text-white' : 'text-white hover:bg-gray-700'
            }`}
            aria-label={`Page ${pageNum}`}
            aria-current={currentPage === pageNum ? 'page' : undefined}
          >
            {pageNum}
          </button>
        )
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded px-3 py-2 text-sm text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-600 disabled:hover:bg-transparent"
        aria-label="Next page"
      >
        »
      </button>

      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="rounded px-3 py-2 text-sm text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-600 disabled:hover:bg-transparent"
          aria-label="Last page"
        >
          »»
        </button>
      )}
    </nav>
  )
}
