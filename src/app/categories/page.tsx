'use client'

import { useQuery } from '@tanstack/react-query'
import { useChannel } from '@/components/providers/channel-provider'
import { CATEGORIES_QUERY } from '@/lib/graphql/queries/categories'
import { graphqlRequestClient } from '@/lib/graphql/client'
import type { Category } from '@/lib/types/category'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronRight, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'

function CategorySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-48 w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  )
}

export default function CategoriesPage() {
  const { currentChannel } = useChannel()

  const { data: categoriesData, isLoading, error, refetch } = useQuery({
    queryKey: ['categories', currentChannel.slug],
    queryFn: async () => {
      try {
        const response = await graphqlRequestClient(CATEGORIES_QUERY, {
          first: 100,
          channel: currentChannel.slug
        })
        
        // Validate returned data structure
        if (!response || !response.categories || !response.categories.edges) {
          console.error('Invalid categories data structure:', response)
          return []
        }
        
        // Process and validate each category data
        return response.categories.edges.map((edge: any) => {
          if (!edge || !edge.node) {
            console.warn('Invalid category edge:', edge)
            return null
          }
          
          const category = edge.node
          
          // Ensure subcategory data structure is correct
          if (category.children && category.children.edges) {
            category.children.edges = category.children.edges.filter((childEdge: any) => 
              childEdge && childEdge.node && childEdge.node.id
            )
          }
          
          return category
        }).filter(Boolean) // Filter out invalid categories
      } catch (err) {
        console.error('Failed to get category data:', err)
        throw err
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000 // 5 minutes cache
  })

  // If error is detected, try to fetch data again
  useEffect(() => {
    if (error) {
      console.error('Category data loading error, trying to fetch again:', error)
      const timer = setTimeout(() => {
        refetch()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, refetch])

  // Filter out top-level categories and ensure data is valid
  const topLevelCategories = categoriesData?.filter((category: Category) => {
    // Ensure category exists
    if (!category) return false
    // Check if it's a top-level category (no parent category)
    return !category.parent || !category.parent.id
  }) || []

  // Safely access subcategories
  const getChildCategories = (category: Category) => {
    if (!category || !category.children || !category.children.edges) {
      return []
    }
    return category.children.edges
      .filter((edge: any) => edge && edge.node)
      .map((edge: any) => edge.node)
  }

  return (
    <div className="container py-10">
      <div className="space-y-8">
        {isLoading ? (
          <div className="grid gap-6 grid-cols-1">
            <CategorySkeleton />
            <CategorySkeleton />
            <CategorySkeleton />
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-lg text-red-500">Error loading category data</p>
            <Button 
              onClick={() => refetch()} 
              variant="outline" 
              className="mt-4"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        ) : !categoriesData || categoriesData.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center">
            <p className="text-lg font-medium">No Categories Available</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Please check back later
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {topLevelCategories.map((category: Category) => (
              <div key={category.id} className="w-full">
                <Link
                  href={`/categories/${category.slug}`}
                  className="group relative block w-full overflow-hidden rounded-xl border bg-card transition-colors hover:bg-accent"
                >
                  <div className="relative aspect-[3/1] w-full">
                    <Image
                      src={category.backgroundImage?.url || '/images/placeholder.jpg'}
                      alt={category.backgroundImage?.alt || category.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="100vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h2 className="text-2xl font-semibold text-white">
                      {category.name}
                    </h2>
                    {category.description && (
                      <p className="mt-2 text-lg text-white/80">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <div className="absolute right-6 top-6">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="pointer-events-none bg-white/10 text-white backdrop-blur-sm"
                    >
                      {category.products?.totalCount || 0} Products
                    </Button>
                  </div>
                </Link>

                {getChildCategories(category).length > 0 ? (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold tracking-tight">
                        {category.name}
                      </h2>
                      <Button variant="ghost" asChild>
                        <Link href={`/categories/${category.slug}`}>
                          View All
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {getChildCategories(category).map((child: any) => (
                        <Link
                          key={child.id}
                          href={`/categories/${child.slug}`}
                          className="group rounded-lg border p-4 transition-colors hover:bg-accent"
                        >
                          <h3 className="font-medium group-hover:underline">
                            {child.name}
                          </h3>
                          {child.description && (
                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                              {child.description}
                            </p>
                          )}
                          <p className="mt-2 text-sm text-muted-foreground">
                            {child.products?.totalCount || 0} Products
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 