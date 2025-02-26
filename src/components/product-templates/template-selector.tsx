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
        Switch Product Style
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
        <h3 className="font-medium">Select Product Layout</h3>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs value={selectedTemplate} onValueChange={handleSelect}>
        <TabsList className="w-full mb-4 grid grid-cols-6">
          <TabsTrigger value="template1" className="flex-1">Style 1</TabsTrigger>
          <TabsTrigger value="template2" className="flex-1">Style 2</TabsTrigger>
          <TabsTrigger value="template3" className="flex-1">Style 3</TabsTrigger>
          <TabsTrigger value="template4" className="flex-1">Style 4</TabsTrigger>
          <TabsTrigger value="template5" className="flex-1">Style 5</TabsTrigger>
          <TabsTrigger value="template6" className="flex-1">Style 6</TabsTrigger>
        </TabsList>
        
        <TabsContent value="template1">
          <div className="relative aspect-video overflow-hidden rounded-md mb-2 border border-slate-200 dark:border-slate-700">
            <Image 
              src="/images/product-template1.svg" 
              alt="Product Layout Style 1" 
              width={320} 
              height={180}
              className="object-cover"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Classic layout with clear product information and images</p>
        </TabsContent>
        
        <TabsContent value="template2">
          <div className="relative aspect-video overflow-hidden rounded-md mb-2 border border-slate-200 dark:border-slate-700">
            <Image 
              src="/images/product-template2.svg" 
              alt="Product Layout Style 2" 
              width={320} 
              height={180}
              className="object-cover"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Modern style emphasizing product images with concise information</p>
        </TabsContent>
        
        <TabsContent value="template3">
          <div className="relative aspect-video overflow-hidden rounded-md mb-2 border border-slate-200 dark:border-slate-700">
            <Image 
              src="/images/product-template3.svg" 
              alt="Product Layout Style 3" 
              width={320} 
              height={180}
              className="object-cover"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Luxury style with rich media display and immersive experience</p>
        </TabsContent>
        
        <TabsContent value="template4">
          <div className="relative aspect-video overflow-hidden rounded-md mb-2 border border-slate-200 dark:border-slate-700">
            <Image 
              src="/images/product-template4.svg" 
              alt="Product Layout Style 4" 
              width={320} 
              height={180}
              className="object-cover"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Simple business style highlighting product details and specifications</p>
        </TabsContent>
        
        <TabsContent value="template5">
          <div className="relative aspect-video overflow-hidden rounded-md mb-2 border border-slate-200 dark:border-slate-700">
            <Image 
              src="/images/product-template5.svg" 
              alt="Product Layout Style 5" 
              width={320} 
              height={180}
              className="object-cover"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Lightweight minimal style highlighting size selection and product features</p>
        </TabsContent>
        
        <TabsContent value="template6">
          <div className="relative aspect-video overflow-hidden rounded-md mb-2 border border-slate-200 dark:border-slate-700">
            <Image 
              src="/images/product-template6.svg" 
              alt="Product Layout Style 6" 
              width={320} 
              height={180}
              className="object-cover"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Refined clothing style with color and size selection plus detailed fabric information</p>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
} 