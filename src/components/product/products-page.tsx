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
        <h1 className="mb-8 text-3xl font-bold">所有产品</h1>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="hidden md:block">
            <ProductFilter />
          </div>
          
          <div className="md:col-span-3">
            {isLoading && products.length === 0 ? (
              <LoadingProducts count={8} />
            ) : error ? (
              <EmptyState
                title="加载失败"
                description="无法加载产品，请稍后重试"
                action={{ label: '刷新', onClick: () => window.location.reload() }}
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
                title="没有找到产品"
                description="暂时没有产品可显示"
              />
            )}
          </div>
        </div>
      </div>
    </Container>
  )
} 