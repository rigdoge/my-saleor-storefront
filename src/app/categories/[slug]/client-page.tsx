'use client'

import { useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { useChannel } from '@/components/providers/channel-provider'
import { CATEGORY_BY_SLUG_QUERY, CATEGORY_BY_ID_QUERY } from '@/lib/graphql/queries/categories'
import { PRODUCTS_QUERY, getProductFilters, ProductFilterInput, ProductSortInput } from '@/lib/graphql/queries/products'
import { graphqlRequestClient } from '@/lib/graphql/client'
import { CategoryPageTemplate } from '@/components/category/category-page-template'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUrlParams } from '@/lib/hooks/use-url-params'
import Link from 'next/link'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorAlert } from '@/components/ui/error-alert'

// 添加类型定义
interface ProductNode {
  id: string
  name: string
  description?: string
  slug: string
  productType?: {
    id: string
    name: string
    kind: string
  }
  thumbnail?: {
    url: string
    alt?: string
  }
  pricing?: {
    priceRange?: {
      start?: {
        gross?: {
          amount: number
          currency: string
        }
      }
    }
    discount?: {
      gross?: {
        amount: number
        currency: string
      }
    }
  }
  isAvailable?: boolean
  rating?: number
  reviewCount?: number
  category?: {
    id: string
    name: string
    slug: string
  }
  variants?: Array<{
    id: string
    name: string
    quantityAvailable: number
    attributes: Array<{
      attribute: {
        name: string
        slug: string
      }
      values: Array<{
        name: string
        slug: string
      }>
    }>
  }>
}

interface ProductEdge {
  node: ProductNode
  cursor: string
}

interface ProductConnection {
  edges: ProductEdge[]
  pageInfo: {
    hasNextPage: boolean
    endCursor?: string
  }
  totalCount: number
}

interface CategoryData {
  id: string
  name: string
  slug: string
  parent?: {
    id: string
    name: string
    slug: string
  }
}

interface ProductsResponse {
  products: ProductConnection
}

// 添加响应类型定义
interface GraphQLResponse<T> {
  data: T
  errors?: Array<{
    message: string
    locations: Array<{
      line: number
      column: number
    }>
    path?: string[]
  }>
}

