'use client'

import { useQuery } from "@tanstack/react-query"
import { PRODUCT_BY_SLUG_QUERY } from "@/lib/graphql/queries/products"
import { graphqlRequestClient } from "@/lib/graphql/client"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Heart } from "lucide-react"
import Link from "next/link"

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', params.slug],
    queryFn: async () => {
      const response = await graphqlRequestClient(PRODUCT_BY_SLUG_QUERY, {
        slug: params.slug,
        channel: 'default-channel'
      })
      
      if (!response.product) {
        return null
      }

      return {
        id: response.product.id,
        name: response.product.name,
        description: response.product.description,
        price: response.product.pricing.priceRange.start.gross.amount,
        currency: response.product.pricing.priceRange.start.gross.currency,
        thumbnail: {
          url: response.product.thumbnail?.url || "/images/placeholder.jpg",
          alt: response.product.thumbnail?.alt || response.product.name,
        },
        isAvailable: response.product.isAvailable,
        variants: response.product.variants?.map((variant: any) => ({
          id: variant.id,
          name: variant.name,
          quantityAvailable: variant.quantityAvailable,
          price: variant.pricing?.price?.gross?.amount,
          currency: variant.pricing?.price?.gross?.currency,
        })) || []
      }
    }
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">正在加载商品信息...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">商品未找到</h1>
          <p className="mt-4 text-muted-foreground">该商品可能已下架或不存在</p>
          <Button asChild className="mt-8">
            <Link href="/">返回首页</Link>
          </Button>
        </div>
      </div>
    )
  }

  const isOutOfStock = product.variants.every(v => v.quantityAvailable === 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* 商品图片 */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.thumbnail.url}
            alt={product.thumbnail.alt || product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* 商品信息 */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="mt-4 text-2xl font-bold text-primary">
            {formatPrice(product.price, { currency: product.currency })}
          </div>
          
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium">商品描述</h3>
              <p className="mt-2 text-muted-foreground">{product.description}</p>
            </div>

            {product.variants.length > 0 && (
              <div>
                <h3 className="text-lg font-medium">商品规格</h3>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {product.variants.map((variant) => (
                    <Button
                      key={variant.id}
                      variant="outline"
                      className="justify-between"
                      disabled={variant.quantityAvailable === 0}
                    >
                      <span>{variant.name}</span>
                      <span className="ml-2 text-muted-foreground">
                        {variant.price ? formatPrice(variant.price, {
                          currency: variant.currency
                        }) : '暂无价格'}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-4">
            <Button 
              size="lg" 
              className="flex-1"
              disabled={isOutOfStock}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              {isOutOfStock ? '暂时缺货' : '加入购物车'}
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 