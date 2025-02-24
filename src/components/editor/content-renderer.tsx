'use client'

import { cn } from "@/lib/utils"

interface Block {
  id: string
  type: string
  data: {
    text?: string
    level?: number
    items?: string[]
    style?: string
    [key: string]: any
  }
}

interface EditorContent {
  time: number
  blocks: Block[]
  version: string
}

interface ContentRendererProps {
  content: string
  className?: string
}

export function ContentRenderer({ content, className }: ContentRendererProps) {
  try {
    const data = JSON.parse(content) as EditorContent
    
    if (!data.blocks) {
      return <p className={className}>{content}</p>
    }

    return (
      <div className={cn("space-y-4", className)}>
        {data.blocks.map((block) => {
          switch (block.type) {
            case 'paragraph':
              return (
                <p
                  key={block.id}
                  className="text-base leading-7"
                  dangerouslySetInnerHTML={{ __html: block.data.text || '' }}
                />
              )
            case 'header':
              const Tag = `h${block.data.level}` as keyof JSX.IntrinsicElements
              return (
                <Tag
                  key={block.id}
                  className={cn(
                    "font-bold tracking-tight",
                    block.data.level === 1 && "text-4xl",
                    block.data.level === 2 && "text-3xl",
                    block.data.level === 3 && "text-2xl",
                    block.data.level === 4 && "text-xl",
                    block.data.level === 5 && "text-lg",
                    block.data.level === 6 && "text-base"
                  )}
                  dangerouslySetInnerHTML={{ __html: block.data.text || '' }}
                />
              )
            case 'list':
              const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul'
              return (
                <ListTag
                  key={block.id}
                  className={cn(
                    "list-inside",
                    block.data.style === 'ordered' ? "list-decimal" : "list-disc"
                  )}
                >
                  {block.data.items?.map((item: string, index: number) => (
                    <li
                      key={index}
                      className="text-base leading-7"
                      dangerouslySetInnerHTML={{ __html: item }}
                    />
                  ))}
                </ListTag>
              )
            default:
              return null
          }
        })}
      </div>
    )
  } catch (error) {
    // 如果解析失败，直接返回原始文本
    return <p className={className}>{content}</p>
  }
} 