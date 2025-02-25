# GraphQL 查询修复指南

根据 Saleor 3.20 版本的 API，我们需要修复以下查询文件：

## 1. 修复 `src/lib/graphql/queries/favorites.ts`

Saleor 3.20 不支持 `favorites` 字段和相关的 mutation。我们需要使用自定义元数据来实现收藏功能：

```typescript
import { gql } from 'graphql-request'

// 使用用户元数据存储收藏
export const USER_FAVORITES_QUERY = gql`
  query UserFavorites {
    me {
      metadata {
        key
        value
      }
    }
  }
`

// 使用更新用户元数据来添加收藏
export const ADD_TO_FAVORITES_MUTATION = gql`
  mutation UpdateUserMetadata($input: [MetadataInput!]!) {
    updateMetadata(input: $input) {
      user {
        id
        metadata {
          key
          value
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
  mutation UpdateUserMetadata($input: [MetadataInput!]!) {
    updateMetadata(input: $input) {
      user {
        id
        metadata {
          key
          value
        }
      }
      errors {
        field
        message
      }
    }
  }
`
```

然后，您需要修改收藏相关的逻辑：

```typescript
// 获取收藏列表
const getFavorites = (metadata) => {
  const favoritesMetadata = metadata.find(item => item.key === 'favorites')
  if (!favoritesMetadata) return []
  try {
    return JSON.parse(favoritesMetadata.value)
  } catch (e) {
    return []
  }
}

// 添加收藏
const addToFavorites = async (productId) => {
  const { me } = await graphqlRequestClient(USER_FAVORITES_QUERY)
  const favorites = getFavorites(me.metadata)
  
  if (!favorites.includes(productId)) {
    favorites.push(productId)
  }
  
  return graphqlRequestClient(ADD_TO_FAVORITES_MUTATION, {
    input: [{ key: 'favorites', value: JSON.stringify(favorites) }]
  })
}

// 移除收藏
const removeFromFavorites = async (productId) => {
  const { me } = await graphqlRequestClient(USER_FAVORITES_QUERY)
  const favorites = getFavorites(me.metadata)
  
  const updatedFavorites = favorites.filter(id => id !== productId)
  
  return graphqlRequestClient(REMOVE_FROM_FAVORITES_MUTATION, {
    input: [{ key: 'favorites', value: JSON.stringify(updatedFavorites) }]
  })
}
```

## 2. 修复 `src/lib/graphql/queries/orders.ts`

Saleor 3.20 不支持 `paymentMethod` 字段，我们需要使用 `payments` 字段：

```typescript
// 修改 USER_ORDERS_QUERY
export const USER_ORDERS_QUERY = gql`
  query UserOrders($first: Int!) {
    me {
      orders(first: $first) {
        edges {
          node {
            id
            number
            created
            status
            total {
              gross {
                amount
                currency
              }
            }
            payments {
              id
              gateway
              paymentMethodType
            }
            lines {
              id
              productName
              variantName
              quantity
              thumbnail {
                url
                alt
              }
              unitPrice {
                gross {
                  amount
                  currency
                }
              }
            }
          }
        }
      }
    }
  }
`

// 修改 ORDER_BY_ID_QUERY
export const ORDER_BY_ID_QUERY = gql`
  query OrderById($id: ID!) {
    order(id: $id) {
      id
      number
      created
      status
      shippingAddress {
        firstName
        lastName
        streetAddress1
        streetAddress2
        city
        countryArea
        postalCode
        country {
          code
          country
        }
        phone
      }
      billingAddress {
        firstName
        lastName
        streetAddress1
        streetAddress2
        city
        countryArea
        postalCode
        country {
          code
          country
        }
        phone
      }
      total {
        gross {
          amount
          currency
        }
      }
      subtotal {
        gross {
          amount
          currency
        }
      }
      shippingPrice {
        gross {
          amount
          currency
        }
      }
      payments {
        id
        gateway
        paymentMethodType
        chargeStatus
        creditCard {
          brand
          lastDigits
          expMonth
          expYear
        }
      }
      lines {
        id
        productName
        variantName
        quantity
        thumbnail {
          url
          alt
        }
        unitPrice {
          gross {
            amount
            currency
          }
        }
        totalPrice {
          gross {
            amount
            currency
          }
        }
      }
    }
  }
`
```

然后，您需要修改订单相关的逻辑，将 `paymentMethod` 替换为从 `payments` 中提取的信息：

```typescript
// 获取支付方式
const getPaymentMethod = (order) => {
  if (!order.payments || order.payments.length === 0) return '未指定'
  
  const payment = order.payments[0]
  return payment.gateway || payment.paymentMethodType || '未指定'
}
```

## 3. 修复 `src/lib/graphql/queries/categories.ts`

我们已经修复了 `categories` 查询，移除了顶级的 `channel` 参数：

```typescript
export const CATEGORIES_QUERY = gql`
  query Categories($first: Int!, $channel: String!) {
    categories(first: $first, level: 0) {
      edges {
        node {
          id
          name
          slug
          description
          backgroundImage {
            url
            alt
          }
          children(first: 100) {
            edges {
              node {
                id
                name
                slug
                description
                products(first: 0, channel: $channel) {
                  totalCount
                }
              }
            }
          }
          products(first: 0, channel: $channel) {
            totalCount
          }
        }
      }
    }
  }
`
```

## 4. 运行代码生成

修复所有查询后，运行代码生成命令：

```bash
npm run generate
```

## 5. 迁移到自动生成的代码

按照 `MIGRATION_GUIDE.md` 中的步骤，将现有代码迁移到使用自动生成的代码。 