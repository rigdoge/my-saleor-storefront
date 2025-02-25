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

// 定义ProductAttribute接口，与ProductDetails组件中的定义保持一致
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

// 转换GraphQL返回的attributes为ProductDetails组件期望的格式
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

// 转换GraphQL返回的category为ProductDetails组件期望的格式
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

  // 如果商品只有一个规格，自动选择该规格
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
        thumbnail: product.thumbnail ? {
          url: product.thumbnail.url,
          alt: product.thumbnail.alt || ""
        } : undefined,
      })
    }
  }

  const handleAddToCart = () => {
    if (!product || !product.variants) return
    
    setIsAddingToCart(true)
    
    // 如果商品没有规格选项，使用默认价格
    const variant = selectedVariant || (product.variants.length === 1 ? product.variants[0] : null)
    if (!variant && product.variants.length > 1) {
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
      description: "已添加到购物车",
    })
    
    setTimeout(() => setIsAddingToCart(false), 500)
  }

  const hasVariants = product?.variants && product.variants.length > 1
  const isOutOfStock = product?.isAvailable === false || (product?.variants && product.variants.every((v: any) => v.quantityAvailable === 0))
  
  const maxQuantity = selectedVariant?.quantityAvailable || 99
  
  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
  }

  // 使用动态产品详情组件替换原有的静态布局
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
    />
  )
} 