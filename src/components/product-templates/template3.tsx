'use client'

import React, { useState } from 'react'
import { ProductTemplateProps } from './dynamic-product-detail'
import { Button } from '@/components/ui/button'
import { Heart, Share2, Plus, Minus, ArrowLeft, Info, X } from 'lucide-react'
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

  // Convert GraphQL returned attributes to the format expected by ProductDetails component
  const productDetails = {
    description: product.description || '',
    attributes: product.attributes || [],
    metadata: product.metadata || [],
    category: product.category || { name: '' }
  }

  // Brand name
  const brandName = product.metadata?.find((m: { key: string; value: string }) => m.key === 'brand')?.value || 'Premium Brand'

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen relative">
      {/* Full-width top image */}
      <div className="w-full h-[60vh] relative">
        <Image 
          src={product.media && product.media[0] ? product.media[0].url : '/placeholder.jpg'} 
          alt={product.name || 'Product Image'}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        
        {/* Back button */}
        <div className="absolute top-4 left-4 z-10">
          <Link href="/products">
            <Button variant="outline" size="sm" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
        
        {/* Favorite button */}
        <div className="absolute top-4 right-4 z-10">
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            onClick={onToggleFavorite}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        </div>
      </div>
      
      {/* Product info section */}
      <div className="relative -mt-20 rounded-t-3xl bg-slate-50 dark:bg-slate-900 p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Brand and title */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gold-500 dark:text-gold-400 mb-2">{brandName}</div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{product.name}</h1>
            
            {/* Price */}
            <div className="mt-4">
              {selectedVariant?.pricing?.discount?.gross ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gold-600 dark:text-gold-400">
                    {formatPrice(selectedVariant.pricing.price.gross.amount, selectedVariant.pricing.price.gross.currency)}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 line-through text-sm">
                    {formatPrice(
                      selectedVariant.pricing.undiscountedPrice.gross.amount,
                      selectedVariant.pricing.undiscountedPrice.gross.currency
                    )}
                  </span>
                  <Badge className="bg-gold-500 hover:bg-gold-600 text-white">
                    {Math.round((1 - selectedVariant.pricing.price.gross.amount / selectedVariant.pricing.undiscountedPrice.gross.amount) * 100)}% Off
                  </Badge>
                </div>
              ) : selectedVariant?.pricing?.price?.gross ? (
                <span className="text-2xl font-bold text-gold-600 dark:text-gold-400">
                  {formatPrice(selectedVariant.pricing.price.gross.amount, selectedVariant.pricing.price.gross.currency)}
                </span>
              ) : (
                <span className="text-2xl font-bold text-gold-600 dark:text-gold-400">Price TBD</span>
              )}
            </div>
          </div>
          
          {/* Variant selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-8">
              <h3 className="font-medium text-slate-900 dark:text-white mb-3">Select Variant</h3>
              <ProductVariants
                variants={product.variants}
                selectedVariant={selectedVariant}
                onVariantSelect={() => {}}
              />
            </div>
          )}
          
          {/* Quantity selection */}
          <div className="mb-8">
            <h3 className="font-medium text-slate-900 dark:text-white mb-3">Quantity</h3>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center text-slate-900 dark:text-white">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onQuantityChange(quantity + 1)}
                disabled={selectedVariant && quantity >= selectedVariant.quantityAvailable}
                className="border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <Plus className="h-4 w-4" />
              </Button>
              
              {selectedVariant && (
                <span className="ml-4 text-sm text-slate-500 dark:text-slate-400">
                  {selectedVariant.quantityAvailable > 0 
                    ? `Stock: ${selectedVariant.quantityAvailable}` 
                    : 'Out of stock'}
                </span>
              )}
            </div>
          </div>
          
          {/* Add to cart button */}
          <div className="mb-8">
            <Button
              className="w-full h-12 bg-gold-600 hover:bg-gold-700 text-white dark:bg-gold-500 dark:hover:bg-gold-600"
              disabled={isAddingToCart || !selectedVariant || selectedVariant.quantityAvailable <= 0}
              onClick={onAddToCart}
            >
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
          
          {/* Product description */}
          <div className="mb-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="description" className="border-slate-200 dark:border-slate-700">
                <AccordionTrigger className="text-slate-900 dark:text-white">Description</AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-300">
                  <div dangerouslySetInnerHTML={{ __html: productDetails.description }} />
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="specifications" className="border-slate-200 dark:border-slate-700">
                <AccordionTrigger className="text-slate-900 dark:text-white">Specifications</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-4">
                    {productDetails.attributes.map((attr: any, index: number) => (
                      <div key={index} className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{attr.attribute.name}</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">{attr.values[0].name}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="shipping" className="border-slate-200 dark:border-slate-700">
                <AccordionTrigger className="text-slate-900 dark:text-white">Shipping & Returns</AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-300">
                  <p className="mb-2">Free standard shipping on all orders.</p>
                  <p className="mb-2">Delivery time: 3-5 business days.</p>
                  <p>Returns accepted within 30 days of delivery.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          {/* Product gallery */}
          <div className="mb-8">
            <h3 className="font-medium text-slate-900 dark:text-white mb-4">Product Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.media && product.media.map((media: any, index: number) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden">
                  <Image 
                    src={media.url} 
                    alt={`${product.name} - Image ${index + 1}`}
                    width={300}
                    height={300}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Specs overlay */}
      <AnimatePresence>
        {showSpecs && (
          <motion.div 
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white dark:bg-slate-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Product Specifications</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowSpecs(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {productDetails.attributes.map((attr: any, index: number) => (
                    <div key={index} className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{attr.attribute.name}</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{attr.values[0].name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 