'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Paintbrush } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductTemplateSelectorProps {
  onSelectTemplate: (templateId: number) => void
  currentTemplate: number
}

export function ProductTemplateSelector({
  onSelectTemplate,
  currentTemplate
}: ProductTemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const templates = [
    { id: 1, name: 'Classic' },
    { id: 2, name: 'Modern' },
    { id: 3, name: 'Elegant' },
    { id: 4, name: 'Minimal' },
    { id: 5, name: 'Premium' },
    { id: 6, name: 'Fashion' }
  ]

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        {/* Template selector dropdown */}
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-48 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
            <div className="p-2">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 px-2 py-1.5">
                Select Template
              </h3>
              <div className="mt-1 space-y-1">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      onSelectTemplate(template.id)
                      setIsOpen(false)
                    }}
                    className={cn(
                      "w-full flex items-center px-2 py-1.5 text-sm rounded-md",
                      currentTemplate === template.id
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    )}
                  >
                    <span className="flex-1 text-left">{template.name}</span>
                    {currentTemplate === template.id && (
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Toggle button */}
        <Button
          variant="outline"
          size="sm"
          className="rounded-full w-10 h-10 p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Paintbrush className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          <span className="sr-only">Change template</span>
        </Button>
      </div>
    </div>
  )
} 