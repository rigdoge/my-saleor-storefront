"use client"

import { useState, useEffect } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: {
    serialize?: (value: T) => string
    deserialize?: (value: string) => T
    onError?: (error: Error) => void
  }
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // 自定义序列化和反序列化函数
  const serialize = options?.serialize || JSON.stringify
  const deserialize = options?.deserialize || JSON.parse
  const onError = options?.onError || console.error

  // 创建状态，如果localStorage中有值则使用，否则使用初始值
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? deserialize(item) : initialValue
    } catch (error) {
      onError(error instanceof Error ? error : new Error(String(error)))
      return initialValue
    }
  })

  // 返回一个包装版的setState函数，同时更新localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // 允许值是一个函数，类似于useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      
      // 保存到state
      setStoredValue(valueToStore)
      
      // 保存到localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, serialize(valueToStore))
      }
    } catch (error) {
      onError(error instanceof Error ? error : new Error(String(error)))
    }
  }

  // 清除存储的值
  const removeValue = () => {
    try {
      // 从localStorage中移除
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
      
      // 重置为初始值
      setStoredValue(initialValue)
    } catch (error) {
      onError(error instanceof Error ? error : new Error(String(error)))
    }
  }

  // 当key变化时，更新存储的值
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(deserialize(e.newValue))
        } catch (error) {
          onError(error instanceof Error ? error : new Error(String(error)))
        }
      } else if (e.key === key && e.newValue === null) {
        setStoredValue(initialValue)
      }
    }

    // 监听storage事件，以便在其他标签页中更新数据时同步
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, initialValue, deserialize, onError])

  return [storedValue, setValue, removeValue]
} 