'use client'

import { memo } from 'react'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ActiveFilter } from '@/lib/types'

interface FilterBadgeProps {
  label: string
  onRemove: () => void
  className?: string
}

const FilterBadge = memo(function FilterBadge({ 
  label, 
  onRemove,
  className
}: FilterBadgeProps) {
  return (
    <Badge 
      variant="secondary" 
      className={cn("gap-1 pr-1", className)}
    >
      {label}
      <button
        className="ml-1 rounded-full p-1 hover:bg-muted"
        onClick={onRemove}
        aria-label={`移除 ${label} 筛选条件`}
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  )
})

interface ActiveFiltersProps {
  filters: ActiveFilter[]
  className?: string
  maxVisible?: number
  onClearAll?: () => void
  showClearAll?: boolean
}

export const ActiveFilters = memo(function ActiveFilters({ 
  filters, 
  className,
  maxVisible = Infinity,
  onClearAll,
  showClearAll = false
}: ActiveFiltersProps) {
  if (filters.length === 0) return null

  const visibleFilters = filters.slice(0, maxVisible)
  const hiddenCount = Math.max(0, filters.length - maxVisible)

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {visibleFilters.map((filter) => (
        <FilterBadge
          key={filter.id}
          label={filter.label}
          onRemove={filter.onRemove}
        />
      ))}
      
      {hiddenCount > 0 && (
        <Badge variant="outline">
          +{hiddenCount} 个筛选条件
        </Badge>
      )}
      
      {showClearAll && filters.length > 0 && onClearAll && (
        <button
          className="ml-2 text-sm text-muted-foreground hover:text-foreground"
          onClick={onClearAll}
        >
          清除全部
        </button>
      )}
    </div>
  )
}) 