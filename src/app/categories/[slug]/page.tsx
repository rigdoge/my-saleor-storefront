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
  
  // Special handling for Accessories/homewares category
  const isAccessoriesHomewares = params.slug === 'homewares' || params.slug === 'accessories'

  // Get category information
  const { 
    data: categoryData, 
    isLoading: isLoadingCategory,
    error: categoryError,
    refetch: refetchCategory
  } = useQuery({
    queryKey: ['category', params.slug, fallbackToId, categoryId, retryCount, isAccessoriesHomewares],
    queryFn: async () => {
      try {
        // Special handling for Accessories/homewares category
        if (isAccessoriesHomewares) {
          console.log(`Special handling for ${params.slug} category data retrieval`)
          
          // Add additional retry and error handling
          let retries = 0
          const maxRetries = 3
          
          while (retries < maxRetries) {
            try {
              const response = await graphqlRequestClient(CATEGORY_BY_SLUG_QUERY, {
                slug: params.slug,
                channel: currentChannel.slug
              }, true) // Add third parameter to indicate this is a special request
              
              if (response && response.category) {
                setCategoryId(response.category.id)
                
                // Validate subcategory data
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
              
              throw new Error(`Unable to get ${params.slug} category data`)
            } catch (err) {
              retries++
              if (retries >= maxRetries) throw err
              await new Promise(resolve => setTimeout(resolve, 1000 * retries))
            }
          }
        }
        
        // First try to get by slug
        if (!fallbackToId) {
          const response = await graphqlRequestClient(CATEGORY_BY_SLUG_QUERY, {
            slug: params.slug,
            channel: currentChannel.slug
          })
          
          // If category is found, save ID for later use
          if (response.category) {
            setCategoryId(response.category.id)
            return response.category
          }
          
          // If category is not found, try using ID query
          setFallbackToId(true)
          return null
        } 
        
        // If slug query fails, try by ID
        if (categoryId) {
          const response = await graphqlRequestClient(CATEGORY_BY_ID_QUERY, {
            id: categoryId,
            channel: currentChannel.slug
          })
          return response.category
        }
        
        return null
      } catch (err) {
        console.error('Failed to get category information:', err)
        throw err
      }
    },
    retry: isAccessoriesHomewares ? 5 : 2, // Increase retry count for special categories
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff strategy
    staleTime: 5 * 60 * 1000
  })

  // If error is detected, try to fetch data again
  useEffect(() => {
    if (categoryError) {
      console.error('Category data loading error, trying to fetch again:', categoryError)
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [categoryError])

  // Get filtering conditions
  const searchParamsObj = Object.fromEntries(searchParams.entries())
  const { filter, sortBy } = getProductFilters(searchParamsObj)
  if (categoryData?.id) {
    filter.categories = [categoryData.id]
  }

  // Get product list
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
        // Special handling for Accessories/homewares category
        if (isAccessoriesHomewares) {
          console.log(`Special handling for ${params.slug} category product data retrieval`)
          
          // Add additional retry and error handling
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
              }, true) // Add third parameter to indicate this is a special request
              
              if (response && response.products) {
                return response.products
              }
              
              throw new Error(`Unable to get ${params.slug} category product data`)
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
        console.error('Failed to get product list:', err)
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
    staleTime: isAccessoriesHomewares ? 1 * 60 * 1000 : 2 * 60 * 1000, // Special category cache time shorter
    gcTime: 10 * 60 * 1000,
    retry: isAccessoriesHomewares ? 5 : 2 // Increase retry count for special categories
  })

  // Calculate product total and price range
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

  // Safely get subcategories
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
          <h1 className="text-2xl font-bold">Failed to load category information</h1>
          <p className="mt-2 text-muted-foreground">
            Unable to load category information, please try again later
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
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const childCategories = getChildCategories()

  return (
    <div className="container py-10">
      <div className="space-y-6">
        {/* Breadcrumb navigation */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/categories" className="hover:underline">
            All Categories
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

        {/* Category information */}
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

        {/* Subcategory list */}
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
                    {node.products?.totalCount || 0} Products
                  </div>
                </Link>
              ))}
            </div>
            <Separator />
          </>
        )}

        {/* Product filtering */}
        <ProductFilter
          minPrice={priceRange.min === Infinity ? 0 : priceRange.min}
          maxPrice={priceRange.max === -Infinity ? 10000 : priceRange.max}
          totalCount={totalCount}
        />

        {/* Product list */}
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
            <p className="text-lg font-medium text-red-500">Failed to load products</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Error occurred while fetching product data, please try again later
            </p>
            <Button 
              onClick={() => setRetryCount(prev => prev + 1)} 
              variant="outline" 
              className="mt-4"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center">
            <p className="text-lg font-medium">No Products Available</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another category or check back later
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

        {/* Load more */}
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