function CategorySkeleton() {
  return (
    <div className="space-y-6">
      <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden bg-muted">
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
          <div className="container">
            <Skeleton className="h-4 w-[200px] mb-4" />
            <Skeleton className="h-10 w-[300px] mb-2" />
            <Skeleton className="h-4 w-[400px] mb-4" />
            <Skeleton className="h-6 w-[100px]" />
          </div>
        </div>
      </div>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="hidden md:block w-64 flex-shrink-0">
            <Skeleton className="h-8 w-[150px] mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-6 w-[120px]" />
                  <Skeleton className="h-4 w-[180px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-6">
              <Skeleton className="h-10 w-[180px]" />
              <Skeleton className="h-10 w-[120px]" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface CategoryPageProps {
  params: { slug: string }
  initialCategory?: any
  initialProducts?: any
}

export function CategoryPage({
  params,
  initialCategory,
  initialProducts
}: CategoryPageProps) {
  const searchParams = useSearchParams()
  const { currentChannel } = useChannel()
  const [retryCount, setRetryCount] = useState(0)
  const { updateParams, getParam } = useUrlParams()
  const channel = currentChannel?.slug || process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || 'default-channel'
  
  // 将 searchParams 转换为普通对象
  const searchParamsObj = Object.fromEntries(searchParams?.entries() || [])
  
  // 获取分类信息
  const { 
    data: categoryData, 
    isLoading: isLoadingCategory,
    error: categoryError,
    refetch: refetchCategory
  } = useQuery({
    queryKey: ['category', params.slug, channel, searchParams?.toString()],
    queryFn: async () => {
      try {
        const response = await graphqlRequestClient(CATEGORY_BY_SLUG_QUERY, {
          slug: params.slug,
          channel,
          filter: getProductFilters(searchParamsObj),
          sortBy: getParam('sort') || 'date_desc'
        })
        
        // 如果找到分类，返回它
        if (response.category) {
          return response.category
        }
        
        // 如果通过 slug 未找到，尝试通过 ID 查找
        try {
          const idResponse = await graphqlRequestClient(CATEGORY_BY_ID_QUERY, {
            id: params.slug,
            channel: currentChannel.slug
          })
          
          if (idResponse.category) {
            return idResponse.category
          }
        } catch (idError) {
          console.error('通过 ID 获取分类失败:', idError)
        }
        
        throw new Error(`未找到分类: ${params.slug}`)
      } catch (err) {
        console.error('获取分类信息失败:', err)
        throw err
      }
    },
    initialData: initialCategory,
    retry: 2,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000), // 指数退避
    staleTime: 5 * 60 * 1000
  })

  // 获取筛选条件
  const { filter, sortBy } = getProductFilters(searchParamsObj)
  if (categoryData?.id) {
    filter.categories = [categoryData.id]
  }

  // 获取产品列表
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error: productsError,
    refetch: refetchProducts
  } = useInfiniteQuery<ProductConnection>({
    queryKey: ['products', currentChannel.slug, filter, sortBy, retryCount],
    queryFn: async ({ pageParam }) => {
      try {
        const response = await graphqlRequestClient(PRODUCTS_QUERY, {
          first: 24,
          after: pageParam,
          channel: currentChannel.slug || channel,
          filter: {
            ...filter,
            channel: currentChannel.slug || channel
          },
          sortBy
        }) as { products: ProductConnection }

        if (!response?.products) {
          throw new Error('No products data received')
        }

        return response.products
      } catch (err) {
        console.error('获取产品列表失败:', err)
        throw err
      }
    },
    initialData: initialProducts ? {
      pages: [initialProducts],
      pageParams: [null]
    } : undefined,
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined
      return lastPage.pageInfo?.hasNextPage ? lastPage.pageInfo.endCursor : undefined
    },
    enabled: !!categoryData?.id,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2
  })

  // 计算产品总数和价格范围
  const products = useMemo(() => {
    if (!productsData?.pages) return []
    
    return productsData.pages.flatMap(page => {
      if (!page?.edges) return []
      
      return page.edges.map((edge: ProductEdge) => {
        if (!edge?.node) return null
        
        const node = edge.node
        const isGiftCard = node.productType?.kind === 'GIFT_CARD'
        
        return {
          id: node.id,
          name: node.name,
          description: node.description,
          slug: node.slug,
          price: node.pricing?.priceRange?.start?.gross?.amount || 0,
          currency: node.pricing?.priceRange?.start?.gross?.currency || 'CNY',
          thumbnail: node.thumbnail,
          isAvailable: node.isAvailable,
          rating: node.rating,
          reviewCount: node.reviewCount,
          category: node.category,
          isGiftCard,
          productType: node.productType,
          pricing: {
            price: node.pricing?.priceRange?.start?.gross?.amount || 0,
            currency: node.pricing?.priceRange?.start?.gross?.currency || 'CNY',
            discount: node.pricing?.discount?.gross?.amount
              ? {
                  amount: node.pricing?.discount?.gross?.amount,
                  currency: node.pricing?.discount?.gross?.currency || 'CNY'
                }
              : undefined
          }
        }
      }).filter(Boolean)
    })
  }, [productsData?.pages])

  const totalCount = productsData?.pages?.[0]?.totalCount || 0

  // 构建面包屑
  const breadcrumbs = []
  if (categoryData?.parent) {
    breadcrumbs.push({
      name: categoryData.parent.name,
      href: `/categories/${categoryData.parent.slug}`
    })
  }

  // 处理排序变更
  const handleSortChange = useCallback((value: string) => {
    updateParams({ sort: value, page: '1' })
  }, [updateParams])

  // 加载更多产品
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoadingCategory) {
    return <CategorySkeleton />
  }

  if (categoryError || !categoryData) {
    return (
      <div className="container py-10">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            We couldn't find the category you're looking for. It may have been removed or the URL might be incorrect.
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h1 className="text-2xl font-bold">Category Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            Could not find category "{params.slug}"
          </p>
          <div className="mt-6 flex gap-4">
            <Button 
              onClick={() => {
                setRetryCount(prev => prev + 1)
                refetchCategory()
              }}
            >
              Try Again
            </Button>
            <Link href="/" passHref>
              <Button variant="outline" asChild>
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (productsError) {
    return (
      <div className="container py-10">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load products. Please try again later.
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-center mt-4">
          <Button 
            onClick={() => refetchProducts()}
            disabled={isLoadingProducts}
          >
            {isLoadingProducts ? <LoadingSpinner size="sm" className="mr-2" /> : null}
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <CategoryPageTemplate
      category={categoryData}
      products={products}
      isLoading={isLoadingProducts}
      hasMore={!!hasNextPage}
      loadMore={loadMore}
      isFetchingNextPage={isFetchingNextPage}
      totalCount={totalCount}
      onSortChange={handleSortChange}
      currentSort={getParam('sort') || 'date_desc'}
      breadcrumbs={breadcrumbs}
    />
  )
} 