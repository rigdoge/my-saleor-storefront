'use client'

import { useState } from 'react'
import { useHomepageSelection } from '@/lib/hooks/use-homepage-selection'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

export function HomepageSelector() {
  const { selectedHomepage, selectHomepage } = useHomepageSelection()
  const [isOpen, setIsOpen] = useState(false)
  
  // Unified selection handler
  const handleSelect = (value: string) => {
    selectHomepage(value as any)
    setIsOpen(false) // Close panel after selection
  }
  
  if (!isOpen) {
    return (
      <Button 
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 shadow-md bg-white dark:bg-slate-800"
        onClick={() => setIsOpen(true)}
      >
        Switch Homepage Version
      </Button>
    )
  }
  
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Select Homepage Layout</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HomepagePreview 
            title="Default Version" 
            description="Clean basic homepage layout showcasing main features"
            value="homepage1"
            selected={selectedHomepage === 'homepage1'}
            onChange={handleSelect}
            image="/images/homepage1.jpg"
          />
          <HomepagePreview 
            title="Product Priority" 
            description="Emphasizes product display, perfect for promotional items"
            value="homepage2"
            selected={selectedHomepage === 'homepage2'}
            onChange={handleSelect}
            image="/images/homepage2.jpg"
          />
          <HomepagePreview 
            title="Category Priority" 
            description="Highlights categories, helping users navigate quickly"
            value="homepage3"
            selected={selectedHomepage === 'homepage3'}
            onChange={handleSelect}
            image="/images/homepage3.jpg"
          />
        </div>
        
        {/* Click preview to select, no additional confirmation button needed */}
      </motion.div>
    </motion.div>
  )
}

interface HomepagePreviewProps {
  title: string
  description: string
  value: string
  selected: boolean
  onChange: (value: string) => void
  image: string
}

function HomepagePreview({ title, description, value, selected, onChange, image }: HomepagePreviewProps) {
  return (
    <div 
      className={`
        border rounded-lg overflow-hidden cursor-pointer transition-all
        ${selected ? 'ring-2 ring-indigo-500 border-transparent scale-[1.02]' : 'hover:border-indigo-300'}
      `}
      onClick={() => onChange(value)}
    >
      <div className="relative h-40 w-full bg-slate-100 dark:bg-slate-800">
        <div className="flex items-center justify-center h-full text-slate-400">
          {title} Preview
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
      </div>
    </div>
  )
} 