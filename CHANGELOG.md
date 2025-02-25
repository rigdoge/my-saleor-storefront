# 更新日志

## 0.2.0 (2023-07-15)

### 修复
- 修复了 `formatPrice` 函数中的类型错误，确保即使没有提供 `currency` 参数也能正常工作
- 修复了 `GET_PRODUCTS` 查询，添加了 `channel` 参数以符合Saleor API要求
- 更新了 `use-products.ts` 文件，在GraphQL请求中添加了 `channel` 参数

### 改进
- 优化了错误处理，提高了应用程序的稳定性
- 更新了项目文档，添加了更详细的开发指南

## 0.1.9 (2023-07-10)

### 修复
- 修复了 `product-card.tsx` 中的类型错误，将 `product.pricing?.onSale` 替换为 `product.pricing?.discount`
- 修复了 `graphqlRequestClient` 函数的类型错误，添加了明确的返回类型 `Promise<any>`

### 改进
- 优化了构建过程，解决了所有类型错误 