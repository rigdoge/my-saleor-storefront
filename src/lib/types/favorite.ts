export interface FavoriteProduct {
  id: string
  name: string
  slug: string
  description?: string | null
  thumbnail?: {
    url: string
    alt?: string
  }
  pricing: {
    priceRange: {
      start: {
        gross: {
          amount: number
          currency: string
        }
      }
    }
  }
  category?: {
    id: string
    name: string
    slug: string
  } | null
  isAvailable: boolean
} 