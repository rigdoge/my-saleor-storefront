import { GraphQLClient } from 'graphql-request'
import { LRUCache } from '@/lib/utils/lru-cache'
import { handleNetworkError, handleAuthError, handleServerError } from '@/lib/utils/error-handler'

const endpoint = process.env.NEXT_PUBLIC_API_URI!

// 添加基本的 API 健康检查查询
const API_HEALTH_CHECK = `
  query {
    shop {
      name
      version
    }
  }
`

// 创建一个获取认证头的函数
const getAuthHeaders = () => {
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
    } catch (error) {
      console.error('Token validation error:', error)
      localStorage.removeItem('authToken')
      return { 'Content-Type': 'application/json' }
    }
  }

  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  }
}

// 创建 LRU 缓存，限制最大缓存项数为 100
const cache = new LRUCache<string, { data: any, expiry: number }>(100)

// 添加请求超时和重试配置
const REQUEST_TIMEOUT = 10000 // 10秒超时
const MAX_RETRIES = 2 // 最大重试次数

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
  for (const [key, value] of Object.entries(cache.getStats())) {
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

// 测试 API 连接
export const testApiConnection = async () => {
  try {
    const response = await graphqlRequestClient(API_HEALTH_CHECK)
    console.log('API Connection Test:', response)
    return response
  } catch (error) {
    handleNetworkError(error, { 
      context: 'API Connection Test',
      throwError: true
    })
  }
}

export const graphqlRequestClient = async (query: string, variables = {}, retryCount = 0): Promise<any> => {
  try {
    // 每次请求时更新 headers
    const headers = getAuthHeaders()
    graphqlClient.setHeaders(headers)
    
    // 检查是否可以使用缓存
    if (isCacheable(query)) {
      const cacheKey = generateCacheKey(query, variables)
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
        query: query.substring(0, 100) + '...',
        variables,
        endpoint,
      })
    }

    // 添加超时处理
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('请求超时，请稍后重试'))
      }, REQUEST_TIMEOUT)
    })

    // 执行请求
    const responsePromise = graphqlClient.request(query, variables)
    const response = await Promise.race([responsePromise, timeoutPromise]) as any

    // 缓存响应
    if (isCacheable(query)) {
      const cacheKey = generateCacheKey(query, variables)
      cache.set(cacheKey, {
        data: response,
        expiry: Date.now() + getCacheExpiry(query)
      })
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Cached response:', cacheKey)
        console.log('Cache stats:', cache.getStats())
      }
    }

    return response
  } catch (error: any) {
    // 处理超时和网络错误的重试逻辑
    if ((error.message?.includes('timeout') || error.message?.includes('network') || error.message?.includes('超时')) 
        && retryCount < MAX_RETRIES) {
      console.log(`请求失败，正在进行第 ${retryCount + 1} 次重试...`)
      // 指数退避重试
      const delay = Math.pow(2, retryCount) * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
      return graphqlRequestClient(query, variables, retryCount + 1)
    }

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

    // 如果是认证错误，返回模拟数据用于开发
    if (error.message?.includes('AUTHENTICATED') && process.env.NODE_ENV === 'development') {
      return {
        channels: [
          {
            id: 'default',
            name: 'Default Channel',
            slug: 'default-channel',
            currencyCode: 'CNY',
            languageCode: 'zh-CN',
            isActive: true,
            defaultCountry: {
              code: 'CN',
              country: 'China'
            }
          }
        ]
      }
    }

    // 如果是 GraphQL 错误，提供更好的错误信息
    if (error.response?.errors) {
      const graphqlError = error.response.errors[0]
      return handleServerError(
        new Error(graphqlError.message || '操作失败，请稍后重试'), 
        { context: 'GraphQL Error' }
      )
    }

    // 网络错误或其他错误
    return handleNetworkError(
      error, 
      { context: 'GraphQL Request' }
    )
  }
} 