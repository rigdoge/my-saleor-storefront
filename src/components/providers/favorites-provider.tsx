"use client"

import { createContext, useContext } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"

interface FavoriteProduct {
  id: string
  name: string
  slug: string
  thumbnail?: {
    url: string
    alt?: string
  }
}

interface FavoritesContextType {
  favorites: FavoriteProduct[]
  addToFavorites: (product: FavoriteProduct) => void
  removeFromFavorites: (productId: string) => void
  isFavorite: (productId: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | null>(null)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useLocalStorage<FavoriteProduct[]>("favorites", [], {
    onError: (error) => console.error('Failed to handle favorites data:', error)
  })
  const { toast } = useToast()

  const addToFavorites = (product: FavoriteProduct) => {
    if (!favorites.some(f => f.id === product.id)) {
      setFavorites(prev => [...prev, product])
      toast({
        title: "已添加到收藏",
        description: `${product.name} 已添加到您的收藏夹`,
      })
    }
  }

  const removeFromFavorites = (productId: string) => {
    const product = favorites.find(f => f.id === productId)
    setFavorites(prev => prev.filter(f => f.id !== productId))
    if (product) {
      toast({
        title: "已移除收藏",
        description: `${product.name} 已从您的收藏夹中移除`,
      })
    }
  }

  const isFavorite = (productId: string) => {
    return favorites.some(f => f.id === productId)
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
} 