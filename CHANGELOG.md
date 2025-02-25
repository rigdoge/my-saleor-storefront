# 更新日志

## 0.1.9 (2023-07-10)

### 修复
- 修复了 `product-card.tsx` 中的类型错误，将 `product.pricing?.onSale` 替换为 `product.pricing?.discount`
- 修复了 `graphqlRequestClient` 函数的类型错误，添加了明确的返回类型 `Promise<any>`

### 改进
- 优化了构建过程，解决了所有类型错误 