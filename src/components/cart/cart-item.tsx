'use client'

import { useCart } from "@/components/providers/cart-provider"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import type { CartItem as CartItemType } from "@/lib/types/cart"
import { Minus, Plus, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-start gap-4 rounded-lg border p-4"
    >
      <div className="relative aspect-square h-20 w-20 min-w-fit overflow-hidden rounded-md">
        <Link href={`/products/${item.slug}`}>
          <Image
            src={item.thumbnail?.url || "/images/placeholder.jpg"}
            alt={item.thumbnail?.alt || item.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </Link>
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex justify-between gap-2">
          <Link
            href={`/products/${item.slug}`}
            className="line-clamp-2 flex-1 text-sm font-medium hover:underline"
          >
            {item.name}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => removeItem(item.id)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">删除</span>
          </Button>
        </div>
        {item.variant && (
          <p className="text-sm text-muted-foreground">
            {item.variant.name}
          </p>
        )}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-4 w-4" />
              <span className="sr-only">减少数量</span>
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              disabled={item.variant?.quantityAvailable === item.quantity}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">增加数量</span>
            </Button>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-medium">
              {formatPrice(item.price * item.quantity, {
                currency: item.currency,
              })}
            </span>
            {item.quantity > 1 && (
              <span className="text-sm text-muted-foreground">
                {formatPrice(item.price, { currency: item.currency })} / 件
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
} 