import { ImageResponse } from 'next/og'
import { graphqlRequestClient } from '@/lib/graphql/client'
import { CATEGORY_BY_SLUG_QUERY } from '@/lib/graphql/queries/categories'

export const runtime = 'edge'
export const alt = 'Category'
export const size = {
  width: 1200,
  height: 630,
}

export default async function Image({ params }: { params: { slug: string } }) {
  try {
    // Get category data
    const response = await graphqlRequestClient(CATEGORY_BY_SLUG_QUERY, {
      slug: params.slug,
      channel: 'default-channel'
    })

    const category = response.category
    
    if (!category) {
      return new ImageResponse(
        (
          <div
            style={{
              fontSize: 48,
              background: 'white',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#333',
            }}
          >
            <div style={{ fontSize: 48, fontWeight: 'bold' }}>Category Not Found</div>
          </div>
        ),
        { ...size }
      )
    }

    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#333',
            padding: '40px',
          }}
        >
          <div style={{ fontSize: 64, fontWeight: 'bold', marginBottom: '20px' }}>
            {category.name}
          </div>
          {category.description && (
            <div style={{ fontSize: 32, maxWidth: '80%', textAlign: 'center' }}>
              {category.description}
            </div>
          )}
          <div style={{ fontSize: 24, marginTop: '40px', color: '#666' }}>
            Shop our collection
          </div>
        </div>
      ),
      { ...size }
    )
  } catch (error) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#333',
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 'bold' }}>Error Loading Category</div>
        </div>
      ),
      { ...size }
    )
  }
} 