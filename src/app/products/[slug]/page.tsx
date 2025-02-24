'use client'

import { useQuery } from "@tanstack/react-query"
import { PRODUCT_BY_SLUG_QUERY } from "@/lib/graphql/queries/products"
import { graphqlRequestClient } from "@/lib/graphql/client"
import { useCart } from "@/components/providers/cart-provider"
import { Button } from "@/components/ui/button"
import { Heart, Share2 } from "lucide-react"
import Link from "next/link"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductVariants } from "@/components/product/product-variants"
import { ProductDetails } from "@/components/product/product-details"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { addItem } = useCart()
  const [selectedVariant, setSelectedVariant] = useState<any>(null)

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

      return response.product
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

  const handleAddToCart = () => {
    if (!selectedVariant) return

    addItem({
      id: crypto.randomUUID(),
      variantId: selectedVariant.id,
      name: product.name,
      slug: product.slug,
      quantity: 1,
      price: selectedVariant.pricing.price.gross.amount,
      currency: selectedVariant.pricing.price.gross.currency,
      thumbnail: product.thumbnail,
      variant: {
        id: selectedVariant.id,
        name: selectedVariant.name,
        quantityAvailable: selectedVariant.quantityAvailable
      }
    })
  }

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* 商品图片 */}
        <ProductGallery media={product.media} />

        {/* 商品信息 */}
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Heart className="h-5 w-5" />
                <span className="sr-only">收藏</span>
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-5 w-5" />
                <span className="sr-only">分享</span>
              </Button>
            </div>
          </div>

          <Separator className="my-4" />
          
          {/* 商品规格 */}
          <ProductVariants
            variants={product.variants}
            selectedVariant={selectedVariant}
            onVariantSelect={setSelectedVariant}
          />

          {/* 加入购物车 */}
          <div className="mt-8">
            <Button
              size="lg"
              className="w-full"
              disabled={!selectedVariant || selectedVariant.quantityAvailable === 0}
              onClick={handleAddToCart}
            >
              {!selectedVariant
                ? '请选择规格'
                : selectedVariant.quantityAvailable === 0
                ? '暂时缺货'
                : '加入购物车'}
            </Button>
          </div>
        </div>
      </div>

      {/* 商品详情 */}
      <ProductDetails
        details={{
          description: product.description,
          attributes: product.attributes,
          metadata: product.metadata,
          category: product.category
        }}
      />
    </div>
  )
} 