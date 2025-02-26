'use client'

import React, { useState } from 'react'
import { ProductTemplate1 } from './template1'
import { ProductTemplate2 } from './template2'
import { ProductTemplate3 } from './template3'
import { ProductTemplate4 } from './template4'
import { ProductTemplate5 } from './template5'
import { ProductTemplate6 } from './template6'
import { ProductTemplateSelector } from './template-selector'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'

// 定义统一的产品详情页接口
export interface ProductTemplateProps {
  product: any
  selectedVariant: any
  quantity: number
  onQuantityChange: (quantity: number) => void
  onAddToCart: () => void
  onToggleFavorite: () => void
  isFavorite: boolean
  isAddingToCart: boolean
}

export function DynamicProductDetail(props: ProductTemplateProps) {
  // Use local storage to persist template selection
  const [selectedTemplate, setSelectedTemplate] = useLocalStorage<number>(
    'product-template-selection',
    1
  )

  // Render the selected template component
  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 1:
        return <ProductTemplate1 {...props} />
      case 2:
        return <ProductTemplate2 {...props} />
      case 3:
        return <ProductTemplate3 {...props} />
      case 4:
        return <ProductTemplate4 {...props} />
      case 5:
        return <ProductTemplate5 {...props} />
      case 6:
        return <ProductTemplate6 {...props} />
      default:
        return <ProductTemplate1 {...props} />
    }
  }

  return (
    <div className="relative bg-white dark:bg-gray-900 min-h-screen">
      {renderTemplate()}
      <ProductTemplateSelector 
        onSelectTemplate={setSelectedTemplate} 
        currentTemplate={selectedTemplate} 
      />
    </div>
  )
} 