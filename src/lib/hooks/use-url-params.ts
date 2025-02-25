'use client'

import { useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useDebounce } from 'use-debounce'

interface UpdateParamsOptions {
  scroll?: boolean
  preserveScroll?: boolean
}

export function useUrlParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // 获取当前URL参数
  const getParam = useCallback((key: string) => {
    return searchParams.get(key)
  }, [searchParams])
  
  // 获取当前URL参数数组
  const getArrayParam = useCallback((key: string): string[] => {
    const param = searchParams.get(key)
    return param ? param.split(',').filter(Boolean) : []
  }, [searchParams])
  
  // 更新URL参数
  const updateParams = useCallback((
    updates: Record<string, string | null>,
    options: UpdateParamsOptions = {}
  ) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    
    // 保存当前滚动位置
    const scrollPosition = options.preserveScroll ? window.scrollY : undefined
    
    // 更新URL
    router.push(`${pathname}?${params.toString()}`, { 
      scroll: options.scroll ?? !options.preserveScroll 
    })
    
    // 如果需要保留滚动位置
    if (options.preserveScroll && scrollPosition !== undefined) {
      window.scrollTo(0, scrollPosition)
    }
  }, [pathname, router, searchParams])
  
  // 防抖更新URL参数
  const [debouncedUpdateParams] = useDebounce(
    (updates: Record<string, string | null>, options?: UpdateParamsOptions) => {
      updateParams(updates, options)
    },
    300
  )
  
  // 重置所有参数
  const resetParams = useCallback(() => {
    router.push(pathname)
  }, [pathname, router])
  
  return {
    getParam,
    getArrayParam,
    updateParams,
    debouncedUpdateParams,
    resetParams,
    searchParams
  }
} 