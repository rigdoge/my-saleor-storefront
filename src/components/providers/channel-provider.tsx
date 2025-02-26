'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CHANNELS_QUERY } from '@/lib/graphql/queries/channels'
import { graphqlRequestClient } from '@/lib/graphql/client'
import type { Channel, ChannelContext } from '@/lib/types/channel'
import { Skeleton } from '@/components/ui/skeleton'

const ChannelContext = createContext<ChannelContext | null>(null)

function LoadingState() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Skeleton className="h-8 w-32" />
          <div className="flex-1" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <Skeleton className="h-8 w-[200px] mb-4" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-[300px] rounded-xl" />
            <Skeleton className="h-[300px] rounded-xl" />
            <Skeleton className="h-[300px] rounded-xl" />
            <Skeleton className="h-[300px] rounded-xl" />
          </div>
        </div>
      </main>
    </div>
  )
}

const defaultChannel = {
  id: 'default',
  name: 'Default Channel',
  slug: 'default-channel',
  currencyCode: 'CNY',
  languageCode: 'zh-CN',
  defaultCountry: {
    code: 'CN',
    country: 'China'
  }
}

export function ChannelProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { data: channelData, isLoading, isError } = useQuery({
    queryKey: ['channel'],
    queryFn: async () => {
      try {
        const response = await graphqlRequestClient(CHANNELS_QUERY, {
          slug: process.env.NEXT_PUBLIC_DEFAULT_CHANNEL
        })
        return response.channel
      } catch (error) {
        console.error('Failed to fetch channel:', error)
        return defaultChannel
      }
    },
    staleTime: 1000 * 60 * 5, // Data won't be refetched within 5 minutes
    gcTime: 1000 * 60 * 30, // Cache for 30 minutes
  })

  if (isLoading) {
    return <LoadingState />
  }

  const channel = channelData || defaultChannel

  return (
    <ChannelContext.Provider
      value={{
        availableChannels: [channel],
        currentChannel: channel,
        setCurrentChannel: () => {} // No need to switch channel in single-channel mode
      }}
    >
      {children}
    </ChannelContext.Provider>
  )
}

export function useChannel() {
  const context = useContext(ChannelContext)
  if (!context) {
    throw new Error('useChannel must be used within a ChannelProvider')
  }
  return context
} 