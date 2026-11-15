import { useState, useCallback, useMemo } from 'react'

interface UsePaginationOptions {
  initialPage?: number
  initialLimit?: number
}

export function usePagination(options: UsePaginationOptions = {}) {
  const { initialPage = 1, initialLimit = 10 } = options
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, newPage))
  }, [])

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1)
  }, [])

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1))
  }, [])

  const resetPagination = useCallback(() => {
    setPage(initialPage)
  }, [initialPage])

  const paginationParams = useMemo(
    () => ({
      page,
      limit,
    }),
    [page, limit]
  )

  return {
    page,
    limit,
    setPage,
    setLimit,
    goToPage,
    nextPage,
    prevPage,
    resetPagination,
    paginationParams,
  }
}

