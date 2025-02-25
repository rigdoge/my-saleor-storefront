'use client'

import { useState, useEffect } from 'react'

type HomepageType = 'homepage1' | 'homepage2' | 'homepage3'

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
  }, [])
  
  // 保存选择到localStorage
  const selectHomepage = (homepage: HomepageType) => {
    setSelectedHomepage(homepage)
    localStorage.setItem('selectedHomepage', homepage)
  }
  
  return {
    selectedHomepage,
    selectHomepage,
    isLoaded
  }
} 