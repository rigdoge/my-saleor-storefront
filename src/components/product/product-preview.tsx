'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Star } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useProductActions } from '@/lib/hooks/use-product-actions'
import { PriceDisplay } from '@/components/shared/price-display'
import { Product } from '@/lib/types'

interface ProductPreviewProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductPreview({ product, open, onOpenChange }: ProductPreviewProps) {
  const {
    isAddingToCart,
    isProductFavorite,
    handleAddToCart,
    handleFavoriteToggle
  } = useProductActions(product)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative aspect-square">
            <Image
              src={product.thumbnail?.url || '/images/placeholder.jpg'}
              alt={product.thumbnail?.alt || product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col justify-between p-4">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold">{product.name}</h2>
                {product.rating && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const ratingValue = typeof product.rating === 'number' 
                          ? product.rating 
                          : (product.rating as any).average || 0;
                        
                        return (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < Math.floor(ratingValue) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            )}
                          />
                        );
                      })}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviewCount} 条评价)
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <PriceDisplay
                  price={product.price}
                  currency={product.currency}
                  discount={product.pricing?.discount}
                  size="lg"
                  showDiscountBadge={true}
                />
                {!product.isAvailable && (
                  <span className="text-sm text-red-500">暂时缺货</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{product.description}</p>
              {product.attributes && (
                <div className="space-y-2">
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-sm font-medium capitalize">{key}:</span>
                      <span className="text-sm text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-4">
              <Button
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!product.isAvailable || isAddingToCart}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                {isAddingToCart ? '添加中...' : '加入购物车'}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleFavoriteToggle}
              >
                <motion.div
                  animate={{ scale: isProductFavorite ? 1.2 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Heart
                    className={cn(
                      "h-4 w-4",
                      isProductFavorite && "fill-current text-red-500"
                    )}
                  />
                </motion.div>
              </Button>
            </div>
            <div className="mt-4">
              <Link
                href={`/products/${product.slug}`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                查看详情 →
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 