"use client"

import React, { useMemo } from 'react'
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
  const { getParam, updateParams, searchParams } = useUrlParams()
  
  // Get filters from URL parameters
  const filters = useMemo(() => {
    return {
      minPrice: getParam('minPrice'),
      maxPrice: getParam('maxPrice'),
      inStock: getParam('inStock'),
      onSale: getParam('onSale')
    }
  }, [getParam, searchParams])
  
  // Clear all filters
  const clearAllFilters = () => {
    updateParams({
      minPrice: null,
      maxPrice: null,
      inStock: null,
      onSale: null,
      page: null
    })
  }
  
  // Check if there are active filters
  const hasActiveFilters = Object.values(filters).some(value => value !== null)
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filters</h3>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="h-8 text-xs"
          >
            <FilterX className="mr-2 h-3 w-3" />
            Clear All
          </Button>
        )}
      </div>
      
      {totalCount !== undefined && (
        <div className="text-sm text-muted-foreground">
          {totalCount} Products
        </div>
      )}
      
      <Separator />
      
      <div className="space-y-4">
        <div>
          <h4 className="mb-2 text-sm font-medium">Price Range</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md border border-input px-3 py-1">
              <span className="text-xs text-muted-foreground">Min</span>
              <input 
                type="number" 
                className="w-full border-0 bg-transparent p-0 text-sm focus:outline-none focus:ring-0" 
                placeholder="¥"
                min={minPrice}
                max={maxPrice}
                value={filters.minPrice || ''}
                onChange={(e) => {
                  updateParams({ 
                    minPrice: e.target.value || null,
                    page: '1'
                  })
                }}
              />
            </div>
            <div className="rounded-md border border-input px-3 py-1">
              <span className="text-xs text-muted-foreground">Max</span>
              <input 
                type="number" 
                className="w-full border-0 bg-transparent p-0 text-sm focus:outline-none focus:ring-0" 
                placeholder="¥"
                min={minPrice}
                max={maxPrice}
                value={filters.maxPrice || ''}
                onChange={(e) => {
                  updateParams({ 
                    maxPrice: e.target.value || null,
                    page: '1'
                  })
                }}
              />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h4 className="mb-2 text-sm font-medium">Product Status</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={filters.inStock === 'true'}
                onChange={(e) => {
                  updateParams({ 
                    inStock: e.target.checked ? 'true' : null,
                    page: '1'
                  })
                }}
              />
              <span className="text-sm">In Stock Only</span>
            </label>
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={filters.onSale === 'true'}
                onChange={(e) => {
                  updateParams({ 
                    onSale: e.target.checked ? 'true' : null,
                    page: '1'
                  })
                }}
              />
              <span className="text-sm">On Sale</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
} 