'use client'

import React from 'react'
import { ProductTemplateProps } from './dynamic-product-detail'
import { Button } from '@/components/ui/button'
import { Heart, Plus, Minus, Star } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { ProductGallery } from '@/components/product/product-gallery'
import { ProductVariants } from '@/components/product/product-variants'
import { ProductDetails } from '@/components/product/product-details'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export function ProductTemplate4({
  product,
  selectedVariant,
  quantity,
  onQuantityChange,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
  isAddingToCart
}: ProductTemplateProps) {
  if (!product) return null

  // 转换GraphQL返回的attributes为ProductDetails组件期望的格式
  const productDetails = {
    description: product.description || '',
    attributes: product.attributes || [],
    metadata: product.metadata || [],
    category: product.category || { name: '' }
  }

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 面包屑导航 */}
      <div className="mb-6 text-sm flex gap-2">
        <span>Men</span>
        <span>/</span>
        <span>Clothing</span>
        <span>/</span>
        <span className="text-slate-500">Basic Tee 6-Pack</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 左侧：产品图片区 */}
        <div>
          <ProductGallery media={product.media || []} />
        </div>

        {/* 右侧：产品信息区 */}
        <div className="flex flex-col">
          {/* 产品标题 */}
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          {/* 价格 */}
          <div className="mb-6">
            <span className="text-2xl font-bold">
              {selectedVariant?.pricing?.price?.gross 
                ? formatPrice(selectedVariant.pricing.price.gross.amount, selectedVariant.pricing.price.gross.currency)
                : "$192"}
            </span>
          </div>

          {/* 评分 */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-indigo-600">
              117 reviews
            </span>
          </div>

          {/* 颜色选择 */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Color</h3>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full bg-white border-2 border-indigo-600"></button>
              <button className="w-8 h-8 rounded-full bg-gray-200 border-2 border-transparent"></button>
              <button className="w-8 h-8 rounded-full bg-slate-900 border-2 border-transparent"></button>
            </div>
          </div>

          {/* 尺寸选择 */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Size</h3>
              <a href="#" className="text-sm text-indigo-600">Size guide</a>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button className="py-2 px-4 border border-gray-300 rounded-lg bg-gray-100 text-gray-400">XS</button>
              <button className="py-2 px-4 border border-gray-300 rounded-lg">S</button>
              <button className="py-2 px-4 border border-indigo-600 rounded-lg text-indigo-600">M</button>
              <button className="py-2 px-4 border border-gray-300 rounded-lg">L</button>
              <button className="py-2 px-4 border border-gray-300 rounded-lg">XL</button>
              <button className="py-2 px-4 border border-gray-300 rounded-lg">2XL</button>
              <button className="py-2 px-4 border border-gray-300 rounded-lg">3XL</button>
            </div>
          </div>

          {/* 添加到购物车按钮 */}
          <Button
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 h-12"
            onClick={onAddToCart}
            disabled={isAddingToCart}
          >
            Add to bag
          </Button>

          {/* 产品描述 */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Basic Tee 6-Pack</h2>
            <p className="text-slate-600 mb-6">
              The Basic Tee 6-Pack allows you to fully express your vibrant personality with three grayscale options. Feeling adventurous? Put on a heather gray tee. Want to be a trendsetter? Try our exclusive colorway: "Black". Need to add an extra pop of color to your outfit? Our white tee has you covered.
            </p>

            {/* 产品特点 */}
            <div className="mb-6">
              <h3 className="font-bold mb-3">Highlights</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Hand cut and sewn locally</li>
                <li>Dyed with our proprietary colors</li>
                <li>Pre-washed & pre-shrunk</li>
                <li>Ultra-soft 100% cotton</li>
              </ul>
            </div>

            {/* 产品详情 */}
            <div className="mb-6">
              <h3 className="font-bold mb-3">Details</h3>
              <p className="text-slate-600">
                The 6-Pack includes two black, two white, and two heather gray Basic Tees. Sign up for our subscription service and be the first to get new, exciting colors, like our upcoming "Charcoal Gray" limited release.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 