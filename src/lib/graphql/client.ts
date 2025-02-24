import { GraphQLClient } from 'graphql-request'

const endpoint = process.env.NEXT_PUBLIC_API_URI!

export const graphqlClient = new GraphQLClient(endpoint, {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const graphqlRequestClient = async (query: string, variables = {}) => {
  try {
    return await graphqlClient.request(query, variables)
  } catch (error) {
    console.error('GraphQL Request Error:', error)
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
          },
          {
            id: 'us',
            name: 'US Channel',
            slug: 'us-channel',
            currencyCode: 'USD',
            languageCode: 'en-US',
            isActive: true,
            defaultCountry: {
              code: 'US',
              country: 'United States'
            }
          }
        ]
      }
    }
    throw error
  }
} 