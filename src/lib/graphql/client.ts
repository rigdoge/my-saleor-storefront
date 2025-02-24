import { GraphQLClient } from 'graphql-request'

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
      if (!token.split('.').length === 3) {
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

export const graphqlClient = new GraphQLClient(endpoint, {
  credentials: 'include',
  headers: getAuthHeaders(),
})

// 测试 API 连接
export const testApiConnection = async () => {
  try {
    const response = await graphqlClient.request(API_HEALTH_CHECK)
    console.log('API Connection Test:', response)
    return response
  } catch (error) {
    console.error('API Connection Test Failed:', error)
    throw error
  }
}

export const graphqlRequestClient = async (query: string, variables = {}) => {
  try {
    // 每次请求时更新 headers
    const headers = getAuthHeaders()
    graphqlClient.setHeaders(headers)
    
    // 打印请求信息
    console.log('GraphQL Request:', {
      query,
      variables,
      endpoint,
      headers
    })

    const response = await graphqlClient.request(query, variables)
    console.log('GraphQL Response:', response)
    return response
  } catch (error: any) {
    console.error('GraphQL Request Error:', {
      message: error.message,
      response: error.response,
      query,
      variables,
      endpoint,
    })

    // 处理特定的错误类型
    if (error.message.includes('Signature has expired')) {
      // 清除过期的 token
      localStorage.removeItem('authToken')
      throw new Error('登录已过期，请重新登录')
    }

    // 如果是认证错误，返回模拟数据用于开发
    if (error.message.includes('AUTHENTICATED')) {
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
      console.error('GraphQL Error Details:', {
        code: graphqlError.code,
        field: graphqlError.field,
        message: graphqlError.message,
      })
      throw new Error(graphqlError.message || '操作失败，请稍后重试')
    }

    // 网络错误或其他错误
    throw new Error(error.message || '请求失败，请检查网络连接')
  }
} 