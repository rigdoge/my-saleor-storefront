'use client'

import { memo, useMemo } from 'react'
import { ProductCard } from "@/components/product/product-card"
import { useQuery } from "@tanstack/react-query"
import { PRODUCTS_QUERY } from "@/lib/graphql/queries/products"
import { graphqlRequestClient } from "@/lib/graphql/client"
import { Skeleton } from "@/components/ui/skeleton"
import { useChannel } from "@/components/providers/channel-provider"
import { useProductsQuery, ProductsDocument, ProductOrderField, OrderDirection } from '@/lib/graphql/__generated__/types'
import { autoGraphqlClient } from '@/lib/graphql/client-auto'

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

// 优化加载占位组件，使用 memo 避免不必要的重渲染
const ProductCardSkeleton = memo(function ProductCardSkeleton() {
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
})

// 添加静态备选商品数据
const FALLBACK_PRODUCTS = [
  {
    id: 'fallback-1',
    name: '精选商品 1',
    description: '这是一个备用商品展示，当 API 无法连接时显示',
    slug: 'fallback-1',
    price: 99.99,
    currency: 'CNY',
    thumbnail: {
      url: "/images/placeholder.jpg",
      alt: "备用商品图片",
    },
    category: { name: '备用分类' },
    isAvailable: true,
    variants: [{ id: 'fallback-variant-1', name: '默认款式', quantityAvailable: 10 }]
  },
  {
    id: 'fallback-2',
    name: '精选商品 2',
    description: '这是一个备用商品展示，当 API 无法连接时显示',
    slug: 'fallback-2',
    price: 129.99,
    currency: 'CNY',
    thumbnail: {
      url: "/images/placeholder.jpg",
      alt: "备用商品图片",
    },
    category: { name: '备用分类' },
    isAvailable: true,
    variants: [{ id: 'fallback-variant-2', name: '默认款式', quantityAvailable: 10 }]
  },
  {
    id: 'fallback-3',
    name: '精选商品 3',
    description: '这是一个备用商品展示，当 API 无法连接时显示',
    slug: 'fallback-3',
    price: 159.99,
    currency: 'CNY',
    thumbnail: {
      url: "/images/placeholder.jpg",
      alt: "备用商品图片",
    },
    category: { name: '备用分类' },
    isAvailable: true,
    variants: [{ id: 'fallback-variant-3', name: '默认款式', quantityAvailable: 10 }]
  },
  {
    id: 'fallback-4',
    name: '精选商品 4',
    description: '这是一个备用商品展示，当 API 无法连接时显示',
    slug: 'fallback-4',
    price: 199.99,
    currency: 'CNY',
    thumbnail: {
      url: "/images/placeholder.jpg",
      alt: "备用商品图片",
    },
    category: { name: '备用分类' },
    isAvailable: true,
    variants: [{ id: 'fallback-variant-4', name: '默认款式', quantityAvailable: 10 }]
  }
]

// 使用 memo 优化 FeaturedProducts 组件
export const FeaturedProducts = memo(function FeaturedProducts() {
  const { currentChannel } = useChannel()
  
  // 使用自动生成的hook获取产品列表
  const { data: productsData, isLoading: isLoadingProducts, error, refetch } = useProductsQuery({
    first: 4,
    channel: currentChannel.slug,
    filter: {
      isAvailable: true
    },
    sortBy: {
      field: ProductOrderField.Date,
      direction: OrderDirection.Desc
    }
  })
  
  // 使用自动生成的hook获取促销产品
  const { data: promotedProductsData, isLoading: isLoadingPromoted } = useProductsQuery({
    first: 4,
    channel: currentChannel.slug,
    filter: {
      isAvailable: true
    },
    sortBy: {
      field: ProductOrderField.Collection,
      direction: OrderDirection.Desc
    }
  })

  // 转换产品数据为组件需要的格式
  const products = useMemo(() => {
    if (!productsData?.products?.edges) return []
    
    return productsData.products.edges.map((edge: any) => ({
      id: edge.node.id,
      name: edge.node.name,
      description: parseDescription(edge.node.description),
      slug: edge.node.slug,
      price: edge.node.pricing?.priceRange?.start?.gross?.amount,
      currency: edge.node.pricing?.priceRange?.start?.gross?.currency,
      thumbnail: {
        url: edge.node.thumbnail?.url || "/images/placeholder.jpg",
        alt: edge.node.thumbnail?.alt || edge.node.name,
      },
      category: edge.node.category,
      isAvailable: edge.node.isAvailable,
      variants: edge.node.variants?.map((variant: any) => ({
        id: variant.id,
        name: variant.name,
        quantityAvailable: variant.quantityAvailable
      })) || []
    }))
  }, [productsData])

  // 转换促销产品数据
  const promotedProducts = useMemo(() => {
    if (!promotedProductsData?.products?.edges) return []
    
    return promotedProductsData.products.edges.map((edge: any) => ({
      id: edge.node.id,
      name: edge.node.name,
      description: parseDescription(edge.node.description),
      slug: edge.node.slug,
      price: edge.node.pricing?.priceRange?.start?.gross?.amount,
      currency: edge.node.pricing?.priceRange?.start?.gross?.currency,
      thumbnail: {
        url: edge.node.thumbnail?.url || "/images/placeholder.jpg",
        alt: edge.node.thumbnail?.alt || edge.node.name,
      },
      category: edge.node.category,
      isAvailable: edge.node.isAvailable,
      variants: edge.node.variants?.map((variant: any) => ({
        id: variant.id,
        name: variant.name,
        quantityAvailable: variant.quantityAvailable
      })) || []
    }))
  }, [promotedProductsData])

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-500">获取商品数据失败</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error ? error.message : '请稍后重试或联系客服'}
          </p>
          <div className="mt-2 text-xs text-muted-foreground">
            <details>
              <summary>错误详情</summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-left overflow-auto max-h-[200px] max-w-[500px]">
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
          </div>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  return (
    <section className="bg-gray-50 py-12 dark:bg-gray-900/50 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">精选商品</h2>
          <div className="mt-4">
            <div className="mt-2 text-sm text-muted-foreground">
              <p>当前站点: {currentChannel.name}</p>
            </div>
          </div>
          <p className="mt-4 text-lg text-muted-foreground">
            发现我们精心挑选的热门商品，享受优质生活
          </p>
        </div>
        
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoadingProducts ? (
            // 使用 Fragment 减少不必要的 DOM 节点
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          ) : !products || products.length === 0 ? (
            <div className="col-span-full text-center text-lg text-muted-foreground">
              暂无商品
            </div>
          ) : (
            // 使用 Fragment 减少不必要的 DOM 节点
            <>
              {products.map((product: any) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                />
              ))}
            </>
          )}
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-bold tracking-tight text-center mb-8">热门推荐</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {isLoadingPromoted ? (
              // 使用 Fragment 减少不必要的 DOM 节点
              <>
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </>
            ) : !promotedProducts || promotedProducts.length === 0 ? (
              <div className="col-span-full text-center text-lg text-muted-foreground">
                暂无推荐商品
              </div>
            ) : (
              // 使用 Fragment 减少不必要的 DOM 节点
              <>
                {promotedProducts.map((product: any) => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}) 