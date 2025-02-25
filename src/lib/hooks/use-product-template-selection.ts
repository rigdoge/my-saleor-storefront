'use client'

import { useState, useEffect } from 'react'

type ProductTemplateType = 'template1' | 'template2' | 'template3' | 'template4' | 'template5' | 'template6'

// 创建一个自定义事件，用于通知模板变更
const TEMPLATE_CHANGE_EVENT = 'product-template-change'

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
    
    // 添加事件监听器，监听模板变更事件
    const handleTemplateChange = (e: CustomEvent) => {
      const newTemplate = e.detail as ProductTemplateType
      setSelectedTemplate(newTemplate)
    }
    
    window.addEventListener(TEMPLATE_CHANGE_EVENT, handleTemplateChange as EventListener)
    
    // 清理函数
    return () => {
      window.removeEventListener(TEMPLATE_CHANGE_EVENT, handleTemplateChange as EventListener)
    }
  }, [])
  
  // 保存选择到localStorage并触发自定义事件
  const selectTemplate = (template: ProductTemplateType) => {
    setSelectedTemplate(template)
    localStorage.setItem('selectedProductTemplate', template)
    
    // 触发自定义事件，通知其他组件模板已更改
    const event = new CustomEvent(TEMPLATE_CHANGE_EVENT, { detail: template })
    window.dispatchEvent(event)
  }
  
  return {
    selectedTemplate,
    selectTemplate,
    isLoaded
  }
} 