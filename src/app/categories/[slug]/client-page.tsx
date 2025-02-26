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
import { ChevronRight, RefreshCw, AlertCircle, ArrowUpDown, SlidersHorizontal, X } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { useUrlParams } from '@/lib/hooks/use-url-params'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet"

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
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  // Get category information
  const { 
    data: categoryData, 
    isLoading: isLoadingCategory,
    error: categoryError,
    refetch: refetchCategory
  } = useQuery({
    queryKey: ['category', params.slug, retryCount],
    queryFn: async () => {
      try {
        // Get category by slug
        const response = await graphqlRequestClient(CATEGORY_BY_SLUG_QUERY, {
          slug: params.slug,
          channel: currentChannel.slug
        })
        
        // If category is found, return it
        if (response.category) {
          return response.category
        }
        
        // If not found by slug, try to find by ID (in case the slug is actually an ID)
        try {
          const idResponse = await graphqlRequestClient(CATEGORY_BY_ID_QUERY, {
            id: params.slug,
            channel: currentChannel.slug
          })
          
          if (idResponse.category) {
            return idResponse.category
          }
        } catch (idError) {
          console.error('Failed to get category by ID:', idError)
        }
        
        throw new Error(`Category not found: ${params.slug}`)
      } catch (err) {
        console.error('Failed to get category information:', err)
        throw err
      }
    },
    initialData: initialCategory,
    retry: 2,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff
    staleTime: 5 * 60 * 1000
  })

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
    error: productsError,
    refetch: refetchProducts
  } = useInfiniteQuery({
    queryKey: ['products', currentChannel.slug, filter, sortBy, retryCount],
    queryFn: async ({ pageParam }) => {
      try {
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
    initialData: initialProducts ? {
      pages: [initialProducts],
      pageParams: [null]
    } : undefined,
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (lastPage?.pageInfo?.hasNextPage) {
        return lastPage.pageInfo.endCursor
      }
      return undefined
    },
    enabled: !!categoryData,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2
  })

  // Handle sort change
  const handleSortChange = (value: string) => {
    updateParams({ sort: value, page: '1' })
  }

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
      category: edge.node.category,
      pricing: {
        price: edge.node.pricing?.priceRange?.start?.gross?.amount || 0,
        currency: edge.node.pricing?.priceRange?.start?.gross?.currency || 'CNY',
        discount: edge.node.pricing?.discount?.gross?.amount
          ? {
              amount: edge.node.pricing.discount.gross.amount,
              currency: edge.node.pricing.discount.gross.currency
            }
          : undefined
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
    if (!categoryData?.children?.edges) {
      return []
    }
    return categoryData.children.edges
      .filter((edge: any) => edge?.node?.id)
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
            The category "{params.slug}" could not be found
          </p>
          <div className="mt-6 flex gap-4">
            <Button 
              onClick={() => {
                setRetryCount(prev => prev + 1)
                refetchCategory()
              }} 
              variant="outline"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button asChild>
              <Link href="/categories">
                Browse All Categories
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const childCategories = getChildCategories()
  const currentSort = getParam('sort') || 'popular'

  return (
    <div className="container py-10">
      <div className="space-y-6">
        {/* Breadcrumb navigation */}
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href="/categories" className="hover:underline">
            All Categories
          </Link>
          {categoryData.ancestors?.edges?.map(({ node }: { node: any }) => (
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
          <span className="text-foreground font-medium">{categoryData.name}</span>
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
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute inset-0 flex items-end p-6">
            <div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                {categoryData.name}
              </h1>
              {categoryData.description && (
                <p className="mt-2 max-w-2xl text-white/90 text-lg">
                  {categoryData.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Subcategory list */}
        {childCategories.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Subcategories</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {childCategories.map((node: any) => (
                <Link
                  key={node.id}
                  href={`/categories/${node.slug}`}
                  className="group block space-y-2 rounded-lg border p-4 transition-colors hover:bg-muted"
                >
                  <div className="text-lg font-medium group-hover:text-primary">{node.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {node.products?.totalCount || 0} Products
                  </div>
                </Link>
              ))}
            </div>
            <Separator className="my-2" />
          </div>
        )}

        {/* Mobile filter and sort controls */}
        <div className="flex items-center justify-between md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your product search
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <ProductFilter
                  minPrice={priceRange.min === Infinity ? 0 : priceRange.min}
                  maxPrice={priceRange.max === -Infinity ? 10000 : priceRange.max}
                  totalCount={totalCount}
                />
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button className="w-full">Apply Filters</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Select value={currentSort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Popularity</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Product filtering - sidebar (desktop only) */}
          <div className="hidden md:col-span-1 md:block">
            <ProductFilter
              minPrice={priceRange.min === Infinity ? 0 : priceRange.min}
              maxPrice={priceRange.max === -Infinity ? 10000 : priceRange.max}
              totalCount={totalCount}
            />
          </div>

          {/* Product list */}
          <div className="md:col-span-3">
            {/* Sort options (desktop only) */}
            <div className="mb-6 hidden items-center justify-between md:flex">
              <h2 className="text-xl font-semibold">Products</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={currentSort} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Popularity</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoadingProducts ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
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
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-xl font-medium">Failed to Load Products</h2>
                <p className="mt-2 text-muted-foreground">
                  We encountered an error while loading products. Please try again.
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
              <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                <h2 className="text-xl font-medium">No Products Available</h2>
                <p className="mt-2 text-muted-foreground">
                  There are no products in this category at the moment.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your filters or check back later.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>

                {/* Load more */}
                {products.length > 0 && !productsError && (
                  <LoadMore
                    onLoadMore={() => fetchNextPage()}
                    isLoading={isFetchingNextPage}
                    hasMore={hasNextPage || false}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 