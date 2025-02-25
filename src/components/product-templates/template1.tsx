'use client'

import React from 'react'
import { ProductTemplateProps } from './dynamic-product-detail'
import { Button } from '@/components/ui/button'
import { Heart, Share2, Plus, Minus } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { ProductGallery } from '@/components/product/product-gallery'
import { ProductVariants } from '@/components/product/product-variants'
import { ProductDetails } from '@/components/product/product-details'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

export function ProductTemplate1({
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
      <div className="grid md:grid-cols-2 gap-8">
        <div className="md:sticky md:top-24 h-fit">
          <ProductGallery media={product.media || []} />
        </div>

        <div className="flex flex-col">
          {/* 产品标题和类别 */}
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-semibold mb-2">{product.name}</h1>
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
              {product.category && (
                <span>分类: {product.category.name}</span>
              )}
            </div>
          </div>
          
          {/* 价格 */}
          <div className="mb-6">
            {selectedVariant?.pricing?.discount?.gross ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {formatPrice(selectedVariant.pricing.price.gross.amount, selectedVariant.pricing.price.gross.currency)}
                </span>
                <span className="text-slate-500 line-through text-sm">
                  {formatPrice(
                    selectedVariant.pricing.undiscountedPrice.gross.amount,
                    selectedVariant.pricing.undiscountedPrice.gross.currency
                  )}
                </span>
                <Badge className="bg-red-500 hover:bg-red-600">
                  {Math.round((1 - selectedVariant.pricing.price.gross.amount / selectedVariant.pricing.undiscountedPrice.gross.amount) * 100)}% 优惠
                </Badge>
              </div>
            ) : selectedVariant?.pricing?.price?.gross ? (
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {formatPrice(selectedVariant.pricing.price.gross.amount, selectedVariant.pricing.price.gross.currency)}
              </span>
            ) : (
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">价格待定</span>
            )}
          </div>

          {/* 规格选择 */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-3">选择规格</h3>
              <ProductVariants
                variants={product.variants}
                selectedVariant={selectedVariant}
                onVariantSelect={(variant) => {}}
              />
            </div>
          )}

          {/* 数量选择 */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">数量</h3>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onQuantityChange(quantity + 1)}
                disabled={selectedVariant && quantity >= selectedVariant.quantityAvailable}
              >
                <Plus className="h-4 w-4" />
              </Button>
              
              {selectedVariant && (
                <span className="ml-4 text-sm text-slate-500">
                  {selectedVariant.quantityAvailable > 0 
                    ? `库存: ${selectedVariant.quantityAvailable}` 
                    : '缺货'}
                </span>
              )}
            </div>
          </div>

          {/* 行动按钮 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
            <Button
              className="md:col-span-3 h-12 bg-indigo-600 hover:bg-indigo-700"
              disabled={isAddingToCart || !selectedVariant || selectedVariant.quantityAvailable <= 0}
              onClick={onAddToCart}
            >
              {isAddingToCart ? "添加中..." : "加入购物车"}
            </Button>
            <Button
              variant="outline"
              className="h-12"
              onClick={onToggleFavorite}
            >
              <Heart className={`${isFavorite ? "fill-red-500 text-red-500" : ""} h-5 w-5`} />
            </Button>
          </div>

          <Separator className="my-4" />

          {/* 服务信息 */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-start space-x-2">
              <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 text-indigo-600">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm">免费配送</p>
                <p className="text-xs text-slate-500">满99元包邮</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 text-indigo-600">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm">正品保证</p>
                <p className="text-xs text-slate-500">官方授权渠道</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 text-indigo-600">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm">7天无理由退货</p>
                <p className="text-xs text-slate-500">满意为止</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 text-indigo-600">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0 1 12 12.75Zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 0 1-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 0 0 2.248-2.354M12 12.75a2.25 2.25 0 0 1-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 0 0-.4-2.253M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 0 1 .4-2.253M12 8.25a2.25 2.25 0 0 0 2.248-2.354M12 8.25a2.25 2.25 0 0 1-2.248-2.354M12 18.75a2.25 2.25 0 0 0 2.248-2.354M12 18.75a2.25 2.25 0 0 1-2.248-2.354M12 15.75a2.25 2.25 0 0 0 2.248-2.354M12 15.75a2.25 2.25 0 0 1-2.248-2.354" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm">售后无忧</p>
                <p className="text-xs text-slate-500">专业客服团队</p>
              </div>
            </div>
          </div>

          {/* 分享按钮 */}
          <div className="flex items-center text-sm text-slate-500 mb-8">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              分享
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <ProductDetails details={productDetails} />
      </div>
    </motion.div>
  )
} 