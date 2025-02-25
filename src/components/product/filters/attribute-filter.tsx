'use client'

import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface FilterOption {
  label: string
  value: string
  count?: number
}

interface AttributeFilterProps {
  title: string
  options: FilterOption[]
  selectedValues: string[]
  onChange: (value: string) => void
}

export function AttributeFilter({
  title,
  options,
  selectedValues,
  onChange
}: AttributeFilterProps) {
  return (
    <div className="space-y-4">
      <Label>{title}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Badge
            key={option.value}
            variant={selectedValues.includes(option.value) ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => onChange(option.value)}
          >
            {option.label}
            {option.count !== undefined && (
              <span className="ml-1 text-xs">({option.count})</span>
            )}
          </Badge>
        ))}
      </div>
      <Separator />
    </div>
  )
} 