import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X } from "lucide-react"

import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CartItemProps {
  item: {
    id: string
    name: string
    price: number
    quantity: number
    thumbnail: {
      url: string
      alt?: string
    }
  }
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex gap-4 py-4">
      <Link
        href={`/products/${item.id}`}
        className="relative aspect-square h-24 w-24 overflow-hidden rounded-lg border"
      >
        <Image
          src={item.thumbnail.url}
          alt={item.thumbnail.alt || item.name}
          fill
          className="object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between">
          <div>
            <Link
              href={`/products/${item.id}`}
              className="text-lg font-semibold hover:underline"
            >
              {item.name}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              单价: {formatPrice(item.price)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onRemove(item.id)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">移除</span>
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-4 w-4" />
              <span className="sr-only">减少数量</span>
            </Button>
            <span className="w-12 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">增加数量</span>
            </Button>
          </div>
          <p className="text-lg font-semibold">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  )
} 