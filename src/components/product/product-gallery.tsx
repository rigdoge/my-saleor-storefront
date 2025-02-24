'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react'

interface ProductGalleryProps {
  media: Array<{
    url: string
    alt?: string
    type: string
  }>
}

export function ProductGallery({ media }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false)

  const handlePrevious = () => {
    setSelectedIndex((current) => 
      current === 0 ? media.length - 1 : current - 1
    )
  }

  const handleNext = () => {
    setSelectedIndex((current) => 
      current === media.length - 1 ? 0 : current + 1
    )
  }

  const selectedMedia = media[selectedIndex]

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {/* 缩略图列表 */}
      <div className="flex gap-4 overflow-x-auto md:flex-col md:overflow-y-auto md:max-h-[500px]">
        {media.map((item, index) => (
          <button
            key={item.url}
            onClick={() => setSelectedIndex(index)}
            className={cn(
              "relative aspect-square w-20 overflow-hidden rounded-lg border-2",
              index === selectedIndex ? "border-primary" : "border-transparent"
            )}
          >
            <Image
              src={item.url}
              alt={item.alt || ''}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* 主图展示 */}
      <div className="relative flex-1">
        <div className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={selectedMedia.url}
            alt={selectedMedia.alt || ''}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">上一张</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">下一张</span>
            </Button>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-4 h-8 w-8 rounded-full bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
            onClick={() => setIsPreviewOpen(true)}
          >
            <ZoomIn className="h-4 w-4" />
            <span className="sr-only">放大预览</span>
          </Button>
        </div>
      </div>

      {/* 图片预览对话框 */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-screen-lg">
          <div className="relative aspect-square">
            <Image
              src={selectedMedia.url}
              alt={selectedMedia.alt || ''}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => setIsPreviewOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">关闭预览</span>
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
} 