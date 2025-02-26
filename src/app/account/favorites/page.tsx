'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { RequireAuth } from "@/components/auth/require-auth"
import { USER_FAVORITES_QUERY, REMOVE_FROM_FAVORITES_MUTATION } from "@/lib/graphql/queries/favorites"
import { graphqlRequestClient } from "@/lib/graphql/client"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingBag, ShoppingCart, Loader2 } from "lucide-react"

function FavoritesLoading() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-square" />
          <CardHeader>
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function EmptyFavorites() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <Heart className="h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">Your Favorites is Empty</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Browse products and add them to your favorites
      </p>
      <Button asChild className="mt-4">
        <Link href="/products">Go Shopping</Link>
      </Button>
    </div>
  )
}

export default function FavoritesPage() {
  const queryClient = useQueryClient()

  const { data: favoritesData, isLoading } = useQuery({
    queryKey: ['userFavorites'],
    queryFn: async () => {
      const response = await graphqlRequestClient(USER_FAVORITES_QUERY)
      return response.me.favorites.edges.map((edge: any) => edge.node)
    }
  })

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await graphqlRequestClient(REMOVE_FROM_FAVORITES_MUTATION, {
        productId
      })
      return response.removeFromFavorites
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userFavorites'] })
    }
  })

  return (
    <RequireAuth>
      <div className="container py-10">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">My Favorites</h2>
            <p className="text-muted-foreground">
              Manage your favorite products
            </p>
          </div>

          {isLoading ? (
            <FavoritesLoading />
          ) : !favoritesData || favoritesData.length === 0 ? (
            <EmptyFavorites />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {favoritesData.map((product: any) => (
                <Card key={product.id} className="overflow-hidden">
                  <Link href={`/products/${product.slug}`}>
                    <div className="aspect-square relative">
                      <Image
                        src={product.thumbnail?.url || "/images/placeholder.jpg"}
                        alt={product.thumbnail?.alt || product.name}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  </Link>
                  <CardHeader>
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-medium hover:underline"
                    >
                      {product.name}
                    </Link>
                    <p className="text-lg font-bold">
                      {formatPrice(product.pricing.priceRange.start.gross.amount, {
                        currency: product.pricing.priceRange.start.gross.currency
                      })}
                    </p>
                  </CardHeader>
                  <CardFooter className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full gap-1"
                      onClick={() => removeMutation.mutate(product.id)}
                      disabled={removeMutation.isPending}
                    >
                      <Heart className="h-4 w-4 fill-current" />
                      <span className="sr-only">Remove from favorites</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </RequireAuth>
  )
} 