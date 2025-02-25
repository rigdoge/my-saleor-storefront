'use client'

import React from 'react'
import { ProductTemplateProps } from './dynamic-product-detail'
import { Button } from '@/components/ui/button'
import { Heart, Share2, Plus, Minus, ArrowLeft, Star } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { ProductGallery } from '@/components/product/product-gallery'
import { ProductVariants } from '@/components/product/product-variants'
import { ProductDetails } from '@/components/product/product-details'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function ProductTemplate2({
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
      className="min-h-screen bg-white dark:bg-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 头部导航栏 */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/products" className="flex items-center text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="font-medium">返回产品列表</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onToggleFavorite}>
              <Heart className={`${isFavorite ? "fill-red-500 text-red-500" : ""} h-5 w-5`} />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* 产品内容 */}
      <div className="container mx-auto px-4 py-6 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* 产品图片区 - 采用大图 */}
          <div className="md:sticky md:top-24 h-fit">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl overflow-hidden">
              <ProductGallery media={product.media || []} />
            </div>
          </div>

          {/* 产品信息区 */}
          <div className="flex flex-col">
            {/* 品牌和标题 */}
            <div className="mb-6">
              {product.metadata?.find((m: { key: string; value: string }) => m.key === 'brand') && (
                <div className="text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-2">
                  {product.metadata.find((m: { key: string; value: string }) => m.key === 'brand')?.value}
                </div>
              )}
              <h1 className="text-2xl md:text-4xl font-bold mb-3">{product.name}</h1>
              
              {/* 评分 */}
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">127 评价</span>
              </div>
              
              {/* 价格显示 */}
              <div className="flex items-center flex-wrap gap-3 mb-6">
                {selectedVariant?.pricing?.discount?.gross ? (
                  <>
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                      {formatPrice(selectedVariant.pricing.price.gross.amount, selectedVariant.pricing.price.gross.currency)}
                    </span>
                    <span className="text-slate-500 line-through text-lg">
                      {formatPrice(
                        selectedVariant.pricing.undiscountedPrice.gross.amount,
                        selectedVariant.pricing.undiscountedPrice.gross.currency
                      )}
                    </span>
                    <Badge className="bg-red-500 hover:bg-red-600 text-white">
                      节省 {formatPrice(
                        selectedVariant.pricing.undiscountedPrice.gross.amount - selectedVariant.pricing.price.gross.amount,
                        selectedVariant.pricing.price.gross.currency
                      )}
                    </Badge>
                  </>
                ) : selectedVariant?.pricing?.price?.gross ? (
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">
                    {formatPrice(selectedVariant.pricing.price.gross.amount, selectedVariant.pricing.price.gross.currency)}
                  </span>
                ) : (
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">价格待定</span>
                )}
              </div>
            </div>

            {/* 描述 */}
            <div className="prose prose-slate dark:prose-invert prose-sm max-w-none mb-8">
              <p>{productDetails.description.slice(0, 200)}{productDetails.description.length > 200 ? '...' : ''}</p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6 mb-8">
              {/* 规格选择 */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 text-slate-900 dark:text-white">选择规格</h3>
                  <ProductVariants
                    variants={product.variants}
                    selectedVariant={selectedVariant}
                    onVariantSelect={(variant) => {}}
                  />
                </div>
              )}

              {/* 数量选择 */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-slate-900 dark:text-white">数量</h3>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-16 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={() => onQuantityChange(quantity + 1)}
                    disabled={selectedVariant && quantity >= selectedVariant.quantityAvailable}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  
                  {selectedVariant && (
                    <span className="ml-4 text-sm">
                      {selectedVariant.quantityAvailable > 10 
                        ? <span className="text-green-600 dark:text-green-400">有货</span>
                        : selectedVariant.quantityAvailable > 0 
                          ? <span className="text-amber-600 dark:text-amber-400">库存紧张</span> 
                          : <span className="text-red-600 dark:text-red-400">缺货</span>}
                    </span>
                  )}
                </div>
              </div>

              {/* 购买按钮 */}
              <div className="flex flex-col gap-3">
                <Button
                  className="h-14 bg-indigo-600 hover:bg-indigo-700 text-lg"
                  disabled={isAddingToCart || !selectedVariant || selectedVariant.quantityAvailable <= 0}
                  onClick={onAddToCart}
                >
                  {isAddingToCart ? "添加中..." : "加入购物车"}
                </Button>
                <Button
                  variant="outline"
                  className="h-14 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-indigo-800 dark:hover:bg-indigo-900/40 dark:hover:text-indigo-300 text-lg"
                >
                  立即购买
                </Button>
              </div>
            </div>

            {/* 服务标签 */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 text-indigo-600 dark:text-indigo-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <span>次日达</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 text-indigo-600 dark:text-indigo-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
                <span>正品保证</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 text-indigo-600 dark:text-indigo-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <span>7天无理由退货</span>
              </div>
            </div>
          </div>
        </div>

        {/* 产品详情选项卡 */}
        <div className="mt-16">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full mb-8 grid grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="details">产品详情</TabsTrigger>
              <TabsTrigger value="specs">规格参数</TabsTrigger>
              <TabsTrigger value="reviews">用户评价</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="px-4">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: productDetails.description }} />
              </div>
            </TabsContent>
            
            <TabsContent value="specs">
              <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                <table className="w-full">
                  <tbody>
                    {productDetails.attributes.map((attr: { attribute: { slug: string; name: string }; values: { name: string }[] }, index: number) => (
                      <tr key={attr.attribute.slug} className={index % 2 === 0 ? 'bg-slate-50 dark:bg-slate-800/50' : ''}>
                        <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300 w-1/3">{attr.attribute.name}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          {attr.values.map(v => v.name).join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews">
              <div className="text-center py-12">
                <p className="text-lg text-slate-600 dark:text-slate-400">暂无用户评价</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  )
} 