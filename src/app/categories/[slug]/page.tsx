'use client'

import { useState, useEffect } from 'react'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { useChannel } from '@/components/providers/channel-provider'
import { CATEGORY_BY_SLUG_QUERY, CATEGORY_BY_ID_QUERY } from '@/lib/graphql/queries/categories'
import { PRODUCTS_QUERY, getProductFilters } from '@/lib/graphql/queries/products'
import { graphqlRequestClient } from '@/lib/graphql/client'
import { ProductCard } from '@/components/product/product-card'
import { ProductFilter } from '@/components/product/product-filter'
import { LoadMore } from '@/components/ui/load-more'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronRight, RefreshCw } from 'lucide-react'
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
  const [retryCount, setRetryCount] = useState(0)
  const [fallbackToId, setFallbackToId] = useState(false)
  const [categoryId, setCategoryId] = useState<string | null>(null)
  
  // 特殊处理 Accessories/homewares 分类
  const isAccessoriesHomewares = params.slug === 'homewares' || params.slug === 'accessories'

  // 获取分类信息
  const { 
    data: categoryData, 
    isLoading: isLoadingCategory,
    error: categoryError,
    refetch: refetchCategory
  } = useQuery({
    queryKey: ['category', params.slug, fallbackToId, categoryId, retryCount, isAccessoriesHomewares],
    queryFn: async () => {
      try {
        // 特殊处理 Accessories/homewares 分类
        if (isAccessoriesHomewares) {
          console.log(`特殊处理 ${params.slug} 分类数据获取`)
          
          // 添加额外的重试和错误处理
          let retries = 0
          const maxRetries = 3
          
          while (retries < maxRetries) {
            try {
              const response = await graphqlRequestClient(CATEGORY_BY_SLUG_QUERY, {
                slug: params.slug,
                channel: currentChannel.slug
              }, true) // 添加第三个参数，表示这是特殊处理的请求
              
              if (response && response.category) {
                setCategoryId(response.category.id)
                
                // 验证子分类数据
                if (response.category.children) {
                  if (!response.category.children.edges || !Array.isArray(response.category.children.edges)) {
                    response.category.children.edges = []
                  } else {
                    response.category.children.edges = response.category.children.edges.filter(
                      (edge: { node?: { id?: string } }) => edge && edge.node && edge.node.id
                    )
                  }
                }
                
                return response.category
              }
              
              throw new Error(`无法获取 ${params.slug} 分类数据`)
            } catch (err) {
              retries++
              if (retries >= maxRetries) throw err
              await new Promise(resolve => setTimeout(resolve, 1000 * retries))
            }
          }
        }
        
        // 首先尝试通过 slug 获取
        if (!fallbackToId) {
          const response = await graphqlRequestClient(CATEGORY_BY_SLUG_QUERY, {
            slug: params.slug,
            channel: currentChannel.slug
          })
          
          // 如果找到分类，保存 ID 以备后用
          if (response.category) {
            setCategoryId(response.category.id)
            return response.category
          }
          
          // 如果没有找到分类，尝试使用 ID 查询
          setFallbackToId(true)
          return null
        } 
        
        // 如果通过 slug 查询失败，尝试通过 ID 查询
        if (categoryId) {
          const response = await graphqlRequestClient(CATEGORY_BY_ID_QUERY, {
            id: categoryId,
            channel: currentChannel.slug
          })
          return response.category
        }
        
        return null
      } catch (err) {
        console.error('获取分类信息失败:', err)
        throw err
      }
    },
    retry: isAccessoriesHomewares ? 5 : 2, // 为特殊分类增加重试次数
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000), // 指数退避策略
    staleTime: 5 * 60 * 1000
  })

  // 如果发现错误，尝试重新获取数据
  useEffect(() => {
    if (categoryError) {
      console.error('分类数据加载错误，尝试重新获取:', categoryError)
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [categoryError])

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
    isFetchingNextPage,
    error: productsError
  } = useInfiniteQuery({
    queryKey: ['products', currentChannel.slug, filter, sortBy, retryCount, isAccessoriesHomewares],
    queryFn: async ({ pageParam }) => {
      try {
        // 特殊处理 Accessories/homewares 分类的商品
        if (isAccessoriesHomewares) {
          console.log(`特殊处理 ${params.slug} 分类商品数据获取`)
          
          // 添加额外的重试和错误处理
          let retries = 0
          const maxRetries = 3
          
          while (retries < maxRetries) {
            try {
              const response = await graphqlRequestClient(PRODUCTS_QUERY, {
                first: 24,
                after: pageParam,
                channel: currentChannel.slug,
                filter,
                sortBy
              }, true) // 添加第三个参数，表示这是特殊处理的请求
              
              if (response && response.products) {
                return response.products
              }
              
              throw new Error(`无法获取 ${params.slug} 分类商品数据`)
            } catch (err) {
              retries++
              if (retries >= maxRetries) throw err
              await new Promise(resolve => setTimeout(resolve, 1000 * retries))
            }
          }
        }
        
        const response = await graphqlRequestClient(PRODUCTS_QUERY, {
          first: 24,
          after: pageParam,
          channel: currentChannel.slug,
          filter,
          sortBy
        })
        return response.products
      } catch (err) {
        console.error('获取商品列表失败:', err)
        throw err
      }
    },
    initialPageParam: null,
    getNextPageParam: (lastPage: any) => {
      if (lastPage && lastPage.pageInfo && lastPage.pageInfo.hasNextPage) {
        return lastPage.pageInfo.endCursor
      }
      return undefined
    },
    enabled: !!categoryData,
    staleTime: isAccessoriesHomewares ? 1 * 60 * 1000 : 2 * 60 * 1000, // 特殊分类缓存时间更短
    gcTime: 10 * 60 * 1000,
    retry: isAccessoriesHomewares ? 5 : 2 // 为特殊分类增加重试次数
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

  // 安全地获取子分类
  const getChildCategories = () => {
    if (!categoryData || !categoryData.children || !categoryData.children.edges) {
      return []
    }
    return categoryData.children.edges
      .filter((edge: any) => edge && edge.node && edge.node.id)
      .map((edge: any) => edge.node)
  }

  if (isLoadingCategory) {
    return (
      <div className="container py-10">
        <CategorySkeleton />
      </div>
    )
  }

  if (categoryError || !categoryData) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">加载分类信息失败</h1>
          <p className="mt-2 text-muted-foreground">
            无法加载分类信息，请稍后再试
          </p>
          <Button 
            onClick={() => {
              setRetryCount(prev => prev + 1)
              refetchCategory()
            }} 
            variant="outline" 
            className="mt-4"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            重试
          </Button>
        </div>
      </div>
    )
  }

  const childCategories = getChildCategories()

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
        {childCategories.length > 0 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {childCategories.map((node: any) => (
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
        ) : productsError ? (
          <div className="py-12 text-center">
            <p className="text-lg font-medium text-red-500">加载商品失败</p>
            <p className="mt-2 text-sm text-muted-foreground">
              获取商品数据时出错，请稍后再试
            </p>
            <Button 
              onClick={() => setRetryCount(prev => prev + 1)} 
              variant="outline" 
              className="mt-4"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              重试
            </Button>
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
        {products.length > 0 && !productsError && (
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