'use client'

import { useState, useEffect } from 'react'

type ProductTemplateType = 'template1' | 'template2' | 'template3'

export function useProductTemplateSelection() {
  const [selectedTemplate, setSelectedTemplate] = useState<ProductTemplateType>('template1')
  const [isLoaded, setIsLoaded] = useState(false)
  
  // 当组件挂载时，从localStorage加载保存的选择
  useEffect(() => {
    const savedTemplate = localStorage.getItem('selectedProductTemplate') as ProductTemplateType
    if (savedTemplate) {
      setSelectedTemplate(savedTemplate)
    }
    setIsLoaded(true)
  }, [])
  
  // 保存选择到localStorage
  const selectTemplate = (template: ProductTemplateType) => {
    setSelectedTemplate(template)
    localStorage.setItem('selectedProductTemplate', template)
  }
  
  return {
    selectedTemplate,
    selectTemplate,
    isLoaded
  }
} 