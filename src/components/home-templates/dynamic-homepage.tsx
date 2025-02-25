'use client'

import { useHomepageSelection } from '@/lib/hooks/use-homepage-selection'
import { Homepage1, Homepage2, Homepage3 } from '@/components/home-templates'
import { HomepageSelector } from './homepage-selector'
import { useEffect, useState } from 'react'

export function DynamicHomepage() {
  const { selectedHomepage, isLoaded } = useHomepageSelection()
  const [mounted, setMounted] = useState(false)
  
  // 确保组件仅在客户端渲染，避免水合不匹配问题
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted || !isLoaded) {
    // 显示默认首页直到客户端加载完成
    return <Homepage1 />
  }
  
  return (
    <>
      {selectedHomepage === 'homepage1' && <Homepage1 />}
      {selectedHomepage === 'homepage2' && <Homepage2 />}
      {selectedHomepage === 'homepage3' && <Homepage3 />}
      <HomepageSelector />
    </>
  )
} 