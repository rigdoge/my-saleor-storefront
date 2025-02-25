'use client'

import * as React from 'react'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface LoadMoreProps extends React.HTMLAttributes<HTMLDivElement> {
  onLoadMore: () => void
  isLoading: boolean
  hasMore: boolean
}

export function LoadMore({
  onLoadMore,
  isLoading,
  hasMore,
  ...props
}: LoadMoreProps) {
  const { ref, inView } = useInView()

  React.useEffect(() => {
    if (inView && hasMore && !isLoading) {
      onLoadMore()
    }
  }, [inView, hasMore, isLoading, onLoadMore])

  if (!hasMore) return null

  return (
    <div
      ref={ref}
      className="flex justify-center py-8"
      {...props}
    >
      <Button
        variant="outline"
        size="lg"
        disabled={isLoading}
        onClick={() => onLoadMore()}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            加载中...
          </>
        ) : (
          '加载更多'
        )}
      </Button>
    </div>
  )
} 