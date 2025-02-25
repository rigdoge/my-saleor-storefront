'use client'

import React from 'react'
import { ProductTemplateProps } from './dynamic-product-detail'
import { Button } from '@/components/ui/button'
import { Check, HelpCircle, Shield } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { ProductGallery } from '@/components/product/product-gallery'
import { cn } from '@/lib/utils'

export function ProductTemplate5({
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

  // 获取分类信息，如果没有使用默认值
  const categoryName = product.category?.name || 'Travel'
  const subCategoryName = productDetails.metadata.find((m: any) => m.key === 'subCategory')?.value || 'Bags'

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 面包屑导航 */}
      <div className="mb-8 text-sm flex gap-2">
        <span className="text-gray-500">{categoryName}</span>
        <span className="text-gray-500">/</span>
        <span className="text-gray-500">{subCategoryName}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* 左侧：产品信息区 */}
        <div className="flex flex-col">
          {/* 产品标题 */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          
          {/* 价格 */}
          <div className="flex items-center gap-6 mb-6">
            <span className="text-2xl font-medium text-gray-900">
              {selectedVariant?.pricing?.price?.gross 
                ? formatPrice(selectedVariant.pricing.price.gross.amount, selectedVariant.pricing.price.gross.currency)
                : "$220"}
            </span>
            
            {/* 评分 */}
            <div className="flex items-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <svg 
                    key={i} 
                    className={cn(
                      "w-5 h-5",
                      i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"
                    )}
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">
                1624 reviews
              </span>
            </div>
          </div>
          
          {/* 产品描述 */}
          <p className="text-gray-600 mb-8">
            {product.description || "Don't compromise on snack-carrying capacity with this lightweight and spacious bag. The drawstring top keeps all your favorite chips, crisps, fries, biscuits, crackers, and cookies secure."}
          </p>
          
          {/* 库存状态 */}
          <div className="flex items-center gap-2 text-green-600 mb-8">
            <Check className="h-5 w-5" />
            <span>In stock and ready to ship</span>
          </div>
          
          {/* 尺寸选择 */}
          <div className="mb-8">
            <h3 className="font-medium mb-4">Size</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className={`border rounded-lg p-4 cursor-pointer ${true ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'}`}>
                <div className="font-semibold">18L</div>
                <div className="text-sm text-gray-500">Perfect for a reasonable amount of snacks.</div>
              </div>
              <div className={`border rounded-lg p-4 cursor-pointer ${false ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'}`}>
                <div className="font-semibold">20L</div>
                <div className="text-sm text-gray-500">Enough room for a serious amount of snacks.</div>
              </div>
            </div>
          </div>
          
          {/* 尺寸指南链接 */}
          <div className="flex items-center gap-1 text-sm mb-8">
            <HelpCircle className="h-4 w-4 text-gray-400" />
            <a href="#" className="text-gray-500 hover:text-gray-700">What size should I buy?</a>
          </div>
          
          {/* 添加到购物车按钮 */}
          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 rounded-md"
            onClick={onAddToCart}
            disabled={isAddingToCart}
          >
            Add to bag
          </Button>
          
          {/* 保证信息 */}
          <div className="flex items-center gap-2 mt-6 justify-center text-gray-500">
            <Shield className="h-5 w-5" />
            <span>Lifetime Guarantee</span>
          </div>
        </div>

        {/* 右侧：产品图片区 */}
        <div>
          <ProductGallery media={product.media || []} />
        </div>
      </div>
    </div>
  )
} 