'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'

interface PriceRangeFilterProps {
  minPrice: number
  maxPrice: number
  currentMinPrice?: number | null
  currentMaxPrice?: number | null
  onPriceChange: (min: number, max: number) => void
}

export function PriceRangeFilter({
  minPrice,
  maxPrice,
  currentMinPrice,
  currentMaxPrice,
  onPriceChange
}: PriceRangeFilterProps) {
  // 初始化价格范围
  const [priceRange, setPriceRange] = useState<[number, number]>([
    currentMinPrice ?? minPrice,
    currentMaxPrice ?? maxPrice
  ])

  // 当外部价格变化时更新内部状态
  useEffect(() => {
    setPriceRange([
      currentMinPrice ?? minPrice,
      currentMaxPrice ?? maxPrice
    ])
  }, [currentMinPrice, currentMaxPrice, minPrice, maxPrice])

  // 处理价格范围变化
  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value)
  }

  // 应用价格范围
  const handlePriceRangeCommit = (value: [number, number]) => {
    onPriceChange(value[0], value[1])
  }

  return (
    <div className="space-y-4">
      <Label>价格范围</Label>
      <Slider
        min={minPrice}
        max={maxPrice}
        step={100}
        value={priceRange}
        onValueChange={handlePriceRangeChange}
        onValueCommit={handlePriceRangeCommit}
        className="py-4"
      />
      <div className="flex items-center justify-between text-sm">
        <span>¥{priceRange[0]}</span>
        <span>¥{priceRange[1]}</span>
      </div>
      <Separator />
    </div>
  )
} 