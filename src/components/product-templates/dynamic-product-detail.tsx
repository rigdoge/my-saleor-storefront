'use client'

import { useProductTemplateSelection } from '@/lib/hooks/use-product-template-selection'
import { ProductTemplate1, ProductTemplate2, ProductTemplate3, ProductTemplate4, ProductTemplate5, ProductTemplate6 } from '@/components/product-templates'
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
  // 使用forceUpdate状态用来强制组件重新渲染
  const [, setForceUpdate] = useState(0)
  const { selectedTemplate, isLoaded } = useProductTemplateSelection()
  const [mounted, setMounted] = useState(false)
  
  // 确保组件仅在客户端渲染，避免水合不匹配问题
  useEffect(() => {
    setMounted(true)
    
    // 监听产品模板变更事件
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedProductTemplate') {
        // 强制组件重新渲染
        setForceUpdate(prev => prev + 1)
      }
    }
    
    // 添加localStorage变更监听
    window.addEventListener('storage', handleStorageChange)
    
    // 监听自定义模板变更事件
    const handleTemplateChange = () => {
      // 强制组件重新渲染
      setForceUpdate(prev => prev + 1)
    }
    
    window.addEventListener('product-template-change', handleTemplateChange)
    
    // 清理函数
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('product-template-change', handleTemplateChange)
    }
  }, [])
  
  if (!mounted || !isLoaded) {
    // 显示默认模板直到客户端加载完成
    return <ProductTemplate1 {...props} />
  }
  
  // 使用switch语句而不是条件渲染，更易于维护
  switch (selectedTemplate) {
    case 'template1':
      return (
        <>
          <ProductTemplate1 {...props} />
          <ProductTemplateSelector />
        </>
      )
    case 'template2':
      return (
        <>
          <ProductTemplate2 {...props} />
          <ProductTemplateSelector />
        </>
      )
    case 'template3':
      return (
        <>
          <ProductTemplate3 {...props} />
          <ProductTemplateSelector />
        </>
      )
    case 'template4':
      return (
        <>
          <ProductTemplate4 {...props} />
          <ProductTemplateSelector />
        </>
      )
    case 'template5':
      return (
        <>
          <ProductTemplate5 {...props} />
          <ProductTemplateSelector />
        </>
      )
    case 'template6':
      return (
        <>
          <ProductTemplate6 {...props} />
          <ProductTemplateSelector />
        </>
      )
    default:
      return (
        <>
          <ProductTemplate1 {...props} />
          <ProductTemplateSelector />
        </>
      )
  }
} 