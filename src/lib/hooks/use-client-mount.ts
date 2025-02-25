'use client'

import { useState, useEffect } from 'react'

/**
 * 检测组件是否在客户端挂载的hook
 * 用于解决服务器端渲染和客户端渲染不一致的问题
 * @returns {boolean} 是否已挂载
 */
export function useClientMount() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  return mounted
} 