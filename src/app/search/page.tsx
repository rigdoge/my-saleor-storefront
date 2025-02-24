'use client'

import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useChannel } from '@/components/providers/channel-provider'
import { SEARCH_PRODUCTS_QUERY } from '@/lib/graphql/queries/search'
import { graphqlRequestClient } from '@/lib/graphql/client'
import { ProductCard } from '@/components/product/product-card'
import { Skeleton } from '@/components/ui/skeleton'

function ProductCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-square rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    </div>
  )
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const { currentChannel } = useChannel()
  const searchQuery = searchParams.get('q') || ''

  const { data: searchData, isLoading } = useQuery({
    queryKey: ['searchProducts', searchQuery, currentChannel.slug],
    queryFn: async () => {
      const response = await graphqlRequestClient(SEARCH_PRODUCTS_QUERY, {
        search: searchQuery,
        channel: currentChannel.slug,
        first: 24
      })
      
      return response.products.edges.map((edge: any) => ({
        id: edge.node.id,
        name: edge.node.name,
        description: edge.node.description,
        slug: edge.node.slug,
        price: edge.node.pricing.priceRange.start.gross.amount,
        currency: edge.node.pricing.priceRange.start.gross.currency,
        thumbnail: {
          url: edge.node.thumbnail?.url || "/images/placeholder.jpg",
          alt: edge.node.thumbnail?.alt || edge.node.name,
        },
        category: edge.node.category,
        isAvailable: edge.node.isAvailable,
        variants: edge.node.variants
      }))
    },
    enabled: searchQuery.length > 0,
  })

  return (
    <div className="container py-10">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">搜索结果</h2>
          <p className="text-muted-foreground">
            {searchQuery ? `"${searchQuery}" 的搜索结果` : '请输入搜索关键词'}
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        ) : !searchData || searchData.length === 0 ? (
          <div className="text-center">
            <p className="text-lg text-muted-foreground">
              未找到相关商品
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {searchData.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 