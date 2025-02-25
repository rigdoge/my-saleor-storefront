# GraphQL 自动生成代码迁移计划

本文档提供了一个详细的计划，帮助您将项目中的所有组件从手动定义的 GraphQL 查询迁移到使用自动生成的代码。

## 已完成的工作

1. 创建了 `src/lib/graphql/client-auto.ts` 文件，支持自动生成的代码
2. 更新了 `codegen.ts` 配置文件，使用正确的 API URL 和生成选项
3. 在 `package.json` 中添加了 `generate` 和 `build:prod` 脚本
4. 修复了 `categories.ts` 文件中的查询，移除了顶级的 `channel` 参数
5. 修复了 `favorites.ts` 文件中的查询，使用元数据实现收藏功能
6. 修复了 `orders.ts` 文件中的查询，使用 `payments` 字段替代 `paymentMethod`
7. 修改了 `featured-products.tsx` 组件，使用自动生成的 hooks

## 迁移步骤

### 步骤 1: 服务器组件迁移

以下是需要迁移的服务器组件列表：

1. `src/app/products/[slug]/page.tsx`
   - 使用 `PRODUCT_BY_SLUG_QUERY`
   - 替换为 `useProductBySlugQuery` 或 `autoGraphqlClient(ProductBySlugDocument, variables)`

2. `src/app/account/favorites/page.tsx`
   - 使用 `USER_FAVORITES_QUERY` 和 `REMOVE_FROM_FAVORITES_MUTATION`
   - 替换为 `useUserFavoritesQuery` 和 `useUpdateUserMetadataMutation`

3. `src/app/search/page.tsx`
   - 使用 `SEARCH_PRODUCTS_QUERY`
   - 替换为 `useSearchProductsQuery`

4. `src/app/account/orders/[id]/page.tsx`
   - 使用 `ORDER_BY_ID_QUERY`
   - 替换为 `useOrderByIdQuery`

5. `src/app/account/orders/page.tsx`
   - 使用 `USER_ORDERS_QUERY`
   - 替换为 `useUserOrdersQuery`

6. `src/app/categories/page.tsx`
   - 使用 `CATEGORIES_QUERY`
   - 替换为 `useCategoriesQuery`

7. `src/app/categories/[slug]/page.tsx`
   - 使用 `CATEGORY_BY_SLUG_QUERY` 和 `PRODUCTS_QUERY`
   - 替换为 `useCategoryBySlugQuery` 和 `useProductsQuery`

### 步骤 2: 客户端组件迁移

以下是需要迁移的客户端组件列表：

1. `src/components/providers/auth-provider.tsx`
   - 使用 `CURRENT_USER_QUERY`、`LOGIN_MUTATION` 和 `REGISTER_MUTATION`
   - 替换为 `useCurrentUserQuery`、`useLoginMutation` 和 `useRegisterMutation`

2. `src/components/providers/channel-provider.tsx`
   - 使用 `CHANNELS_QUERY`
   - 替换为 `useChannelsQuery`

3. `src/components/search/search-command.tsx`
   - 使用 `SEARCH_SUGGESTIONS_QUERY`
   - 替换为 `useSearchSuggestionsQuery`

### 步骤 3: 辅助函数迁移

1. `src/lib/hooks/use-product-actions.ts`
   - 使用 `ADD_TO_FAVORITES_MUTATION` 和 `REMOVE_FROM_FAVORITES_MUTATION`
   - 替换为 `useUpdateUserMetadataMutation`

### 步骤 4: 测试和验证

对于每个迁移的组件，请确保：

1. 所有查询都能正确工作
2. 错误处理正常
3. 性能没有明显下降
4. 用户体验保持一致

## 迁移示例

### 服务器组件示例

```typescript
// 旧代码
import { PRODUCTS_QUERY } from '@/lib/graphql/queries/products'
import { graphqlRequestClient } from '@/lib/graphql/client'

async function fetchProducts(variables) {
  const response = await graphqlRequestClient(PRODUCTS_QUERY, variables)
  return response
}

// 新代码
import { autoGraphqlClient } from '@/lib/graphql/client-auto'
import { ProductsDocument } from '@/lib/graphql/__generated__/types'

async function fetchProducts(variables) {
  const response = await autoGraphqlClient(ProductsDocument, variables)()
  return response
}
```

### 客户端组件示例

```typescript
// 旧代码
import { useQuery } from '@tanstack/react-query'
import { PRODUCTS_QUERY } from '@/lib/graphql/queries/products'
import { graphqlRequestClient } from '@/lib/graphql/client'

function ProductList() {
  const { data, isLoading } = useQuery({
    queryKey: ['products', variables],
    queryFn: async () => {
      const response = await graphqlRequestClient(PRODUCTS_QUERY, variables)
      return response
    }
  })
  
  // ...
}

// 新代码
import { useProductsQuery } from '@/lib/graphql/__generated__/types'

function ProductList() {
  const { data, isLoading, error } = useProductsQuery(variables)
  
  if (isLoading) return <div>加载中...</div>
  if (error) return <div>加载失败: {error.toString()}</div>
  
  // ...
}
```

## 部署到生产环境

在部署到生产环境之前，请使用以下命令构建应用程序：

```bash
npm run build:prod
```

这将先生成代码，然后再构建应用程序。

## 结论

通过遵循本迁移计划，您可以顺利地将项目从手动定义的 GraphQL 查询迁移到使用自动生成的代码。这将提高开发效率，减少错误，并提供更好的类型安全性。 