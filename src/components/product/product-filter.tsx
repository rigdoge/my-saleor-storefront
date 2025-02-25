"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FilterX } from 'lucide-react'
import { useUrlParams } from '@/lib/hooks/use-url-params'

interface ProductFilterProps {
  minPrice?: number
  maxPrice?: number
  totalCount?: number
}

export function ProductFilter({ minPrice = 0, maxPrice = 10000, totalCount }: ProductFilterProps) {
  const { filters, updateParams } = useUrlParams({})
  
  // 清除所有筛选条件
  const clearAllFilters = () => {
    updateParams({ filters: {}, page: 1 })
  }
  
  // 检查是否有活动的筛选条件
  const hasActiveFilters = Object.keys(filters).length > 0
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">筛选</h3>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="h-8 text-xs"
          >
            <FilterX className="mr-2 h-3 w-3" />
            清除全部
          </Button>
        )}
      </div>
      
      {totalCount !== undefined && (
        <div className="text-sm text-muted-foreground">
          共 {totalCount} 件商品
        </div>
      )}
      
      <Separator />
      
      <div className="space-y-4">
        <div>
          <h4 className="mb-2 text-sm font-medium">价格区间</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md border border-input px-3 py-1">
              <span className="text-xs text-muted-foreground">最低</span>
              <input 
                type="number" 
                className="w-full border-0 bg-transparent p-0 text-sm focus:outline-none focus:ring-0" 
                placeholder="¥"
                min={minPrice}
                max={maxPrice}
                value={filters.minPrice || ''}
                onChange={(e) => {
                  updateParams({ 
                    filters: { 
                      ...filters, 
                      minPrice: e.target.value 
                    },
                    page: 1
                  })
                }}
              />
            </div>
            <div className="rounded-md border border-input px-3 py-1">
              <span className="text-xs text-muted-foreground">最高</span>
              <input 
                type="number" 
                className="w-full border-0 bg-transparent p-0 text-sm focus:outline-none focus:ring-0" 
                placeholder="¥"
                min={minPrice}
                max={maxPrice}
                value={filters.maxPrice || ''}
                onChange={(e) => {
                  updateParams({ 
                    filters: { 
                      ...filters, 
                      maxPrice: e.target.value 
                    },
                    page: 1
                  })
                }}
              />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h4 className="mb-2 text-sm font-medium">商品状态</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={filters.inStock === 'true'}
                onChange={(e) => {
                  updateParams({ 
                    filters: { 
                      ...filters, 
                      inStock: e.target.checked ? 'true' : undefined 
                    },
                    page: 1
                  })
                }}
              />
              <span className="text-sm">仅显示有货</span>
            </label>
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={filters.onSale === 'true'}
                onChange={(e) => {
                  updateParams({ 
                    filters: { 
                      ...filters, 
                      onSale: e.target.checked ? 'true' : undefined 
                    },
                    page: 1
                  })
                }}
              />
              <span className="text-sm">特价商品</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
} 