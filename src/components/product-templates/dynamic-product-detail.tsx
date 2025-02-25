'use client'

import { useProductTemplateSelection } from '@/lib/hooks/use-product-template-selection'
import { ProductTemplate1, ProductTemplate2, ProductTemplate3 } from '@/components/product-templates'
import { ProductTemplateSelector } from './template-selector'
import { useEffect, useState } from 'react'

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
  const { selectedTemplate, isLoaded } = useProductTemplateSelection()
  const [mounted, setMounted] = useState(false)
  
  // 确保组件仅在客户端渲染，避免水合不匹配问题
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted || !isLoaded) {
    // 显示默认模板直到客户端加载完成
    return <ProductTemplate1 {...props} />
  }
  
  return (
    <>
      {selectedTemplate === 'template1' && <ProductTemplate1 {...props} />}
      {selectedTemplate === 'template2' && <ProductTemplate2 {...props} />}
      {selectedTemplate === 'template3' && <ProductTemplate3 {...props} />}
      <ProductTemplateSelector />
    </>
  )
} 