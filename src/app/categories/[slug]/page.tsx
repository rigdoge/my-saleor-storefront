import { CategoryPage } from './client-page'
import { getCategoryPageData } from './server'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

// Metadata generation is handled by metadata.ts

export default async function CategoryServerPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const data = await getCategoryPageData({ params, searchParams })
  
  if (!data) {
    return notFound()
  }
  
  return (
    <CategoryPage 
      initialCategory={data.category} 
      initialProducts={data.products}
      params={params} 
    />
  )
} 