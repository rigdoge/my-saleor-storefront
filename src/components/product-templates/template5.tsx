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

  // Convert GraphQL returned attributes to the format expected by ProductDetails component
  const productDetails = {
    description: product.description || '',
    attributes: product.attributes || [],
    metadata: product.metadata || [],
    category: product.category || { name: '' }
  }

  // Get category information, use default if not available
  const categoryName = product.category?.name || 'Travel'
  const subCategoryName = productDetails.metadata.find((m: any) => m.key === 'subCategory')?.value || 'Bags'

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb navigation */}
      <div className="mb-8 text-sm flex gap-2">
        <span className="text-gray-500 dark:text-gray-400">{categoryName}</span>
        <span className="text-gray-500 dark:text-gray-400">/</span>
        <span className="text-gray-500 dark:text-gray-400">{subCategoryName}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Left: Product information area */}
        <div className="flex flex-col">
          {/* Product title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{product.name}</h1>
          
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
              </div>
            ) : selectedVariant?.pricing?.price?.gross ? (
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatPrice(selectedVariant.pricing.price.gross.amount, selectedVariant.pricing.price.gross.currency)}
              </span>
            ) : (
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">Price TBD</span>
            )}
          </div>
          
          {/* Description */}
          <div className="mb-8">
            <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: productDetails.description }} />
          </div>
          
          {/* Features */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Features</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                  <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full"></div>
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="ml-3 text-gray-600 dark:text-gray-300">Premium materials for durability and comfort</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                  <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full"></div>
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="ml-3 text-gray-600 dark:text-gray-300">Thoughtfully designed for everyday use</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                  <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full"></div>
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="ml-3 text-gray-600 dark:text-gray-300">Versatile design that complements any style</p>
              </li>
            </ul>
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
          
          {/* Add to cart button */}
          <div className="mb-8">
            <Button
              className="w-full py-3 bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white"
              disabled={isAddingToCart || !selectedVariant || selectedVariant.quantityAvailable <= 0}
              onClick={onAddToCart}
            >
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
          
          {/* Shipping information */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Secure checkout</span>
            </div>
            <div className="flex items-center">
              <HelpCircle className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Questions? Contact our support team</span>
            </div>
          </div>
        </div>
        
        {/* Right: Product gallery area */}
        <div>
          <ProductGallery media={product.media || []} />
        </div>
      </div>
    </div>
  )
} 