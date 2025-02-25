'use client'

import { useHomepageSelection } from '@/lib/hooks/use-homepage-selection'
import { Homepage1, Homepage2, Homepage3 } from '@/components/home-templates'
import { HomepageSelector } from './homepage-selector'
import { useEffect, useState } from 'react'

export function DynamicHomepage() {
  // 添加强制更新状态
  const [, setForceUpdate] = useState(0)
  const { selectedHomepage, isLoaded } = useHomepageSelection()
  const [mounted, setMounted] = useState(false)
  
  // 确保组件仅在客户端渲染，避免水合不匹配问题
  useEffect(() => {
    setMounted(true)
    
    // 监听首页样式变更事件
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedHomepage') {
        // 强制组件重新渲染
        setForceUpdate(prev => prev + 1)
      }
    }
    
    // 添加localStorage变更监听
    window.addEventListener('storage', handleStorageChange)
    
    // 监听自定义首页样式变更事件
    const handleHomepageChange = () => {
      // 强制组件重新渲染
      setForceUpdate(prev => prev + 1)
    }
    
    window.addEventListener('homepage-style-change', handleHomepageChange)
    
    // 清理函数
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('homepage-style-change', handleHomepageChange)
    }
  }, [])
  
  if (!mounted || !isLoaded) {
    // 显示默认首页直到客户端加载完成
    return <Homepage1 />
  }
  
  // 使用switch语句而不是条件渲染，更易于维护
  switch (selectedHomepage) {
    case 'homepage1':
      return (
        <>
          <Homepage1 />
          <HomepageSelector />
        </>
      )
    case 'homepage2':
      return (
        <>
          <Homepage2 />
          <HomepageSelector />
        </>
      )
    case 'homepage3':
      return (
        <>
          <Homepage3 />
          <HomepageSelector />
        </>
      )
    default:
      return (
        <>
          <Homepage1 />
          <HomepageSelector />
        </>
      )
  }
} 