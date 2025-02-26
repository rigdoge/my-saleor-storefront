'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag, ShoppingCart } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ProductSkeleton() {
  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product image skeleton */}
        <div className="flex flex-col-reverse gap-4 md:flex-row">
          <div className="flex gap-4 overflow-x-auto md:flex-col md:overflow-y-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square h-20 w-20 shrink-0 rounded-lg" />
            ))}
          </div>
          <div className="relative flex-1">
            <Skeleton className="aspect-square w-full rounded-xl" />
          </div>
        </div>

        {/* Product info skeleton */}
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>

          <Separator className="my-4" />

          {/* Specification selection skeleton */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-16" />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-20" />
                ))}
              </div>
            </div>
          </div>

          {/* Price skeleton */}
          <div className="mt-6">
            <Skeleton className="h-8 w-32" />
          </div>

          {/* Button skeleton */}
          <div className="mt-8 flex gap-2">
            <div className="mt-4 flex items-center justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full gap-1"
                disabled
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
            </div>
            <Button
              variant="outline"
              size="lg"
              className="w-10 shrink-0 px-0"
              disabled
            >
              <Heart className="h-4 w-4" />
              <span className="sr-only">Favorite</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Product details skeleton */}
      <div className="space-y-6">
        {/* Service guarantee skeleton */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>

        {/* Category skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-24" />
        </div>

        <Separator />

        {/* Details tab skeleton */}
        <Tabs defaultValue="description" className="space-y-4">
          <TabsList>
            <TabsTrigger value="description" disabled>Product Description</TabsTrigger>
            <TabsTrigger value="specification" disabled>Specifications</TabsTrigger>
            <TabsTrigger value="service" disabled>After-sales Service</TabsTrigger>
          </TabsList>

          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  )
} 