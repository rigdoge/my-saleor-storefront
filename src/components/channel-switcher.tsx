'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useChannel } from '@/components/providers/channel-provider'

export function ChannelSwitcher() {
  const [open, setOpen] = React.useState(false)
  const { currentChannel, availableChannels, setCurrentChannel } = useChannel()
  const router = useRouter()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {currentChannel.name}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search channel..." />
          <CommandEmpty>No channel found.</CommandEmpty>
          <CommandGroup>
            {availableChannels.map((channel) => (
              <CommandItem
                key={channel.id}
                value={channel.slug}
                onSelect={() => {
                  setCurrentChannel(channel)
                  setOpen(false)
                  // 重新加载页面以应用新的 channel 设置
                  router.refresh()
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    currentChannel.id === channel.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {channel.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 