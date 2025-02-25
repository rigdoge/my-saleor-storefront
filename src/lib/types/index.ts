// 导出所有类型
export * from './auth'
export * from './cart'
export * from './category'
export * from './channel'
export * from './favorite'
export * from './order'

// 产品类型
export interface Product {
  id: string
  name: string
  description: string
  slug: string
  price: number
  currency: string
  thumbnail: {
    url: string
    alt?: string
  }
  media?: Array<{
    url: string
    alt?: string
    type?: string
  }>
  category?: {
    id: string
    name: string
    slug: string
    ancestors?: {
      edges: Array<{
        node: {
          id: string
          name: string
          slug: string
        }
      }>
    }
  } | null
  attributes?: Record<string, string | string[]>
  variants: Array<{
    id: string
    name: string
    quantityAvailable: number
    attributes?: Array<{
      attribute: {
        name: string
        slug: string
      }
      values: Array<{
        name: string
        slug: string
      }>
    }>
  }>
  isAvailable: boolean
  rating?: number | {
    average: number
    count: number
  }
  reviewCount?: number
  pricing?: {
    price?: number
    discount?: {
      amount: number
      percentage: number
    }
    compareAtPrice?: number
  }
}

// 分页类型
export interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor?: string
  endCursor?: string
}

export interface PaginatedResult<T> {
  edges: Array<{
    node: T
    cursor: string
  }>
  pageInfo: PageInfo
  totalCount: number
}

// 筛选选项类型
export interface FilterOption {
  label: string
  value: string
  count?: number
}

// 排序选项类型
export interface SortOption {
  label: string
  value: string
}

// 活动筛选器类型
export interface ActiveFilter {
  id: string
  label: string
  onRemove: () => void
}

// 错误类型
export interface ApiError {
  message: string
  code?: string
  field?: string
}

// 响应类型
export interface ApiResponse<T> {
  data?: T
  errors?: ApiError[]
  success: boolean
} 