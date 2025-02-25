import { GraphQLClient } from 'graphql-request'
import { LRUCache } from '@/lib/utils/lru-cache'
import { handleNetworkError, handleAuthError, handleServerError } from '@/lib/utils/error-handler'

const endpoint = process.env.NEXT_PUBLIC_API_URI!

// 创建一个获取认证头的函数
const getAuthHeaders = (): Record<string, string> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
  
  // 如果 token 存在，验证其格式
  if (token) {
    try {
      // 简单验证 token 格式（JWT 通常由三部分组成，用点分隔）
      if (token.split('.').length !== 3) {
        console.warn('Invalid token format detected, removing token')
        localStorage.removeItem('authToken')
        return { 'Content-Type': 'application/json' }
      }
      
      // 添加认证头
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    } catch (error) {
      console.error('Token validation error:', error)
      localStorage.removeItem('authToken')
      return { 'Content-Type': 'application/json' }
    }
  }

  return { 'Content-Type': 'application/json' }
}

// 创建 LRU 缓存，限制最大缓存项数为 100
const cache = new LRUCache<string, { data: any, expiry: number }>(100)

// 生成缓存键
const generateCacheKey = (query: string, variables: any = {}) => {
  const variableString = Object.entries(variables)
    .filter(([_, value]) => value !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${JSON.stringify(value)}`)
    .join(',')
  return `${query}:${variableString}`
}

// 检查响应是否可缓存
const isCacheable = (query: string) => {
  // 不缓存的查询类型
  const nonCacheableQueries = [
    'mutation',
    'login',
    'register',
    'checkout',
    'cart',
    'order'
  ]
  
  return !nonCacheableQueries.some(q => 
    query.trim().toLowerCase().includes(q)
  )
}

// 获取缓存过期时间
const getCacheExpiry = (query: string) => {
  // 为不同类型的查询设置不同的缓存时间
  if (query.includes('category')) {
    return 10 * 60 * 1000 // 分类数据缓存10分钟
  }
  if (query.includes('products')) {
    return 5 * 60 * 1000 // 商品数据缓存5分钟
  }
  if (query.includes('search')) {
    return 2 * 60 * 1000 // 搜索结果缓存2分钟
  }
  if (query.includes('attributes')) {
    return 30 * 60 * 1000 // 属性数据缓存30分钟
  }
  return 5 * 60 * 1000 // 默认缓存5分钟
}

// 清理过期缓存
const cleanExpiredCache = () => {
  const now = Date.now()
  cache.getStats()
  for (const key of Object.keys(cache.getStats())) {
    const cachedItem = cache.get(key as any)
    if (cachedItem && cachedItem.expiry < now) {
      cache.delete(key as any)
    }
  }
}

// 定期清理过期缓存
if (typeof window !== 'undefined') {
  setInterval(cleanExpiredCache, 5 * 60 * 1000)
}

export const graphqlClient = new GraphQLClient(endpoint, {
  credentials: 'include',
  headers: getAuthHeaders(),
})

// 用于自动生成代码的客户端函数
export const autoGraphqlClient = <T, V>(document: any, variables?: V) => {
  return async () => {
    return graphqlRequestClient(document, variables as any) as Promise<T>
  }
}

// 原始的请求函数，用于兼容现有代码
export const graphqlRequestClient = async (query: any, variables = {}) => {
  try {
    // 每次请求时更新 headers
    const headers = getAuthHeaders()
    graphqlClient.setHeaders(headers)
    
    // 获取查询字符串
    const queryStr = typeof query === 'string' ? query : query.loc?.source.body || ''
    
    // 检查是否可以使用缓存
    if (isCacheable(queryStr)) {
      const cacheKey = generateCacheKey(queryStr, variables)
      const cachedData = cache.get(cacheKey)
      
      if (cachedData) {
        const { data, expiry } = cachedData
        if (expiry > Date.now()) {
          console.log('Cache hit:', cacheKey)
          return data
        } else {
          // 清除过期缓存
          cache.delete(cacheKey)
        }
      }
    }

    // 打印请求信息（仅在开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.log('GraphQL Request:', {
        query: queryStr.substring(0, 100) + '...',
        variables,
        endpoint,
      })
    }

    const response = await graphqlClient.request(query, variables)

    // 缓存响应
    if (isCacheable(queryStr)) {
      const cacheKey = generateCacheKey(queryStr, variables)
      cache.set(cacheKey, {
        data: response,
        expiry: Date.now() + getCacheExpiry(queryStr)
      })
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Cached response:', cacheKey)
        console.log('Cache stats:', cache.getStats())
      }
    }

    return response
  } catch (error: any) {
    // 处理特定的错误类型
    if (error.message?.includes('Signature has expired')) {
      // 清除过期的 token
      localStorage.removeItem('authToken')
      // 清除相关缓存
      cache.clear()
      return handleAuthError(error, { 
        context: 'GraphQL Request',
        throwError: true
      })
    }

    // 如果是认证错误
    if (error.message?.includes('AUTHENTICATED')) {
      console.error('Authentication error:', error.message)
      // 提供友好的用户提示
      return { error: '请先登录后再访问此内容' }
    }
    
    // 如果是 GraphQL 错误，提供更好的错误信息
    if (error.response?.errors) {
      const graphqlError = error.response.errors[0]
      console.error('GraphQL error:', graphqlError)
      return { error: graphqlError.message || '获取数据失败，请稍后重试' }
    }

    // 网络错误或其他错误
    console.error('Network error:', error)
    return { error: '网络连接失败，请检查您的网络连接' }
  }
} 