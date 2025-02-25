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
import { Heart, ShoppingBag } from "lucide-react"

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
      <h3 className="mt-4 text-lg font-medium">收藏夹是空的</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        浏览商品并添加到收藏夹
      </p>
      <Button asChild className="mt-4">
        <Link href="/products">去购物</Link>
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
            <h2 className="text-2xl font-bold tracking-tight">我的收藏</h2>
            <p className="text-muted-foreground">
              管理您收藏的商品
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
                    <Button className="flex-1">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      加入购物车
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeMutation.mutate(product.id)}
                      disabled={removeMutation.isPending}
                    >
                      <Heart className="h-4 w-4 fill-current" />
                      <span className="sr-only">从收藏夹移除</span>
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