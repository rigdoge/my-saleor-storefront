"use client"

import React from 'react'
import { Container } from '@/components/ui/container'
import { ProductGrid } from '@/components/product/product-grid'
import { ProductFilter } from '@/components/product/product-filter'
import { useProducts } from '@/lib/hooks/use-products'
import { LoadingProducts } from '@/components/shared/loading-products'
import { EmptyState } from '@/components/shared/empty-state'
import { LoadMore } from '@/components/ui/load-more'

export function ProductsPage() {
  const { products, isLoading, error, hasMore, loadMore } = useProducts({})

  return (
    <Container>
      <div className="py-8">
        <h1 className="mb-8 text-3xl font-bold">All Products</h1>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="hidden md:block">
            <ProductFilter />
          </div>
          
          <div className="md:col-span-3">
            {isLoading && products.length === 0 ? (
              <LoadingProducts count={8} />
            ) : error ? (
              <EmptyState
                title="Loading Failed"
                description="Could not load products, please try again later"
                action={{ label: 'Refresh', onClick: () => window.location.reload() }}
              />
            ) : products && products.length > 0 ? (
              <>
                <ProductGrid products={products} />
                
                <LoadMore
                  onLoadMore={loadMore}
                  isLoading={isLoading}
                  hasMore={hasMore}
                />
              </>
            ) : (
              <EmptyState
                title="No Products Found"
                description="There are currently no products to display"
              />
            )}
          </div>
        </div>
      </div>
    </Container>
  )
} 