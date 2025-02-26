# 更新日志

## 0.2.4 (2023-03-10)

### 改进
- 优化了登录和登出功能，确保状态变更立即反映在UI上
- 修复了登录后需要刷新页面才能显示登录状态的问题
- 修复了登出后需要刷新页面才能显示登出状态的问题
- 更新了TanStack Query配置，将`cacheTime`替换为`gcTime`以适配最新版本

### 技术优化
- 在`auth-provider.tsx`中添加了`useQueryClient`以管理查询失效
- 在登录成功后添加了`queryClient.invalidateQueries()`以强制刷新数据
- 在登出函数中添加了`queryClient.clear()`以清除所有缓存数据
- 优化了登录表单组件，添加了`router.refresh()`以确保UI立即更新

## 0.2.2 (2023-02-25)

### 新功能
- 添加了多模板产品详情页系统，支持三种不同风格的产品展示
- 实现了产品模板选择器，允许用户根据个人喜好切换不同风格
- 添加了产品详情页骨架屏，提升加载时的用户体验
- 在Tailwind配置中添加了金色系列，为豪华模板提供视觉支持

### 改进
- 优化了产品详情页的结构，更好地适应不同的产品类型
- 增强了产品展示的用户体验和交互设计
- 修复了所有TypeScript类型错误，确保代码健壮性

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