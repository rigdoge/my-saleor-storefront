'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ProductTemplateSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="grid md:grid-cols-2 gap-8">
        {/* 产品图片骨架屏 */}
        <div>
          <Skeleton className="w-full aspect-square rounded-lg" />
          <div className="flex gap-2 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-md" />
            ))}
          </div>
        </div>

        {/* 产品信息骨架屏 */}
        <div className="flex flex-col">
          <div className="flex justify-between">
            <div className="space-y-2">
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-6 w-1/3" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>

          <Separator className="my-6" />

          {/* 价格骨架屏 */}
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-6 w-20" />
          </div>

          {/* 规格选择骨架屏 */}
          <div className="mb-6">
            <Skeleton className="h-6 w-24 mb-3" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-20 rounded-md" />
              ))}
            </div>
          </div>

          {/* 数量选择骨架屏 */}
          <div className="mb-6">
            <Skeleton className="h-6 w-24 mb-3" />
            <div className="flex items-center">
              <Skeleton className="h-12 w-12 rounded-md" />
              <Skeleton className="h-12 w-16 mx-2" />
              <Skeleton className="h-12 w-12 rounded-md" />
            </div>
          </div>

          {/* 按钮骨架屏 */}
          <div className="flex gap-4 mt-6">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-12" />
          </div>

          {/* 服务信息骨架屏 */}
          <div className="grid grid-cols-2 gap-4 mt-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* 产品详情骨架屏 */}
      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="description" disabled>产品详情</TabsTrigger>
            <TabsTrigger value="specification" disabled>规格参数</TabsTrigger>
            <TabsTrigger value="reviews" disabled>用户评价</TabsTrigger>
          </TabsList>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </Tabs>
      </div>
    </div>
  )
} 