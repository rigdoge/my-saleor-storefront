import { useState, useEffect } from 'react'
import { Product } from '@/lib/types'
import { graphqlRequestClient } from '@/lib/graphql/client'
import { GET_PRODUCTS } from '@/lib/graphql/queries/products'
import { useUrlParams } from './use-url-params'

interface UseProductsOptions {
  categorySlug?: string
  initialProducts?: Product[]
  filters?: Record<string, string | string[]>
  sort?: string
  search?: string
}

export function useProducts({
  categorySlug,
  initialProducts,
  filters: initialFilters,
  sort: initialSort,
  search: initialSearch,
}: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>(initialProducts || [])
  const [isLoading, setIsLoading] = useState(!initialProducts)
  const [error, setError] = useState<Error | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  
  // 从URL获取筛选参数
  const { 
    filters: urlFilters, 
    sort, 
    search,
    page,
    updateParams
  } = useUrlParams({
    initialFilters,
    initialSort,
    initialSearch
  })
  
  // 合并所有筛选条件
  const filters = {
    ...urlFilters,
    ...(categorySlug ? { category: categorySlug } : {})
  }
  
  // 获取产品数据
  const fetchProducts = async (isLoadMore = false) => {
    if (!isLoadMore) {
      setIsLoading(true)
    }
    
    try {
      const variables = {
        first: 12,
        ...(page && page > 1 ? { after: btoa(`arrayconnection:${(page - 1) * 12 - 1}`) } : {}),
        filter: {
          ...(search ? { search } : {}),
          ...(filters.category ? { categories: [filters.category] } : {}),
          ...(filters.minPrice ? { price: { gte: parseFloat(filters.minPrice as string) } } : {}),
          ...(filters.maxPrice ? { price: { lte: parseFloat(filters.maxPrice as string) } } : {}),
          ...(filters.attributes ? { attributes: Object.entries(filters.attributes).map(([key, value]) => ({
            slug: key,
            values: Array.isArray(value) ? value : [value]
          })) } : {})
        },
        ...(sort ? { 
          sortBy: {
            field: sort.split('_')[0].toUpperCase(),
            direction: sort.includes('_desc') ? 'DESC' : 'ASC'
          }
        } : {})
      }
      
      const data = await graphqlRequestClient(GET_PRODUCTS, variables)
      
      // 模拟数据，如果API未返回数据
      const productsData = data?.products || {
        edges: Array.from({ length: 8 }).map((_, i) => ({
          node: {
            id: `product-${i}`,
            name: `示例产品 ${i + 1}`,
            description: '这是一个示例产品描述',
            slug: `sample-product-${i + 1}`,
            price: 99.99,
            currency: 'CNY',
            thumbnail: {
              url: '/images/placeholder.svg',
              alt: '示例产品图片'
            },
            isAvailable: true,
            rating: 4.5,
            reviewCount: 10,
            category: {
              id: 'category-1',
              name: '示例分类',
              slug: 'sample-category'
            }
          }
        })),
        pageInfo: {
          hasNextPage: false,
          endCursor: null
        },
        totalCount: 8
      }
      
      const newProducts = productsData.edges.map((edge: any) => edge.node)
      
      setProducts(prev => isLoadMore ? [...prev, ...newProducts] : newProducts)
      setTotalCount(productsData.totalCount || newProducts.length)
      setHasMore(productsData.pageInfo?.hasNextPage || false)
      setError(null)
    } catch (err) {
      console.error('获取产品失败:', err)
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // 加载更多产品
  const loadMore = () => {
    updateParams({ page: (page || 1) + 1 })
  }
  
  // 当筛选条件、排序或搜索变化时重新获取数据
  useEffect(() => {
    fetchProducts()
  }, [JSON.stringify(filters), sort, search, page])
  
  return {
    products,
    isLoading,
    error,
    totalCount,
    hasMore,
    loadMore,
    filters,
    sort,
    search,
    updateFilters: (newFilters: Record<string, string | string[]>) => {
      updateParams({ filters: newFilters, page: 1 })
    },
    updateSort: (newSort: string) => {
      updateParams({ sort: newSort, page: 1 })
    },
    updateSearch: (newSearch: string) => {
      updateParams({ search: newSearch, page: 1 })
    }
  }
} 