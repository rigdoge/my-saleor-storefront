'use client'

import { ProductCard } from "@/components/product/product-card"
import { useQuery } from "@tanstack/react-query"
import { PRODUCTS_QUERY } from "@/lib/graphql/queries/products"
import { graphqlRequestClient } from "@/lib/graphql/client"
import { Skeleton } from "@/components/ui/skeleton"

const DEFAULT_CHANNEL = 'default-channel'

// 产品数据类型定义
interface Product {
  id: string
  name: string
  description: string | null
  slug: string
  thumbnail: {
    url: string
    alt: string | null
  }
  media: Array<{
    url: string
    alt: string | null
    type: string
  }>
  pricing: {
    priceRange: {
      start: {
        gross: {
          amount: number
          currency: string
        }
      }
    }
  }
  category: {
    id: string
    name: string
    slug: string
  } | null
  collections: Array<{
    name: string
  }>
  isAvailable: boolean
  variants: Array<{
    id: string
    name: string
    quantityAvailable: number
  }>
}

// 解析商品描述
function parseDescription(description: string | null): string {
  if (!description) return ''
  try {
    const data = JSON.parse(description)
    if (data.blocks) {
      return data.blocks
        .map((block: any) => {
          if (block.type === 'paragraph') {
            // 移除HTML标签,只保留文本
            return block.data.text.replace(/<[^>]+>/g, '')
          }
          return ''
        })
        .join(' ')
        .trim()
    }
    return description
  } catch (error) {
    return description || ''
  }
}

// 加载占位组件
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

export function FeaturedProducts() {
  // 获取产品列表
  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['featuredProducts', DEFAULT_CHANNEL],
    queryFn: async () => {
      const response = await graphqlRequestClient(PRODUCTS_QUERY, {
        first: 4,
        channel: DEFAULT_CHANNEL
      })
      
      return response.products.edges.map((edge: { node: Product }) => ({
        id: edge.node.id,
        name: edge.node.name,
        description: parseDescription(edge.node.description),
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
    staleTime: 1000 * 60 * 5, // 5分钟内数据不会重新获取
    cacheTime: 1000 * 60 * 30, // 缓存30分钟
  })

  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-900/50 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">精选商品</h2>
          <div className="mt-4">
            <div className="mt-2 text-sm text-muted-foreground">
              <p>当前站点: Default Channel</p>
            </div>
          </div>
          <p className="mt-4 text-lg text-muted-foreground">
            发现我们精心挑选的热门商品，享受优质生活
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoadingProducts ? (
            // 加载占位
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          ) : !productsData || productsData.length === 0 ? (
            <div className="col-span-full text-center text-lg text-muted-foreground">
              暂无商品
            </div>
          ) : (
            productsData.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
              />
            ))
          )}
        </div>
      </div>
    </section>
  )
} 