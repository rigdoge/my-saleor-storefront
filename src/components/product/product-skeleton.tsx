'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ProductSkeleton() {
  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* 商品图片骨架屏 */}
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

        {/* 商品信息骨架屏 */}
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

          {/* 规格选择骨架屏 */}
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

          {/* 价格骨架屏 */}
          <div className="mt-6">
            <Skeleton className="h-8 w-32" />
          </div>

          {/* 按钮骨架屏 */}
          <div className="mt-8 flex gap-2">
            <Button
              size="lg"
              className="w-full"
              disabled
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              加入购物车
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-10 shrink-0 px-0"
              disabled
            >
              <Heart className="h-4 w-4" />
              <span className="sr-only">收藏</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 商品详情骨架屏 */}
      <div className="space-y-6">
        {/* 服务保障骨架屏 */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>

        {/* 分类骨架屏 */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-24" />
        </div>

        <Separator />

        {/* 详情标签页骨架屏 */}
        <Tabs defaultValue="description" className="space-y-4">
          <TabsList>
            <TabsTrigger value="description" disabled>商品介绍</TabsTrigger>
            <TabsTrigger value="specification" disabled>规格参数</TabsTrigger>
            <TabsTrigger value="service" disabled>售后服务</TabsTrigger>
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