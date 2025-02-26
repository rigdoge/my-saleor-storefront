'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCart } from "@/components/providers/cart-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Plus, Minus } from "lucide-react"
import Link from "next/link"
import { ProductSkeleton } from "@/components/product/product-skeleton"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useFavorites } from "@/components/providers/favorites-provider"
import { useProductBySlugQuery } from "@/lib/graphql/__generated__/types"
import { DynamicProductDetail } from "@/components/product-templates"
import { ProductTemplateSkeleton } from "@/components/product-templates/product-template-skeleton"

// Define ProductAttribute interface to match with ProductDetails component
interface ProductAttribute {
  attribute: {
    name: string
    slug: string
  }
  values: Array<{
    name: string
    slug: string
  }>
}

// Convert GraphQL returned attributes to the format expected by ProductDetails component
function convertAttributes(attributes: any[]): ProductAttribute[] {
  if (!attributes) return []
  
  return attributes.map(attr => ({
    attribute: {
      name: attr.attribute.name || '',
      slug: attr.attribute.slug || ''
    },
    values: attr.values.map((val: any) => ({
      name: val.name || '',
      slug: val.slug || ''
    }))
  }))
}

// Convert GraphQL returned category to the format expected by ProductDetails component
function convertCategory(category: any): { 
  name: string; 
  ancestors?: { edges: Array<{ node: { name: string; slug: string } }> } 
} {
  if (!category) return { name: '' }
  
  return {
    name: category.name || '',
    ancestors: category.ancestors
  }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { addItem } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const { data, isLoading, error } = useProductBySlugQuery({
    slug: params.slug,
    channel: 'default-channel'
  })
  
  const product = data?.product
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || null)

  // If the product has only one variant, automatically select it
  useEffect(() => {
    if (product?.variants && product.variants.length === 1) {
      setSelectedVariant(product.variants[0])
    }
  }, [product])

  if (isLoading) {
    return <ProductTemplateSkeleton />
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Product Not Found</h1>
          <p className="mt-4 text-muted-foreground">This product may be unavailable or does not exist</p>
          <Button asChild className="mt-8">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Check if this is a gift card product
  const isGiftCard = product.productType?.kind === 'GIFT_CARD'

  const handleFavoriteClick = () => {
    if (!product) return

    if (isFavorite(product.id)) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites({
        id: product.id,
        name: product.name,
        slug: product.slug,
        thumbnail: product.thumbnail ? {
          url: product.thumbnail.url,
          alt: product.thumbnail.alt || ""
        } : undefined,
      })
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    
    setIsAddingToCart(true)
    
    // For gift cards, we don't need to check variants
    if (isGiftCard) {
      const price = product.pricing?.priceRange?.start?.gross?.amount || 0
      const currency = product.pricing?.priceRange?.start?.gross?.currency || 'CNY'

      addItem({
        id: crypto.randomUUID(),
        variantId: product.id,
        name: product.name,
        slug: product.slug,
        quantity,
        price,
        currency,
        thumbnail: product.thumbnail ? {
          url: product.thumbnail.url,
          alt: product.thumbnail.alt || ""
        } : undefined,
        isGiftCard: true
      })

      toast({
        description: "Gift card added to cart",
      })
      
      setTimeout(() => setIsAddingToCart(false), 500)
      return
    }
    
    // For regular products
    const variant = selectedVariant || (product.variants && product.variants.length === 1 ? product.variants[0] : null)
    if (!variant && product.variants && product.variants.length > 1) {
      setIsAddingToCart(false)
      return
    }

    const price = variant && variant.pricing?.price?.gross?.amount 
      ? variant.pricing.price.gross.amount 
      : product.pricing?.priceRange?.start?.gross?.amount || 0
      
    const currency = variant && variant.pricing?.price?.gross?.currency 
      ? variant.pricing.price.gross.currency 
      : product.pricing?.priceRange?.start?.gross?.currency || 'CNY'

    addItem({
      id: crypto.randomUUID(),
      variantId: variant?.id || product.id,
      name: product.name,
      slug: product.slug,
      quantity,
      price,
      currency,
      thumbnail: product.thumbnail ? {
        url: product.thumbnail.url,
        alt: product.thumbnail.alt || ""
      } : undefined,
      variant: variant ? {
        id: variant.id,
        name: variant.name,
        quantityAvailable: variant.quantityAvailable || 0
      } : undefined
    })

    toast({
      description: "Added to cart",
    })
    
    setTimeout(() => setIsAddingToCart(false), 500)
  }

  const hasVariants = !isGiftCard && product.variants && product.variants.length > 1
  const isOutOfStock = product.isAvailable === false || (!isGiftCard && product.variants && product.variants.every((v: any) => v.quantityAvailable === 0))
  
  const maxQuantity = isGiftCard ? 99 : (selectedVariant?.quantityAvailable || 99)
  
  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
  }

  // Use dynamic product detail component instead of static layout
  return (
    <DynamicProductDetail
      product={product}
      selectedVariant={selectedVariant}
      quantity={quantity}
      onQuantityChange={handleQuantityChange}
      onAddToCart={handleAddToCart}
      onToggleFavorite={handleFavoriteClick}
      isFavorite={isFavorite(product?.id || "")}
      isAddingToCart={isAddingToCart}
      isGiftCard={isGiftCard}
    />
  )
} 