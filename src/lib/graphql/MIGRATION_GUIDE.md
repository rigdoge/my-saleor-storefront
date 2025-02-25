# 从手动 GraphQL 查询迁移到自动生成代码

本指南将帮助您将现有的手动定义的 GraphQL 查询迁移到使用自动生成的代码。

## 步骤 1: 生成代码

首先，运行代码生成命令：

```bash
npm run generate
```

这将根据您的 GraphQL 查询生成类型定义和 React Query hooks。

## 步骤 2: 导入自动生成的 hooks

在您的组件中，导入自动生成的 hooks：

```typescript
// 旧代码
import { PRODUCTS_QUERY } from '@/lib/graphql/queries/products'
import { graphqlRequestClient } from '@/lib/graphql/client'

// 新代码
import { useProductsQuery } from '@/lib/graphql/__generated__/types'
```

## 步骤 3: 使用自动生成的 hooks

将手动的 GraphQL 查询替换为自动生成的 hooks：

### 服务器组件示例

```typescript
// 旧代码
async function fetchProducts(variables) {
  const response = await graphqlRequestClient(PRODUCTS_QUERY, variables)
  return response
}

// 新代码
import { autoGraphqlClient } from '@/lib/graphql/client-auto'
import { ProductsDocument } from '@/lib/graphql/__generated__/types'

async function fetchProducts(variables) {
  const response = await autoGraphqlClient(ProductsDocument, variables)
  return response
}
```

### 客户端组件示例

```typescript
// 旧代码
const { data, isLoading } = useQuery({
  queryKey: ['products', variables],
  queryFn: async () => {
    const response = await graphqlRequestClient(PRODUCTS_QUERY, variables)
    return response
  }
})

// 新代码
const { data, isLoading } = useProductsQuery(variables)
```

## 步骤 4: 处理错误和加载状态

自动生成的 hooks 已经包含了错误和加载状态的处理：

```typescript
const { data, isLoading, error } = useProductsQuery(variables)

if (isLoading) return <div>加载中...</div>
if (error) return <div>加载失败: {error.toString()}</div>
```

## 步骤 5: 修复 Saleor 3.20 版本的 API 变更

Saleor 3.20 版本对 API 进行了一些重要更改，特别是关于 channel 参数和认证要求。以下是一些常见的修复：

### 1. categories 查询

在 Saleor 3.20 中，`categories` 查询不再接受顶级的 `channel` 参数。正确的查询方式应该是：

```graphql
query Categories {
  categories(first: 100) {
    edges {
      node {
        id
        name
        slug
        products(channel: $channel, first: 0) {
          totalCount
        }
      }
    }
  }
}
```

注意：`channel` 参数应该移到 `products` 字段中，而不是直接放在 `categories` 查询中。

### 2. 认证要求

对于需要认证的 API 调用，确保用户已登录并获取了有效的认证令牌。自动生成的代码会自动处理认证头。

## 步骤 6: 测试和验证

在迁移过程中，请确保：

1. 所有查询都能正确工作
2. 错误处理正常
3. 性能没有明显下降

## 常见问题

### Q: 自动生成的代码与我的查询不匹配

A: 确保您的查询与 Saleor 3.20 API 兼容。如果查询中使用了不支持的参数或字段，代码生成可能会失败或生成不正确的代码。

### Q: 我需要自定义 GraphQL 客户端行为

A: 您可以修改 `src/lib/graphql/client-auto.ts` 文件，自定义客户端行为，如缓存策略、错误处理等。

### Q: 我的应用程序在生产环境中出现错误

A: 确保在部署前运行 `npm run build:prod` 命令，这将先生成代码，然后再构建应用程序。 
 