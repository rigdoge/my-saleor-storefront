"use client"

import React, { useState, useCallback, memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, ShoppingBag, Star, Eye, ShoppingCart } from 'lucide-react'
import { useProductActions } from '@/lib/hooks/use-product-actions'
import { PriceDisplay } from '@/components/shared/price-display'
import { ProductPreview } from './product-preview'
import { Product } from '@/lib/types'
import { useCart } from '@/components/providers/cart-provider'
import { useFavorites } from '@/components/providers/favorites-provider'
import { toast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact'
  className?: string
}

function ProductCardComponent({
  product,
  variant = 'default',
  className,
}: ProductCardProps) {
  const { addItem } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  const {
    isAddingToCart,
    finalPrice,
    hasDiscount,
    handleAddToCart,
  } = useProductActions(product)

  // 检查商品是否在收藏中
  const favorited = isFavorite(product.id)

  // 处理添加到购物车
  const handleAddToCartWithToast = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const success = addItem({
      id: product.id,
      variantId: product.id, // 如果没有变体，使用产品ID
      name: product.name,
      slug: product.slug || '',
      price: product.price,
      currency: product.currency || 'CNY',
      thumbnail: product.thumbnail ? {
        url: product.thumbnail.url,
        alt: product.thumbnail.alt || ''
      } : undefined,
      quantity: 1,
      stock: product.isAvailable ? undefined : 0, // 如果商品不可用，设置库存为0
    })

    if (success) {
      toast({
        title: '已添加到购物车',
        description: product.name,
      })
    }
  }

  // 处理收藏切换
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (favorited) {
      removeFromFavorites(product.id)
      toast({
        title: '已从收藏中移除',
        description: product.name,
      })
    } else {
      addToFavorites({
        id: product.id,
        name: product.name,
        slug: product.slug || '',
        thumbnail: product.thumbnail ? {
          url: product.thumbnail.url,
          alt: product.thumbnail.alt || ''
        } : undefined,
      })
      toast({
        title: '已添加到收藏',
        description: product.name,
      })
    }
  }

  return (
    <div className={cn("group relative", className)}>
      <Link href={`/products/${product.slug}`} className="relative block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
          {/* 图片骨架屏 */}
          {isImageLoading && (
            <Skeleton className="absolute inset-0 z-10" />
          )}
          
          {/* 商品图片 */}
          {product.thumbnail?.url ? (
            <Image
              src={product.thumbnail.url}
              alt={product.thumbnail.alt || product.name}
              fill
              className={cn(
                "object-cover transition-transform duration-300",
                isHovered && "scale-105",
                isImageLoading ? "opacity-0" : "opacity-100"
              )}
              onLoad={() => setIsImageLoading(false)}
              loading="lazy"
              priority={false}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-muted-foreground">无图片</span>
            </div>
          )}
          
          {/* 收藏按钮 */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={handleFavoriteToggle}
          >
            <Heart 
              className={cn(
                "h-5 w-5 transition-colors", 
                favorited ? "fill-red-500 text-red-500" : "text-muted-foreground"
              )} 
            />
          </Button>
          
          {/* 商品标签 */}
          {!product.isAvailable && (
            <Badge 
              variant="destructive" 
              className="absolute left-2 top-2 z-10"
            >
              缺货
            </Badge>
          )}
          
          {product.pricing?.discount && (
            <Badge 
              className="absolute left-2 top-2 z-10 bg-green-500 hover:bg-green-600"
            >
              特价
            </Badge>
          )}
          
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsPreviewOpen(true)
              }}
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">快速预览</span>
            </Button>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <Link
              href={`/products/${product.slug}`}
              className="line-clamp-2 text-sm font-medium hover:underline"
            >
              {product.name}
            </Link>
            {product.category && (
              <Link
                href={`/categories/${product.category.slug}`}
                className="text-sm text-muted-foreground hover:underline"
              >
                {product.category.name}
              </Link>
            )}
            {product.rating && (
              <div className="flex items-center gap-1">
                <div className="flex items-center text-yellow-400">
                  {[0, 1, 2, 3, 4].map((i) => {
                    const ratingValue = typeof product.rating === 'number' 
                      ? product.rating 
                      : (product.rating as any).average || 0;
                    
                    return (
                      <Star
                        key={i}
                        className={cn(
                          "h-3 w-3",
                          i < Math.floor(ratingValue) ? "fill-current" : "fill-none"
                        )}
                      />
                    );
                  })}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({typeof product.rating === 'number' ? '5' : (product.rating as any).count})
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <PriceDisplay
              price={product.price}
              currency={product.currency}
              discount={product.pricing?.discount}
              size="sm"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            className="flex-1"
            size="sm"
            disabled={!product.isAvailable || isAddingToCart}
            onClick={handleAddToCartWithToast}
          >
            {isAddingToCart ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center"
              >
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span className="ml-2">添加中...</span>
              </motion.div>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                加入购物车
              </>
            )}
          </Button>
        </div>
      </div>
      <ProductPreview
        product={product}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />
    </div>
  )
}

export const ProductCard = memo(ProductCardComponent)