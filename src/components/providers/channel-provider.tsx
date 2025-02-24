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

const defaultChannels = [
  {
    id: 'default',
    name: 'Default Channel',
    slug: 'default-channel',
    currencyCode: 'CNY',
    languageCode: 'zh-CN',
    isActive: true,
    defaultCountry: {
      code: 'CN',
      country: 'China'
    }
  },
  {
    id: 'us',
    name: 'US Channel',
    slug: 'us-channel',
    currencyCode: 'USD',
    languageCode: 'en-US',
    isActive: true,
    defaultCountry: {
      code: 'US',
      country: 'United States'
    }
  }
]

export function ChannelProvider({
  children,
  defaultChannel = 'default-channel'
}: {
  children: React.ReactNode
  defaultChannel?: string
}) {
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null)
  
  const { data: channelsData, isLoading, isError } = useQuery({
    queryKey: ['channels'],
    queryFn: async () => {
      try {
        const response = await graphqlRequestClient(CHANNELS_QUERY)
        return response.channels
      } catch (error) {
        console.error('Failed to fetch channels:', error)
        return defaultChannels
      }
    },
    staleTime: 1000 * 60 * 5, // 5分钟内数据不会重新获取
    cacheTime: 1000 * 60 * 30, // 缓存30分钟
  })

  useEffect(() => {
    if (!currentChannel) {
      const channels = channelsData || defaultChannels
      const defaultChannelData = channels.find(
        (channel: Channel) => channel.slug === defaultChannel
      )
      if (defaultChannelData) {
        setCurrentChannel(defaultChannelData)
      } else {
        setCurrentChannel(channels[0])
      }
    }
  }, [channelsData, currentChannel, defaultChannel])

  if (isLoading) {
    return <LoadingState />
  }

  const channels = channelsData || defaultChannels

  return (
    <ChannelContext.Provider
      value={{
        currentChannel: currentChannel || channels[0],
        availableChannels: channels,
        setCurrentChannel
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