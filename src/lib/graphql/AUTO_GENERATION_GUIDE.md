# GraphQL 自动代码生成指南

本指南将帮助您将项目从手动定义的 GraphQL 查询迁移到使用自动生成的代码，并适应 Saleor 3.20 版本的 API。

## 步骤 1: 准备工作

我们已经完成了以下准备工作：

1. 创建了 `src/lib/graphql/client-auto.ts` 文件，支持自动生成的代码
2. 更新了 `codegen.ts` 配置文件，使用正确的 API URL 和生成选项
3. 在 `package.json` 中添加了 `generate` 和 `build:prod` 脚本
4. 创建了示例文件 `src/lib/graphql/examples/auto-generated-example.tsx`
5. 创建了迁移指南 `src/lib/graphql/MIGRATION_GUIDE.md`
6. 创建了查询修复指南 `src/lib/graphql/fix-queries.md`

## 步骤 2: 修复 GraphQL 查询

按照 `fix-queries.md` 中的指南，修复以下查询文件：

1. `src/lib/graphql/queries/favorites.ts`
2. `src/lib/graphql/queries/orders.ts`
3. `src/lib/graphql/queries/categories.ts`（已修复）

## 步骤 3: 生成代码

修复所有查询后，运行代码生成命令：

```bash
npm run generate
```

这将在 `src/lib/graphql/__generated__/` 目录下生成类型定义和 React Query hooks。

## 步骤 4: 迁移现有代码

按照 `MIGRATION_GUIDE.md` 中的步骤，将现有代码迁移到使用自动生成的代码。主要包括：

1. 导入自动生成的 hooks
2. 使用自动生成的 hooks 替换手动的 GraphQL 查询
3. 处理错误和加载状态

## 步骤 5: 测试和验证

在迁移过程中，请确保：

1. 所有查询都能正确工作
2. 错误处理正常
3. 性能没有明显下降

## 步骤 6: 部署到生产环境

在部署到生产环境之前，请使用以下命令构建应用程序：

```bash
npm run build:prod
```

这将先生成代码，然后再构建应用程序。

## 常见问题

### Q: 自动生成的代码与我的查询不匹配

A: 确保您的查询与 Saleor 3.20 API 兼容。如果查询中使用了不支持的参数或字段，代码生成可能会失败或生成不正确的代码。

### Q: 我需要自定义 GraphQL 客户端行为

A: 您可以修改 `src/lib/graphql/client-auto.ts` 文件，自定义客户端行为，如缓存策略、错误处理等。

### Q: 我的应用程序在生产环境中出现错误

A: 确保在部署前运行 `npm run build:prod` 命令，这将先生成代码，然后再构建应用程序。

## 迁移示例

### 服务器组件

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
  const response = await autoGraphqlClient(ProductsDocument, variables)
  return response
}
```

### 客户端组件

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

## 结论

使用自动生成的代码有以下优势：

1. **类型安全**：自动生成的类型定义与服务器端完全匹配，减少类型错误
2. **开发效率高**：减少手动编写重复代码的时间，开发者可以专注于业务逻辑
3. **自动更新**：当 API 变更时，只需重新生成代码即可获取最新的类型和查询
4. **减少错误**：避免手动编写时可能出现的拼写错误或字段遗漏
5. **更好的 IDE 支持**：自动生成的类型提供更好的代码补全和类型检查

通过遵循本指南，您可以顺利地将项目迁移到使用自动生成的代码，并适应 Saleor 3.20 版本的 API。 