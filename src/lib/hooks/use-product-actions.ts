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

  // Calculate final price
  const hasDiscount = product.pricing?.discount && product.pricing?.discount?.amount > 0
  const finalPrice = hasDiscount 
    ? product.price - (product.pricing?.discount?.amount || 0)
    : product.price

  // Add to cart
  const handleAddToCart = async () => {
    if (!product.isAvailable) {
      toast({
        title: 'Out of Stock',
        description: 'This product is currently unavailable',
        variant: 'destructive',
      })
      return
    }

    setIsAddingToCart(true)
    try {
      await addItem({
        id: product.id,
        variantId: product.variants?.[0]?.id,
        name: product.name,
        slug: product.slug,
        quantity: 1,
        price: finalPrice,
        currency: product.currency,
        thumbnail: product.thumbnail,
        variant: product.variants?.[0],
      })

      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart`,
      })
    } catch (error) {
      toast({
        title: 'Failed to add',
        description: 'Error adding product to cart, please try again later',
        variant: 'destructive',
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  // Toggle favorite status
  const handleFavoriteToggle = () => {
    if (isProductFavorite) {
      removeFromFavorites(product.id)
      toast({
        description: `${product.name} has been removed from favorites`,
      })
    } else {
      addToFavorites({
        id: product.id,
        name: product.name,
        slug: product.slug,
        thumbnail: product.thumbnail,
      })
      toast({
        description: `${product.name} has been added to favorites`,
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