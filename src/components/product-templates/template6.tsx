'use client'

import React from 'react'
import { ProductTemplateProps } from './dynamic-product-detail'
import { Button } from '@/components/ui/button'
import { Star, Truck, DollarSign } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { ProductGallery } from '@/components/product/product-gallery'
import { cn } from '@/lib/utils'

export function ProductTemplate6({
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
  const categoryName = product.category?.name || 'Women'
  const subCategoryName = productDetails.metadata.find((m: any) => m.key === 'subCategory')?.value || 'Clothing'

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 面包屑导航 */}
      <div className="mb-6 text-sm flex gap-2">
        <span className="text-gray-700">{categoryName}</span>
        <span className="text-gray-500">/</span>
        <span className="text-gray-700">{subCategoryName}</span>
        <span className="text-gray-500">/</span>
        <span className="text-gray-500">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* 左侧：产品图片区 */}
        <div>
          <ProductGallery media={product.media || []} />
        </div>

        {/* 右侧：产品信息区 */}
        <div className="flex flex-col">
          {/* 产品标题和价格 */}
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-medium text-gray-900">{product.name}</h1>
            <span className="text-2xl font-medium">
              {selectedVariant?.pricing?.price?.gross 
                ? formatPrice(selectedVariant.pricing.price.gross.amount, selectedVariant.pricing.price.gross.currency)
                : "$35"}
            </span>
          </div>
          
          {/* 评分 */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">3.9</span>
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
            </div>
            <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              See all 512 reviews
            </a>
          </div>
          
          {/* 颜色选择 */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full bg-gray-900 border-2 border-indigo-500 ring-2 ring-white"></button>
              <button className="w-8 h-8 rounded-full bg-gray-400 border-2 border-transparent"></button>
            </div>
          </div>

          {/* 尺寸选择 */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-900">Size</h3>
              <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                See sizing chart
              </a>
            </div>
            <div className="grid grid-cols-6 gap-2">
              <button className="py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
                XXS
              </button>
              <button className="py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
                XS
              </button>
              <button className="py-2 border border-transparent rounded text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                S
              </button>
              <button className="py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
                M
              </button>
              <button className="py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
                L
              </button>
              <button className="py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
                XL
              </button>
            </div>
          </div>
          
          {/* 添加到购物车按钮 */}
          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded"
            onClick={onAddToCart}
            disabled={isAddingToCart}
          >
            Add to cart
          </Button>
          
          {/* 产品描述 */}
          <div className="mt-10">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
            <p className="text-gray-600 mb-6">
              The Basic tee is an honest new take on a classic. The tee uses super soft, pre-shrunk cotton for true comfort and a dependable fit. They are hand cut and sewn locally, with a special dye technique that gives each tee it's own look.
            </p>
            <p className="text-gray-600 mb-6">
              Looking to stock your closet? The Basic tee also comes in a 3-pack or 5-pack at a bundle discount.
            </p>
          </div>
          
          {/* 面料与保养 */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fabric & Care</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Only the best materials</li>
              <li>Ethically and locally made</li>
              <li>Pre-washed and pre-shrunk</li>
              <li>Machine wash cold with similar colors</li>
            </ul>
          </div>
          
          {/* 服务信息 */}
          <div className="mt-10 grid grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col items-center justify-center text-center">
              <Truck className="h-6 w-6 text-gray-400 mb-2" />
              <h4 className="text-sm font-medium text-gray-900">International delivery</h4>
              <p className="text-xs text-gray-500 mt-1">Get your order in 2 years</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col items-center justify-center text-center">
              <DollarSign className="h-6 w-6 text-gray-400 mb-2" />
              <h4 className="text-sm font-medium text-gray-900">Loyalty rewards</h4>
              <p className="text-xs text-gray-500 mt-1">Don't look at other tees</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 