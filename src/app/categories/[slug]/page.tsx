'use client'

import { useState, useEffect } from 'react'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { useChannel } from '@/components/providers/channel-provider'
import { CATEGORY_BY_SLUG_QUERY } from '@/lib/graphql/queries/categories'
import { PRODUCTS_QUERY, getProductFilters } from '@/lib/graphql/queries/products'
import { graphqlRequestClient } from '@/lib/graphql/client'
import { ProductCard } from '@/components/product/product-card'
import { ProductFilter } from '@/components/product/product-filter'
import { LoadMore } from '@/components/ui/load-more'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'

function CategorySkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export default function CategoryPage({
  params
}: {
  params: { slug: string }
}) {
  const searchParams = useSearchParams()
  const { currentChannel } = useChannel()

  // 获取分类信息
  const { data: categoryData, isLoading: isLoadingCategory } = useQuery({
    queryKey: ['category', params.slug],
    queryFn: async () => {
      const response = await graphqlRequestClient(CATEGORY_BY_SLUG_QUERY, {
        slug: params.slug,
        channel: currentChannel.slug
      })
      return response.category
    }
  })

  // 获取筛选条件
  const searchParamsObj = Object.fromEntries(searchParams.entries())
  const { filter, sortBy } = getProductFilters(searchParamsObj)
  if (categoryData?.id) {
    filter.categories = [categoryData.id]
  }

  // 获取商品列表
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['products', currentChannel.slug, filter, sortBy],
    queryFn: async ({ pageParam }) => {
      const response = await graphqlRequestClient(PRODUCTS_QUERY, {
        first: 24,
        after: pageParam,
        channel: currentChannel.slug,
        filter,
        sortBy
      })
      return response.products
    },
    initialPageParam: null,
    getNextPageParam: (lastPage: any) => {
      if (lastPage.pageInfo.hasNextPage) {
        return lastPage.pageInfo.endCursor
      }
      return undefined
    },
    enabled: !!categoryData,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })

  // 计算商品总数和价格范围
  const products = productsData?.pages.flatMap(page => 
    page.edges.map((edge: any) => ({
      id: edge.node.id,
      name: edge.node.name,
      description: edge.node.description,
      slug: edge.node.slug,
      price: edge.node.pricing?.priceRange?.start?.gross?.amount || 0,
      currency: edge.node.pricing?.priceRange?.start?.gross?.currency || 'CNY',
      thumbnail: edge.node.thumbnail,
      isAvailable: edge.node.isAvailable,
      rating: edge.node.rating,
      reviewCount: edge.node.reviewCount,
      pricing: {
        price: edge.node.pricing?.priceRange?.start?.gross?.amount || 0,
        currency: edge.node.pricing?.priceRange?.start?.gross?.currency || 'CNY'
      }
    }))
  ) || []

  const totalCount = productsData?.pages[0]?.totalCount || 0
  const priceRange = products.reduce(
    (acc, product) => ({
      min: Math.min(acc.min, product.price),
      max: Math.max(acc.max, product.price)
    }),
    { min: Infinity, max: -Infinity }
  )

  if (isLoadingCategory) {
    return (
      <div className="container py-10">
        <CategorySkeleton />
      </div>
    )
  }

  if (!categoryData) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">分类不存在</h1>
          <p className="mt-2 text-muted-foreground">
            您访问的分类可能已被删除或移动
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="space-y-6">
        {/* 面包屑导航 */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/categories" className="hover:underline">
            全部分类
          </Link>
          {categoryData.ancestors?.edges.map(({ node }: { node: any }) => (
            <React.Fragment key={node.id}>
              <ChevronRight className="h-4 w-4" />
              <Link
                href={`/categories/${node.slug}`}
                className="hover:underline"
              >
                {node.name}
              </Link>
            </React.Fragment>
          ))}
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{categoryData.name}</span>
        </nav>

        {/* 分类信息 */}
        <div className="relative aspect-[3/1] overflow-hidden rounded-xl">
          {categoryData.backgroundImage ? (
            <Image
              src={categoryData.backgroundImage.url}
              alt={categoryData.backgroundImage.alt || categoryData.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          <div className="absolute inset-0 flex items-end p-6">
            <div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                {categoryData.name}
              </h1>
              {categoryData.description && (
                <p className="mt-2 max-w-2xl text-white/90">
                  {categoryData.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 子分类列表 */}
        {categoryData.children?.edges.length > 0 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categoryData.children.edges.map(({ node }: { node: any }) => (
                <Link
                  key={node.id}
                  href={`/categories/${node.slug}`}
                  className="group block space-y-2 rounded-lg border p-4 transition-colors hover:bg-muted"
                >
                  <div className="text-lg font-medium">{node.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {node.products?.totalCount || 0} 件商品
                  </div>
                </Link>
              ))}
            </div>
            <Separator />
          </>
        )}

        {/* 商品筛选 */}
        <ProductFilter
          minPrice={priceRange.min === Infinity ? 0 : priceRange.min}
          maxPrice={priceRange.max === -Infinity ? 10000 : priceRange.max}
          totalCount={totalCount}
        />

        {/* 商品列表 */}
        {isLoadingProducts ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg font-medium">暂无商品</p>
            <p className="mt-2 text-sm text-muted-foreground">
              该分类下暂时没有商品，请稍后再来
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        {/* 加载更多 */}
        {products.length > 0 && (
          <LoadMore
            onLoadMore={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            hasMore={hasNextPage || false}
          />
        )}
      </div>
    </div>
  )
} 