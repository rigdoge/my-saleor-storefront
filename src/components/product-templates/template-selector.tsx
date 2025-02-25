'use client'

import { useState } from 'react'
import { useProductTemplateSelection } from '@/lib/hooks/use-product-template-selection'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

export function ProductTemplateSelector() {
  const { selectedTemplate, selectTemplate } = useProductTemplateSelection()
  const [isOpen, setIsOpen] = useState(false)
  
  const handleSelect = (value: string) => {
    selectTemplate(value as any)
    setIsOpen(false)
  }
  
  if (!isOpen) {
    return (
      <Button 
        variant="outline"
        size="sm"
        className="fixed bottom-4 left-4 z-50 shadow-md bg-white dark:bg-slate-800"
        onClick={() => setIsOpen(true)}
      >
        切换产品页样式
      </Button>
    )
  }
  
  return (
    <motion.div 
      className="fixed bottom-4 left-4 z-50 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 w-[340px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">选择产品详情页样式</h3>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs value={selectedTemplate} onValueChange={handleSelect}>
        <TabsList className="w-full mb-4 grid grid-cols-6">
          <TabsTrigger value="template1" className="flex-1">样式 1</TabsTrigger>
          <TabsTrigger value="template2" className="flex-1">样式 2</TabsTrigger>
          <TabsTrigger value="template3" className="flex-1">样式 3</TabsTrigger>
          <TabsTrigger value="template4" className="flex-1">样式 4</TabsTrigger>
          <TabsTrigger value="template5" className="flex-1">样式 5</TabsTrigger>
          <TabsTrigger value="template6" className="flex-1">样式 6</TabsTrigger>
        </TabsList>
        
        <TabsContent value="template1">
          <div className="relative aspect-video overflow-hidden rounded-md mb-2 border border-slate-200 dark:border-slate-700">
            <Image 
              src="/images/product-template1.svg" 
              alt="产品详情页样式1" 
              width={320} 
              height={180}
              className="object-cover"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">经典布局，清晰展示产品信息和图片</p>
        </TabsContent>
        
        <TabsContent value="template2">
          <div className="relative aspect-video overflow-hidden rounded-md mb-2 border border-slate-200 dark:border-slate-700">
            <Image 
              src="/images/product-template2.svg" 
              alt="产品详情页样式2" 
              width={320} 
              height={180}
              className="object-cover"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">现代风格，强调产品图片与简洁的信息展示</p>
        </TabsContent>
        
        <TabsContent value="template3">
          <div className="relative aspect-video overflow-hidden rounded-md mb-2 border border-slate-200 dark:border-slate-700">
            <Image 
              src="/images/product-template3.svg" 
              alt="产品详情页样式3" 
              width={320} 
              height={180}
              className="object-cover"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">豪华风格，富媒体展示与沉浸式体验</p>
        </TabsContent>
        
        <TabsContent value="template4">
          <div className="relative aspect-video overflow-hidden rounded-md mb-2 border border-slate-200 dark:border-slate-700">
            <Image 
              src="/images/product-template4.svg" 
              alt="产品详情页样式4" 
              width={320} 
              height={180}
              className="object-cover"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">简约商务风格，突出产品细节与规格信息</p>
        </TabsContent>
        
        <TabsContent value="template5">
          <div className="relative aspect-video overflow-hidden rounded-md mb-2 border border-slate-200 dark:border-slate-700">
            <Image 
              src="/images/product-template5.svg" 
              alt="产品详情页样式5" 
              width={320} 
              height={180}
              className="object-cover"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">轻量简约风格，突出尺寸选择和产品特性</p>
        </TabsContent>
        
        <TabsContent value="template6">
          <div className="relative aspect-video overflow-hidden rounded-md mb-2 border border-slate-200 dark:border-slate-700">
            <Image 
              src="/images/product-template6.svg" 
              alt="产品详情页样式6" 
              width={320} 
              height={180}
              className="object-cover"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">精致服装风格，包含颜色和尺寸选择以及详细的面料信息</p>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
} 