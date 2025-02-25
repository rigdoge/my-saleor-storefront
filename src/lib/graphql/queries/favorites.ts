import { gql } from 'graphql-request'

// 使用用户元数据存储收藏
export const USER_FAVORITES_QUERY = gql`
  query UserFavorites {
    me {
      id
      metadata {
        key
        value
      }
    }
  }
`

// 使用更新用户元数据来添加收藏
export const ADD_TO_FAVORITES_MUTATION = gql`
  mutation UpdateUserMetadata($id: ID!, $input: [MetadataInput!]!) {
    updateMetadata(id: $id, input: $input) {
      item {
        ... on User {
          id
          metadata {
            key
            value
          }
        }
      }
      errors {
        field
        message
      }
    }
  }
`

// 使用更新用户元数据来移除收藏
export const REMOVE_FROM_FAVORITES_MUTATION = gql`
  mutation UpdateUserMetadata($id: ID!, $input: [MetadataInput!]!) {
    updateMetadata(id: $id, input: $input) {
      item {
        ... on User {
          id
          metadata {
            key
            value
          }
        }
      }
      errors {
        field
        message
      }
    }
  }
`

// 辅助函数：获取收藏列表
export const getFavorites = (metadata: any[]) => {
  const favoritesMetadata = metadata.find(item => item.key === 'favorites')
  if (!favoritesMetadata) return []
  try {
    return JSON.parse(favoritesMetadata.value)
  } catch (e) {
    return []
  }
}

// 辅助函数：检查产品是否已收藏
export const isProductFavorite = (metadata: any[], productId: string) => {
  const favorites = getFavorites(metadata)
  return favorites.includes(productId)
} 