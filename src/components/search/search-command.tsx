'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { useChannel } from '@/components/providers/channel-provider'
import { SEARCH_SUGGESTIONS_QUERY } from '@/lib/graphql/queries/search'
import { graphqlRequestClient } from '@/lib/graphql/client'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Loader2, Search } from 'lucide-react'
import Image from 'next/image'

interface SearchCommandProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const router = useRouter()
  const { currentChannel } = useChannel()
  const [search, setSearch] = React.useState('')
  const [debouncedSearch] = useDebounce(search, 300)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange?.(!open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, onOpenChange])

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['searchSuggestions', debouncedSearch, currentChannel.slug],
    queryFn: async () => {
      if (!debouncedSearch) return { products: { edges: [] } }
      const response = await graphqlRequestClient(SEARCH_SUGGESTIONS_QUERY, {
        search: debouncedSearch,
        channel: currentChannel.slug
      })
      return response
    },
    enabled: debouncedSearch.length > 0,
  })

  const handleSelect = React.useCallback((value: string) => {
    onOpenChange?.(false)
    router.push(value)
  }, [router, onOpenChange])

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="搜索商品..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>未找到相关商品</CommandEmpty>
        {isLoading ? (
          <div className="py-6 text-center text-sm">
            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
            <span className="mt-2 block text-muted-foreground">
              正在搜索...
            </span>
          </div>
        ) : suggestions?.products?.edges?.length ? (
          <CommandGroup heading="商品">
            {suggestions.products.edges.map(({ node: product }: { node: any }) => (
              <CommandItem
                key={product.id}
                value={`/products/${product.slug}`}
                onSelect={() => {
                  router.push(`/products/${product.slug}`)
                  onOpenChange?.(false)
                }}
                className="flex items-center gap-2 px-4 py-2"
              >
                <div className="relative h-10 w-10 overflow-hidden rounded-md">
                  <Image
                    src={product.thumbnail?.url || "/images/placeholder.jpg"}
                    alt={product.thumbnail?.alt || product.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <span className="text-sm">{product.name}</span>
                  {product.category && (
                    <span className="text-xs text-muted-foreground">
                      {product.category.name}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}
        {debouncedSearch && (
          <CommandGroup heading="操作">
            <CommandItem
              value={`/search?q=${encodeURIComponent(debouncedSearch)}`}
              onSelect={handleSelect}
            >
              <Search className="mr-2 h-4 w-4" />
              查看全部结果
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
} 