'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { PRODUCT_BY_SLUG_QUERY } from "@/lib/graphql/queries/products"
import { ADD_TO_FAVORITES_MUTATION, REMOVE_FROM_FAVORITES_MUTATION } from "@/lib/graphql/queries/favorites"
import { graphqlRequestClient } from "@/lib/graphql/client"
import { useCart } from "@/components/providers/cart-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Plus, Minus } from "lucide-react"
import Link from "next/link"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductVariants } from "@/components/product/product-variants"
import { ProductDetails } from "@/components/product/product-details"
import { ProductSkeleton } from "@/components/product/product-skeleton"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useFavorites } from "@/components/providers/favorites-provider"

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { addItem } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()

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

  // 如果商品只有一个规格，自动选择该规格
  useEffect(() => {
    if (product?.variants && product.variants.length === 1) {
      setSelectedVariant(product.variants[0])
    }
  }, [product])

  if (isLoading) {
    return <ProductSkeleton />
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

  const handleFavoriteClick = () => {
    if (!product) return

    if (isFavorite(product.id)) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites({
        id: product.id,
        name: product.name,
        slug: product.slug,
        thumbnail: product.thumbnail,
      })
    }
  }

  const handleAddToCart = () => {
    // 如果商品没有规格选项，使用默认价格
    const variant = selectedVariant || (product.variants.length === 1 ? product.variants[0] : null)
    if (!variant && product.variants.length > 1) return

    const price = variant ? variant.pricing.price.gross.amount : product.pricing.priceRange.start.gross.amount
    const currency = variant ? variant.pricing.price.gross.currency : product.pricing.priceRange.start.gross.currency

    addItem({
      id: crypto.randomUUID(),
      variantId: variant?.id || product.id,
      name: product.name,
      slug: product.slug,
      quantity,
      price,
      currency,
      thumbnail: product.thumbnail,
      variant: variant ? {
        id: variant.id,
        name: variant.name,
        quantityAvailable: variant.quantityAvailable
      } : undefined
    })

    toast({
      description: "已添加到购物车",
    })
  }

  const hasVariants = product.variants.length > 1
  const isOutOfStock = !product.isAvailable || product.variants.every(v => v.quantityAvailable === 0)
  
  const maxQuantity = selectedVariant?.quantityAvailable || 99
  
  const handleDecreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1))
  }

  const handleIncreaseQuantity = () => {
    setQuantity(prev => Math.min(maxQuantity, prev + 1))
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
              <Button 
                variant="outline"
                size="icon"
                className="w-10 shrink-0 px-0"
                onClick={handleFavoriteClick}
              >
                <Heart className={cn(
                  "h-4 w-4",
                  isFavorite(product?.id || "") && "fill-current"
                )} />
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
          {hasVariants && (
            <ProductVariants
              variants={product.variants}
              selectedVariant={selectedVariant}
              onVariantSelect={setSelectedVariant}
            />
          )}

          {/* 加入购物车 */}
          <div className="mt-8 flex gap-4">
            <div className="flex items-center rounded-md border">
              <Button
                variant="ghost"
                size="icon"
                className="h-11 rounded-none rounded-l-md"
                onClick={handleDecreaseQuantity}
                disabled={isOutOfStock || (hasVariants && !selectedVariant)}
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">减少数量</span>
              </Button>
              <div className="flex h-11 w-14 items-center justify-center text-center">
                {quantity}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 rounded-none rounded-r-md"
                onClick={handleIncreaseQuantity}
                disabled={isOutOfStock || (hasVariants && !selectedVariant) || quantity >= maxQuantity}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">增加数量</span>
              </Button>
            </div>
            <Button
              size="lg"
              className="flex-1"
              disabled={isOutOfStock || (hasVariants && !selectedVariant)}
              onClick={handleAddToCart}
            >
              {isOutOfStock
                ? '暂时缺货'
                : hasVariants && !selectedVariant
                ? '请选择规格'
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