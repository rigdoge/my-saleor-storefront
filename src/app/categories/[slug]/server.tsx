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
  if (!params.slug) {
    console.error('Category slug is missing')
    return null
  }

  const channel = process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || 'default-channel'

  try {
    // Get category data
    const categoryResponse = await graphqlRequestClient(CATEGORY_BY_SLUG_QUERY, {
      slug: params.slug,
      channel
    })

    if (!categoryResponse) {
      console.error('No response from category query')
      return null
    }

    const category = categoryResponse?.category
    
    if (!category) {
      console.log('Category not found by slug, trying ID lookup:', params.slug)
      // Try to get by ID as fallback
      try {
        const idResponse = await graphqlRequestClient(CATEGORY_BY_ID_QUERY, {
          id: params.slug,
          channel
        })
        
        if (idResponse?.category) {
          return {
            category: idResponse.category,
            products: null
          }
        }
      } catch (idError) {
        console.error('Failed to get category by ID:', idError)
      }
      
      return null
    }

    // Get initial products
    const searchParamsObj: Record<string, string> = {}
    Object.entries(searchParams || {}).forEach(([key, value]) => {
      if (typeof value === 'string') {
        searchParamsObj[key] = value
      } else if (Array.isArray(value) && value.length > 0) {
        searchParamsObj[key] = value[0]
      }
    })
    
    const { filter, sortBy } = getProductFilters(searchParamsObj)
    
    // Ensure we're filtering by the current category
    if (category?.id) {
      filter.categories = [category.id]
    }

    try {
      const productsResponse = await graphqlRequestClient(PRODUCTS_QUERY, {
        first: 24,
        after: null,
        channel,
        filter,
        sortBy: sortBy || { field: 'RANK', direction: 'DESC' }
      })

      if (!productsResponse) {
        console.error('No response from products query')
        return {
          category,
          products: null
        }
      }

      return {
        category,
        products: productsResponse?.products || null
      }
    } catch (productsError) {
      console.error('Error fetching products:', productsError)
      return {
        category,
        products: null
      }
    }
  } catch (error) {
    console.error('Error loading category page:', error)
    throw new Error('Failed to load category data: ' + (error instanceof Error ? error.message : 'Unknown error'))
  }
} 