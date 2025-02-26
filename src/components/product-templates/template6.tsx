'use client'

import React from 'react'
import { ProductTemplateProps } from './dynamic-product-detail'
import { Button } from '@/components/ui/button'
import { Check, Heart, ShoppingCart } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { ProductGallery } from '@/components/product/product-gallery'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

  // Convert GraphQL returned attributes to the format expected by ProductDetails component
  const productDetails = {
    description: product.description || '',
    attributes: product.attributes || [],
    metadata: product.metadata || [],
    category: product.category || { name: '' }
  }

  // Get category information, use default if not available
  const categoryName = product.category?.name || 'Fashion'
  const subCategoryName = productDetails.metadata.find((m: any) => m.key === 'subCategory')?.value || 'Clothing'

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb navigation */}
      <div className="mb-8 text-sm flex gap-2">
        <span className="text-gray-500 dark:text-gray-400">{categoryName}</span>
        <span className="text-gray-500 dark:text-gray-400">/</span>
        <span className="text-gray-500 dark:text-gray-400">{subCategoryName}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Left: Product gallery area */}
        <div>
          <ProductGallery media={product.media || []} />
        </div>
        
        {/* Right: Product information area */}
        <div className="flex flex-col">
          {/* Product title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{product.name}</h1>
          
          {/* Product subtitle */}
          <p className="text-gray-500 dark:text-gray-400 mb-4">Premium quality, handcrafted with care</p>
          
          {/* Price */}
          <div className="mb-6">
            {selectedVariant?.pricing?.discount?.gross ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatPrice(selectedVariant.pricing.price.gross.amount, selectedVariant.pricing.price.gross.currency)}
                </span>
                <span className="text-gray-500 dark:text-gray-400 line-through text-sm">
                  {formatPrice(
                    selectedVariant.pricing.undiscountedPrice.gross.amount,
                    selectedVariant.pricing.undiscountedPrice.gross.currency
                  )}
                </span>
                <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs px-2 py-1 rounded-full">
                  Sale
                </span>
              </div>
            ) : selectedVariant?.pricing?.price?.gross ? (
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatPrice(selectedVariant.pricing.price.gross.amount, selectedVariant.pricing.price.gross.currency)}
              </span>
            ) : (
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">Price TBD</span>
            )}
          </div>
          
          {/* Short description */}
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300">
              {productDetails.description.substring(0, 150)}...
            </p>
          </div>
          
          {/* Quantity selection */}
          <div className="mb-6">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quantity
            </label>
            <div className="flex items-center">
              <button
                type="button"
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="text"
                id="quantity"
                className="p-2 w-12 text-center border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                value={quantity}
                readOnly
              />
              <button
                type="button"
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-r-md bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => onQuantityChange(quantity + 1)}
                disabled={selectedVariant && quantity >= selectedVariant.quantityAvailable}
              >
                +
              </button>
              
              {selectedVariant && (
                <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                  {selectedVariant.quantityAvailable > 0 
                    ? `${selectedVariant.quantityAvailable} available` 
                    : 'Out of stock'}
                </span>
              )}
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-4 mb-8">
            <Button
              className="flex-1 bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white"
              disabled={isAddingToCart || !selectedVariant || selectedVariant.quantityAvailable <= 0}
              onClick={onAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </Button>
            <Button
              variant="outline"
              className="px-4 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={onToggleFavorite}
            >
              <Heart className={cn("h-4 w-4", isFavorite ? "fill-red-500 text-red-500" : "")} />
            </Button>
          </div>
          
          {/* Product benefits */}
          <div className="mb-8 space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full"></div>
                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="ml-3 text-gray-600 dark:text-gray-300">Free shipping on orders over $100</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full"></div>
                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="ml-3 text-gray-600 dark:text-gray-300">30-day money-back guarantee</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full"></div>
                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="ml-3 text-gray-600 dark:text-gray-300">Secure checkout</p>
            </div>
          </div>
          
          {/* Product details tabs */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="description" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Description</TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Details</TabsTrigger>
              <TabsTrigger value="shipping" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="p-4 border rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: productDetails.description }} />
            </TabsContent>
            <TabsContent value="details" className="p-4 border rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Product Specifications</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  {productDetails.attributes.map((attr: any, index: number) => (
                    <li key={index} className="flex justify-between">
                      <span className="font-medium">{attr.attribute.name}:</span>
                      <span>{attr.values[0].name}</span>
                    </li>
                  ))}
                  {productDetails.attributes.length === 0 && (
                    <li>No specifications available</li>
                  )}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="p-4 border rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>We offer the following shipping options:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Standard Shipping (3-5 business days): $5.99</li>
                  <li>Express Shipping (1-2 business days): $12.99</li>
                  <li>Free Standard Shipping on orders over $100</li>
                </ul>
                <p>International shipping available to select countries.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 