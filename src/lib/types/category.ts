export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  parent?: {
    id: string
    name?: string
    slug?: string
  } | null
  backgroundImage?: {
    url: string
    alt?: string | null
  } | null
  children?: {
    edges: Array<{
      node: CategoryChild
    }>
    totalCount?: number
  }
  products?: {
    totalCount: number
  }
}

export interface CategoryChild {
  id: string
  name: string
  slug: string
  description?: string | null
  parent?: {
    id: string
  } | null
  backgroundImage?: {
    url: string
    alt?: string | null
  } | null
  products?: {
    totalCount: number
  }
}

export interface CategoryBreadcrumb {
  id: string
  name: string
  slug: string
}

export interface CategoryWithAncestors extends Category {
  ancestors?: {
    edges: Array<{
      node: CategoryBreadcrumb
    }>
  }
} 