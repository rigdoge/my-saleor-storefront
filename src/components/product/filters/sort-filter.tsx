'use client'

import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SortOption {
  label: string
  value: string
}

interface SortFilterProps {
  options: SortOption[]
  currentValue: string
  onChange: (value: string) => void
}

export function SortFilter({
  options,
  currentValue,
  onChange
}: SortFilterProps) {
  return (
    <div className="space-y-2">
      <Label>排序方式</Label>
      <Select value={currentValue} onValueChange={onChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="选择排序方式" />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Separator className="mt-4" />
    </div>
  )
} 