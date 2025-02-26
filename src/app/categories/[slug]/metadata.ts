import { Metadata } from 'next'
import { graphqlRequestClient } from '@/lib/graphql/client'
import { CATEGORY_BY_SLUG_QUERY } from '@/lib/graphql/queries/categories'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    // Get category data
    const response = await graphqlRequestClient(CATEGORY_BY_SLUG_QUERY, {
      slug: params.slug,
      channel: 'default-channel'
    })

    const category = response.category
    
    if (!category) {
      return {
        title: 'Category Not Found',
        description: 'The requested category could not be found.',
      }
    }

    // Get product count
    const productCount = category.products?.totalCount || 0

    // Generate metadata
    const title = `${category.name} - Shop ${productCount} Products`
    const description = category.description || `Browse our collection of ${category.name} with ${productCount} items to choose from.`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: category.backgroundImage ? [category.backgroundImage.url] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: category.backgroundImage ? [category.backgroundImage.url] : [],
      },
    }
  } catch (error) {
    return {
      title: 'Category',
      description: 'Browse our product categories',
    }
  }
} 