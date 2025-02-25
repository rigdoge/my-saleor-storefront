"use client"

import { useState } from 'react'
import { useCart } from '@/components/providers/cart-provider'
import { useFavorites } from '@/components/providers/favorites-provider'
import { useToast } from '@/components/ui/use-toast'
import { Product } from '@/lib/types'

export function useProductActions(product: Product) {
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { addItem } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const { toast } = useToast()
  const isProductFavorite = isFavorite(product.id)

  // 计算最终价格
  const hasDiscount = product.pricing?.discount && product.pricing.discount.amount > 0
  const finalPrice = hasDiscount 
    ? product.price - product.pricing!.discount!.amount 
    : product.price

  // 添加到购物车
  const handleAddToCart = async () => {
    if (!product.isAvailable) {
      toast({
        title: '商品已售罄',
        description: '该商品暂时无法购买',
        variant: 'destructive',
      })
      return
    }

    setIsAddingToCart(true)
    try {
      await addItem({
        id: product.id,
        variantId: product.variants[0]?.id,
        name: product.name,
        slug: product.slug,
        quantity: 1,
        price: finalPrice,
        currency: product.currency,
        thumbnail: product.thumbnail,
        variant: product.variants[0],
      })

      toast({
        title: '已添加到购物车',
        description: `${product.name} 已添加到您的购物车`,
      })
    } catch (error) {
      toast({
        title: '添加失败',
        description: '添加商品到购物车时出错，请稍后重试',
        variant: 'destructive',
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  // 切换收藏状态
  const handleFavoriteToggle = () => {
    if (isProductFavorite) {
      removeFromFavorites(product.id)
      toast({
        description: `${product.name} 已从收藏夹中移除`,
      })
    } else {
      addToFavorites({
        id: product.id,
        name: product.name,
        slug: product.slug,
        thumbnail: product.thumbnail,
      })
      toast({
        description: `${product.name} 已添加到收藏夹`,
      })
    }
  }

  return {
    isAddingToCart,
    isProductFavorite,
    finalPrice,
    hasDiscount,
    handleAddToCart,
    handleFavoriteToggle
  }
} 