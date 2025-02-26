import { graphqlRequestClient } from '@/lib/graphql/client'
import { CATEGORY_BY_SLUG_QUERY, CATEGORY_BY_ID_QUERY } from '@/lib/graphql/queries/categories'
import { PRODUCTS_QUERY, getProductFilters } from '@/lib/graphql/queries/products'

export const dynamic = 'force-dynamic'

export async function getCategoryPageData({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  try {
    // Get category data
    const categoryResponse = await graphqlRequestClient(CATEGORY_BY_SLUG_QUERY, {
      slug: params.slug,
      channel: 'default-channel'
    })

    const category = categoryResponse.category
    
    if (!category) {
      // Try to get by ID as fallback
      try {
        const idResponse = await graphqlRequestClient(CATEGORY_BY_ID_QUERY, {
          id: params.slug,
          channel: 'default-channel'
        })
        
        if (idResponse.category) {
          return {
            category: idResponse.category,
            products: null
          }
        }
      } catch (error) {
        console.error('Failed to get category by ID:', error)
      }
      
      return null
    }

    // Get initial products
    const searchParamsObj: Record<string, string> = {}
    Object.entries(searchParams).forEach(([key, value]) => {
      if (typeof value === 'string') {
        searchParamsObj[key] = value
      } else if (Array.isArray(value) && value.length > 0) {
        searchParamsObj[key] = value[0]
      }
    })
    
    const { filter, sortBy } = getProductFilters(searchParamsObj)
    filter.categories = [category.id]

    const productsResponse = await graphqlRequestClient(PRODUCTS_QUERY, {
      first: 24,
      after: null,
      channel: 'default-channel',
      filter,
      sortBy
    })

    return {
      category,
      products: productsResponse.products
    }
  } catch (error) {
    console.error('Error loading category page:', error)
    return null
  }
} 