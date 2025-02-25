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
        <TabsList className="w-full mb-4">
          <TabsTrigger value="template1" className="flex-1">样式 1</TabsTrigger>
          <TabsTrigger value="template2" className="flex-1">样式 2</TabsTrigger>
          <TabsTrigger value="template3" className="flex-1">样式 3</TabsTrigger>
        </TabsList>
        
        <TabsContent value="template1">
          <div className="relative aspect-video overflow-hidden rounded-md mb-2 border border-slate-200 dark:border-slate-700">
            <Image 
              src="/images/product-template1.jpg" 
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
              src="/images/product-template2.jpg" 
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
              src="/images/product-template3.jpg" 
              alt="产品详情页样式3" 
              width={320} 
              height={180}
              className="object-cover"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">豪华风格，富媒体展示与沉浸式体验</p>
        </TabsContent>
      </Tabs>
      
      <div className="mt-4">
        <Button 
          onClick={() => setIsOpen(false)} 
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400"
        >
          应用选择
        </Button>
      </div>
    </motion.div>
  )
} 