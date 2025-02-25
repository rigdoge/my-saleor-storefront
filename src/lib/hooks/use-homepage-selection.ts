'use client'

import { useState, useEffect } from 'react'

type HomepageType = 'homepage1' | 'homepage2' | 'homepage3'

// 创建一个自定义事件，用于通知首页样式变更
const HOMEPAGE_CHANGE_EVENT = 'homepage-style-change'

export function useHomepageSelection() {
  const [selectedHomepage, setSelectedHomepage] = useState<HomepageType>('homepage1')
  const [isLoaded, setIsLoaded] = useState(false)
  
  // 当组件挂载时，从localStorage加载保存的选择
  useEffect(() => {
    const savedHomepage = localStorage.getItem('selectedHomepage') as HomepageType
    if (savedHomepage) {
      setSelectedHomepage(savedHomepage)
    }
    setIsLoaded(true)
    
    // 添加事件监听器，监听首页样式变更事件
    const handleHomepageChange = (e: CustomEvent) => {
      const newHomepage = e.detail as HomepageType
      setSelectedHomepage(newHomepage)
    }
    
    window.addEventListener(HOMEPAGE_CHANGE_EVENT, handleHomepageChange as EventListener)
    
    // 清理函数
    return () => {
      window.removeEventListener(HOMEPAGE_CHANGE_EVENT, handleHomepageChange as EventListener)
    }
  }, [])
  
  // 保存选择到localStorage并触发自定义事件
  const selectHomepage = (homepage: HomepageType) => {
    setSelectedHomepage(homepage)
    localStorage.setItem('selectedHomepage', homepage)
    
    // 触发自定义事件，通知其他组件首页样式已更改
    const event = new CustomEvent(HOMEPAGE_CHANGE_EVENT, { detail: homepage })
    window.dispatchEvent(event)
  }
  
  return {
    selectedHomepage,
    selectHomepage,
    isLoaded
  }
} 