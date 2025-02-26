'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Filter, Grid3X3, LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react'
import { ProductCard } from '@/components/product/product-card'
import { ProductFilter } from '@/components/product/product-filter'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet"
import { Badge } from '@/components/ui/badge'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { LoadMore } from '@/components/ui/load-more'

interface CategoryPageTemplateProps {
  category: any
  products: any[]
  isLoading: boolean
  hasMore: boolean
  loadMore: () => void
  isFetchingNextPage: boolean
  totalCount: number
  onSortChange: (value: string) => void
  currentSort: string
  breadcrumbs?: Array<{name: string, href: string}>
}

export function CategoryPageTemplate({
  category,
  products,
  isLoading,
  hasMore,
  loadMore,
  isFetchingNextPage,
  totalCount,
  onSortChange,
  currentSort,
  breadcrumbs = []
}: CategoryPageTemplateProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  
  // 监听滚动，实现头部渐隐效果
  useEffect(() => {
    let lastScrollY = window.scrollY
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > 200) {
        setIsHeaderVisible(currentScrollY < lastScrollY)
      } else {
        setIsHeaderVisible(true)
      }
      
      lastScrollY = currentScrollY
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // 获取子分类
  const childCategories = category?.children?.edges
    ?.filter((edge: any) => edge?.node)
    .map((edge: any) => edge.node) || []
  
  return (
    <div className="relative">
      {/* 分类头部 - 带视差效果 */}
      <motion.div 
        className="relative h-[40vh] min-h-[300px] w-full overflow-hidden"
        animate={{ opacity: isHeaderVisible ? 1 : 0.6 }}
        transition={{ duration: 0.3 }}
      >
        {category?.backgroundImage?.url ? (
          <Image
            src={category.backgroundImage.url}
            alt={category.backgroundImage.alt || category.name}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
        )}
        
        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        {/* 分类信息 */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
          <div className="container">
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">首页</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {breadcrumbs.map((item, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      <BreadcrumbLink href={item.href}>{item.name}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </React.Fragment>
                ))}
                <BreadcrumbItem>
                  <BreadcrumbLink>{category?.name}</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{category?.name}</h1>
            {category?.description && (
              <p className="mt-2 text-muted-foreground max-w-2xl">{category.description}</p>
            )}
            <div className="mt-4">
              <Badge variant="outline" className="text-sm">
                {totalCount} 件商品
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* 子分类导航 */}
      {childCategories.length > 0 && (
        <div className="border-b bg-card">
          <div className="container py-4 overflow-x-auto">
            <div className="flex space-x-4">
              {childCategories.map((subCategory: any) => (
                <Link 
                  key={subCategory.id}
                  href={`/categories/${subCategory.slug}`}
                  className="flex-shrink-0 px-4 py-2 rounded-full border hover:bg-accent transition-colors"
                >
                  {subCategory.name}
                  {subCategory.products?.totalCount > 0 && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({subCategory.products.totalCount})
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* 主内容区 */}
      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 桌面端筛选器 */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="text-xl font-semibold mb-4">筛选</h2>
              <ProductFilter />
            </div>
          </div>
          
          {/* 产品列表 */}
          <div className="flex-1">
            {/* 工具栏 */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="md:hidden"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  筛选
                </Button>
                
                <Select value={currentSort} onValueChange={onSortChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="排序方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name_asc">名称 (A-Z)</SelectItem>
                    <SelectItem value="name_desc">名称 (Z-A)</SelectItem>
                    <SelectItem value="price_asc">价格 (低-高)</SelectItem>
                    <SelectItem value="price_desc">价格 (高-低)</SelectItem>
                    <SelectItem value="date_desc">最新上架</SelectItem>
                    <SelectItem value="rating_desc">评分最高</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  显示方式:
                </span>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* 产品网格 */}
            <AnimatePresence mode="wait">
              {products.length > 0 ? (
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
                      {products.map((product) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ProductCard product={product} />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {products.map((product) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex gap-4 border rounded-lg p-4"
                        >
                          <div className="w-32 h-32 relative flex-shrink-0">
                            <Image
                              src={product.thumbnail?.url || '/images/placeholder.jpg'}
                              alt={product.thumbnail?.alt || product.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {product.description}
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                              <div className="font-semibold">
                                {product.pricing?.price} {product.pricing?.currency}
                                {product.pricing?.discount?.amount && (
                                  <span className="ml-2 line-through text-sm text-muted-foreground">
                                    {product.pricing.price + product.pricing.discount.amount} {product.pricing.currency}
                                  </span>
                                )}
                              </div>
                              <Button size="sm" asChild>
                                <Link href={`/products/${product.slug}`}>
                                  查看详情
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">暂无商品</p>
                </div>
              )}
            </AnimatePresence>
            
            {/* 加载更多 */}
            {products.length > 0 && (
              <div className="mt-8">
                <LoadMore
                  onLoadMore={loadMore}
                  isLoading={isFetchingNextPage}
                  hasMore={hasMore}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 移动端筛选抽屉 */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>筛选</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <ProductFilter />
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button className="w-full">应用筛选</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
} 