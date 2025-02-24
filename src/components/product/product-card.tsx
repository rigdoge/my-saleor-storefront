"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn, formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { useFavorites } from "@/components/providers/favorites-provider"

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string
    slug: string
    price: number
    currency: string
    thumbnail: {
      url: string
      alt: string
    }
    category: {
      id: string
      name: string
      slug: string
    } | null
    isAvailable: boolean
    variants: Array<{
      id: string
      name: string
      quantityAvailable: number
    }>
  }
  variant?: "default" | "compact"
  className?: string
}

export function ProductCard({
  product,
  variant = "default",
  className,
}: ProductCardProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()

  const handleFavoriteClick = () => {
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

  const formattedPrice = new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: product.currency,
  }).format(product.price)

  const isOutOfStock = !product.isAvailable || product.variants.every(v => v.quantityAvailable === 0)

  return (
    <Card
      className={cn(
        "group overflow-hidden rounded-xl transition-colors hover:border-foreground/50",
        className
      )}
    >
      <Link href={`/products/${product.slug}`}>
        <CardHeader className="border-b p-0">
          <div className="aspect-square overflow-hidden relative">
            <Image
              src={product.thumbnail.url}
              alt={product.thumbnail.alt}
              width={500}
              height={500}
              className={cn(
                "object-cover transition-transform group-hover:scale-105",
                isOutOfStock && "opacity-50"
              )}
            />
            {isOutOfStock && (
              <Badge 
                variant="destructive" 
                className="absolute top-2 right-2"
              >
                缺货
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="grid gap-2 p-4">
          {product.category && (
            <p className="text-sm text-muted-foreground">
              {product.category.name}
            </p>
          )}
          <h3 className="line-clamp-1 text-lg font-semibold">
            {product.name}
          </h3>
          {variant === "default" && product.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {product.description}
            </p>
          )}
          <p className="text-lg font-semibold">
            {formattedPrice}
          </p>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full gap-2">
          <Button 
            className="w-full" 
            size="sm"
            disabled={isOutOfStock}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            {isOutOfStock ? '暂时缺货' : '加入购物车'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-10 shrink-0 px-0"
            onClick={handleFavoriteClick}
          >
            <Heart className={cn(
              "h-4 w-4",
              isFavorite(product.id) && "fill-current"
            )} />
            <span className="sr-only">添加到收藏</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
} 