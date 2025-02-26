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

// Product data type definition
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

// Parse product description
function parseDescription(description: string | null): string {
  if (!description) return ''
  try {
    const data = JSON.parse(description)
    if (data.blocks) {
      return data.blocks
        .map((block: any) => {
          if (block.type === 'paragraph') {
            // Remove HTML tags, keep only text
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

// Optimize loading placeholder component, use memo to avoid unnecessary re-renders
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

// Add static fallback product data
const FALLBACK_PRODUCTS = [
  {
    id: 'fallback-1',
    name: 'Featured Product 1',
    description: 'This is a fallback product display shown when the API cannot connect',
    slug: 'fallback-1',
    price: 99.99,
    currency: 'CNY',
    thumbnail: {
      url: "/images/placeholder.jpg",
      alt: "Fallback product image",
    },
    category: { name: 'Fallback Category' },
    isAvailable: true,
    variants: [{ id: 'fallback-variant-1', name: 'Default Style', quantityAvailable: 10 }]
  },
  {
    id: 'fallback-2',
    name: 'Featured Product 2',
    description: 'This is a fallback product display shown when the API cannot connect',
    slug: 'fallback-2',
    price: 129.99,
    currency: 'CNY',
    thumbnail: {
      url: "/images/placeholder.jpg",
      alt: "Fallback product image",
    },
    category: { name: 'Fallback Category' },
    isAvailable: true,
    variants: [{ id: 'fallback-variant-2', name: 'Default Style', quantityAvailable: 10 }]
  },
  {
    id: 'fallback-3',
    name: 'Featured Product 3',
    description: 'This is a fallback product display shown when the API cannot connect',
    slug: 'fallback-3',
    price: 159.99,
    currency: 'CNY',
    thumbnail: {
      url: "/images/placeholder.jpg",
      alt: "Fallback product image",
    },
    category: { name: 'Fallback Category' },
    isAvailable: true,
    variants: [{ id: 'fallback-variant-3', name: 'Default Style', quantityAvailable: 10 }]
  },
  {
    id: 'fallback-4',
    name: 'Featured Product 4',
    description: 'This is a fallback product display shown when the API cannot connect',
    slug: 'fallback-4',
    price: 199.99,
    currency: 'CNY',
    thumbnail: {
      url: "/images/placeholder.jpg",
      alt: "Fallback product image",
    },
    category: { name: 'Fallback Category' },
    isAvailable: true,
    variants: [{ id: 'fallback-variant-4', name: 'Default Style', quantityAvailable: 10 }]
  }
]

// Use memo to optimize FeaturedProducts component
export const FeaturedProducts = memo(function FeaturedProducts() {
  const { currentChannel } = useChannel()
  
  // Use auto-generated hook to get product list
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
  
  // Use auto-generated hook to get promoted products
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

  // Convert product data to the format needed by the component
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

  // Convert promoted product data
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
          <p className="text-lg text-red-500">Failed to fetch product data</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Please try again later or contact customer service'}
          </p>
          <div className="mt-2 text-xs text-muted-foreground">
            <details>
              <summary>Error details</summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-left overflow-auto max-h-[200px] max-w-[500px]">
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
          </div>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <section className="bg-gray-50 py-12 dark:bg-gray-900/50 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Products</h2>
          <div className="mt-4">
            <div className="mt-2 text-sm text-muted-foreground">
              <p>Current site: {currentChannel.name}</p>
            </div>
          </div>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover our carefully selected popular products and enjoy quality living
          </p>
        </div>
        
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoadingProducts ? (
            // Use Fragment to reduce unnecessary DOM nodes
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          ) : !products || products.length === 0 ? (
            <div className="col-span-full text-center text-lg text-muted-foreground">
              No products available
            </div>
          ) : (
            // Use Fragment to reduce unnecessary DOM nodes
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
          <h3 className="text-2xl font-bold tracking-tight text-center mb-8">Popular Recommendations</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {isLoadingPromoted ? (
              // Use Fragment to reduce unnecessary DOM nodes
              <>
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </>
            ) : !promotedProducts || promotedProducts.length === 0 ? (
              <div className="col-span-full text-center text-lg text-muted-foreground">
                No recommended products available
              </div>
            ) : (
              // Use Fragment to reduce unnecessary DOM nodes
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