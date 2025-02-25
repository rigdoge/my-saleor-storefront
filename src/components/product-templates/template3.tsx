'use client'

import React, { useState } from 'react'
import { ProductTemplateProps } from './dynamic-product-detail'
import { Button } from '@/components/ui/button'
import { Heart, Share2, Plus, Minus, ArrowLeft, Info } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { ProductGallery } from '@/components/product/product-gallery'
import { ProductVariants } from '@/components/product/product-variants'
import { ProductDetails } from '@/components/product/product-details'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { AspectRatio } from '@/components/ui/aspect-ratio'

export function ProductTemplate3({
  product,
  selectedVariant,
  quantity,
  onQuantityChange,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
  isAddingToCart
}: ProductTemplateProps) {
  const [showSpecs, setShowSpecs] = useState(false)
  
  if (!product) return null

  // 转换GraphQL返回的attributes为ProductDetails组件期望的格式
  const productDetails = {
    description: product.description || '',
    attributes: product.attributes || [],
    metadata: product.metadata || [],
    category: product.category || { name: '' }
  }

  // 品牌名称
  const brandName = product.metadata?.find((m: { key: string; value: string }) => m.key === 'brand')?.value || '精品品牌'

  return (
    <div className="bg-black text-white min-h-screen relative">
      {/* 顶部全宽图片 */}
      <div className="w-full h-[60vh] relative">
        <Image 
          src={product.media && product.media[0] ? product.media[0].url : '/placeholder.jpg'} 
          alt={product.name || '产品图片'}
          fill
          className="object-cover opacity-60"
          priority
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black" />
        
        {/* 导航栏 */}
        <div className="absolute top-0 left-0 w-full z-10">
          <div className="container mx-auto px-6 py-6 flex items-center justify-between">
            <Link href="/products" className="flex items-center text-white hover:text-gold-400 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">返回</span>
            </Link>
            
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="sm" className="text-white hover:text-gold-400 hover:bg-transparent">
                <Share2 className="h-5 w-5 mr-2" />
                分享
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:text-gold-400 hover:bg-transparent"
                onClick={onToggleFavorite}
              >
                <Heart className={`${isFavorite ? "fill-gold-500 text-gold-500" : ""} h-5 w-5 mr-2`} />
                收藏
              </Button>
            </div>
          </div>
        </div>
        
        {/* 居中产品标题 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-gold-400 uppercase tracking-widest mb-3 text-sm">{brandName}</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">{product.name}</h1>
            <p className="max-w-xl mx-auto text-slate-300 text-lg">
              {productDetails.description.split(' ').slice(0, 15).join(' ')}
              {productDetails.description.split(' ').length > 15 ? '...' : ''}
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* 主要内容区 */}
      <div className="container mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 -mt-32 relative z-10">
          {/* 左侧：产品画廊 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-slate-900 p-6 rounded-xl overflow-hidden"
          >
            <ProductGallery media={product.media || []} />
          </motion.div>
          
          {/* 右侧：产品信息 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col justify-center"
          >
            {/* 价格信息 */}
            <div className="mb-10">
              {selectedVariant?.pricing?.discount?.gross ? (
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-white">
                    {formatPrice(selectedVariant.pricing.price.gross.amount, selectedVariant.pricing.price.gross.currency)}
                  </span>
                  <span className="text-slate-400 line-through text-xl">
                    {formatPrice(
                      selectedVariant.pricing.undiscountedPrice.gross.amount,
                      selectedVariant.pricing.undiscountedPrice.gross.currency
                    )}
                  </span>
                  <Badge className="bg-gold-500 hover:bg-gold-600 text-black font-medium ml-2">
                    限时优惠
                  </Badge>
                </div>
              ) : selectedVariant?.pricing?.price?.gross ? (
                <span className="text-4xl font-bold text-white">
                  {formatPrice(selectedVariant.pricing.price.gross.amount, selectedVariant.pricing.price.gross.currency)}
                </span>
              ) : (
                <span className="text-4xl font-bold text-white">价格待定</span>
              )}
            </div>
            
            {/* 产品选项 */}
            <div className="space-y-8">
              {/* 规格选择 */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4 text-xl border-b border-slate-700 pb-2">选择规格</h3>
                  <ProductVariants
                    variants={product.variants}
                    selectedVariant={selectedVariant}
                    onVariantSelect={(variant) => {}}
                  />
                </div>
              )}

              {/* 数量选择 */}
              <div>
                <h3 className="font-semibold mb-4 text-xl border-b border-slate-700 pb-2">数量</h3>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 border-slate-700 text-white hover:bg-slate-800"
                    onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-20 text-center font-medium text-xl">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 border-slate-700 text-white hover:bg-slate-800"
                    onClick={() => onQuantityChange(quantity + 1)}
                    disabled={selectedVariant && quantity >= selectedVariant.quantityAvailable}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  
                  {selectedVariant && (
                    <span className="ml-6 text-base">
                      {selectedVariant.quantityAvailable > 10 
                        ? <span className="text-green-400">现货供应</span>
                        : selectedVariant.quantityAvailable > 0 
                          ? <span className="text-amber-400">库存有限</span> 
                          : <span className="text-red-400">暂无库存</span>}
                    </span>
                  )}
                </div>
              </div>
              
              {/* 购买按钮 */}
              <div className="flex flex-col gap-4 pt-6">
                <Button
                  className="h-16 bg-gold-500 hover:bg-gold-600 text-black text-lg font-semibold"
                  disabled={isAddingToCart || !selectedVariant || selectedVariant.quantityAvailable <= 0}
                  onClick={onAddToCart}
                >
                  {isAddingToCart ? "添加中..." : "加入购物车"}
                </Button>
                <Button
                  variant="outline"
                  className="h-16 border-gold-500/50 text-gold-500 hover:bg-gold-500/10 hover:text-gold-400 text-lg font-semibold"
                >
                  立即购买
                </Button>
              </div>
              
              {/* 产品信息手风琴 */}
              <div className="mt-10">
                <Accordion type="single" collapsible className="border-t border-slate-800">
                  <AccordionItem value="description" className="border-b border-slate-800 py-2">
                    <AccordionTrigger className="text-lg font-medium hover:text-gold-400">产品描述</AccordionTrigger>
                    <AccordionContent>
                      <div className="prose prose-invert max-w-none text-slate-300 pt-4">
                        <div dangerouslySetInnerHTML={{ __html: productDetails.description }} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="specifications" className="border-b border-slate-800 py-2">
                    <AccordionTrigger className="text-lg font-medium hover:text-gold-400">规格参数</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-4 pt-4">
                        {productDetails.attributes.map((attr: { attribute: { slug: string; name: string }; values: { name: string }[] }, index: number) => (
                          <div key={attr.attribute.slug} className="grid grid-cols-2 border-b border-slate-800 pb-3">
                            <div className="font-medium text-slate-300">{attr.attribute.name}</div>
                            <div className="text-slate-400">
                              {attr.values.map(v => v.name).join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="shipping" className="border-b border-slate-800 py-2">
                    <AccordionTrigger className="text-lg font-medium hover:text-gold-400">配送与退货</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-3 pt-4 text-slate-300">
                        <li className="flex items-start gap-2">
                          <Info className="h-5 w-5 text-gold-400 mt-0.5 flex-shrink-0" />
                          <span>标准配送：1-3个工作日送达</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Info className="h-5 w-5 text-gold-400 mt-0.5 flex-shrink-0" />
                          <span>部分地区支持次日达服务</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Info className="h-5 w-5 text-gold-400 mt-0.5 flex-shrink-0" />
                          <span>7天内无理由退货，15天内产品质量问题免费换货</span>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* 品牌故事区域 */}
        <div className="mt-32 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-gold-400 uppercase tracking-widest text-sm">品牌故事</h2>
            <h3 className="text-4xl font-bold">{brandName}</h3>
            <p className="text-slate-400 max-w-2xl mx-auto">
              品质与艺术的完美结合，{brandName}源于对卓越的不懈追求。我们的设计师将传统工艺与现代美学相融合，创造出兼具功能性与艺术性的精品。每一件产品都蕴含着匠人精神和对细节的极致关注。
            </p>
            
            <div className="pt-10">
              <Button variant="outline" className="border-gold-500/50 text-gold-500 hover:bg-gold-500/10 hover:text-gold-400">
                了解更多
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* 推荐产品区域（占位） */}
        <div className="mt-32">
          <h2 className="text-3xl font-bold mb-10 text-center">相关推荐</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <motion.div 
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: item * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-900 rounded-lg overflow-hidden"
              >
                <AspectRatio ratio={1}>
                  <div className="h-full w-full bg-slate-800 flex items-center justify-center text-slate-600">
                    产品图片占位符
                  </div>
                </AspectRatio>
                <div className="p-4">
                  <h3 className="font-medium mb-1">推荐产品 {item}</h3>
                  <p className="text-slate-400 text-sm mb-2">产品描述</p>
                  <p className="font-semibold text-gold-400">¥1,299.00</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 页脚 */}
      <footer className="bg-slate-900 py-10 mt-20">
        <div className="container mx-auto px-6 text-center text-slate-400">
          <p>© 2023 {brandName}. 保留所有权利。</p>
        </div>
      </footer>
      
      {/* 规格弹窗 */}
      <AnimatePresence>
        {showSpecs && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowSpecs(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">产品规格</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowSpecs(false)}>
                  关闭
                </Button>
              </div>
              
              <div className="grid gap-4">
                {productDetails.attributes.map((attr: { attribute: { slug: string; name: string }; values: { name: string }[] }, index: number) => (
                  <div key={attr.attribute.slug} className="grid grid-cols-2 border-b border-slate-800 pb-3">
                    <div className="font-medium text-slate-300">{attr.attribute.name}</div>
                    <div className="text-slate-400">
                      {attr.values.map(v => v.name).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 