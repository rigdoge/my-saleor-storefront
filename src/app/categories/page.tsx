'use client'

import { useQuery } from '@tanstack/react-query'
import { useChannel } from '@/components/providers/channel-provider'
import { CATEGORIES_QUERY } from '@/lib/graphql/queries/categories'
import { graphqlRequestClient } from '@/lib/graphql/client'
import type { Category } from '@/lib/types/category'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronRight, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'

function CategorySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-48 w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  )
}

export default function CategoriesPage() {
  const { currentChannel } = useChannel()

  const { data: categoriesData, isLoading, error, refetch } = useQuery({
    queryKey: ['categories', currentChannel.slug],
    queryFn: async () => {
      try {
        const response = await graphqlRequestClient(CATEGORIES_QUERY, {
          first: 100,
          channel: currentChannel.slug
        })
        
        // 验证返回的数据结构
        if (!response || !response.categories || !response.categories.edges) {
          console.error('Invalid categories data structure:', response)
          return []
        }
        
        // 处理并验证每个分类数据
        return response.categories.edges.map((edge: any) => {
          if (!edge || !edge.node) {
            console.warn('Invalid category edge:', edge)
            return null
          }
          
          const category = edge.node
          
          // 确保子分类数据结构正确
          if (category.children && category.children.edges) {
            category.children.edges = category.children.edges.filter((childEdge: any) => 
              childEdge && childEdge.node && childEdge.node.id
            )
          }
          
          return category
        }).filter(Boolean) // 过滤掉无效的分类
      } catch (err) {
        console.error('获取分类数据失败:', err)
        throw err
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000 // 5分钟缓存
  })

  // 如果发现错误，尝试重新获取数据
  useEffect(() => {
    if (error) {
      console.error('分类数据加载错误，尝试重新获取:', error)
      const timer = setTimeout(() => {
        refetch()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, refetch])

  // 过滤出顶级分类并确保数据有效
  const topLevelCategories = categoriesData?.filter((category: Category) => {
    // 确保分类存在
    if (!category) return false
    // 检查是否为顶级分类（没有父分类）
    return !category.parent || !category.parent.id
  }) || []

  // 安全地访问子分类
  const getChildCategories = (category: Category) => {
    if (!category || !category.children || !category.children.edges) {
      return []
    }
    return category.children.edges
      .filter((edge: any) => edge && edge.node)
      .map((edge: any) => edge.node)
  }

  return (
    <div className="container py-10">
      <div className="space-y-8">
        {isLoading ? (
          <div className="grid gap-6 grid-cols-1">
            <CategorySkeleton />
            <CategorySkeleton />
            <CategorySkeleton />
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-lg text-red-500">加载分类数据时出错</p>
            <Button 
              onClick={() => refetch()} 
              variant="outline" 
              className="mt-4"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              重试
            </Button>
          </div>
        ) : !categoriesData || categoriesData.length === 0 ? (
          <div className="text-center">
            <p className="text-lg text-muted-foreground">
              暂无商品分类
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {topLevelCategories.map((category: Category) => (
              <div key={category.id} className="w-full">
                <Link
                  href={`/categories/${category.slug}`}
                  className="group relative block w-full overflow-hidden rounded-xl border bg-card transition-colors hover:bg-accent"
                >
                  <div className="relative aspect-[3/1] w-full">
                    <Image
                      src={category.backgroundImage?.url || '/images/placeholder.jpg'}
                      alt={category.backgroundImage?.alt || category.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="100vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h2 className="text-2xl font-semibold text-white">
                      {category.name}
                    </h2>
                    {category.description && (
                      <p className="mt-2 text-lg text-white/80">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <div className="absolute right-6 top-6">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="pointer-events-none bg-white/10 text-white backdrop-blur-sm"
                    >
                      {category.products?.totalCount || 0} 件商品
                    </Button>
                  </div>
                </Link>

                {getChildCategories(category).length > 0 ? (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold tracking-tight">
                        {category.name}
                      </h2>
                      <Button variant="ghost" asChild>
                        <Link href={`/categories/${category.slug}`}>
                          查看全部
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {getChildCategories(category).map((child: any) => (
                        <Link
                          key={child.id}
                          href={`/categories/${child.slug}`}
                          className="group rounded-lg border p-4 transition-colors hover:bg-accent"
                        >
                          <h3 className="font-medium group-hover:underline">
                            {child.name}
                          </h3>
                          {child.description && (
                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                              {child.description}
                            </p>
                          )}
                          <p className="mt-2 text-sm text-muted-foreground">
                            {child.products?.totalCount || 0} 件商品
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 