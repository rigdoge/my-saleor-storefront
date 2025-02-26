'use client'

import { useCart } from "@/components/providers/cart-provider"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { ShoppingBag, ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export function CartButton() {
  const { cart, isOpen, setIsOpen } = useCart()
  const itemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0
  const totalPrice = cart?.totalAmount || 0
  const currency = cart?.currency || 'CNY'

  return (
    <Button
      variant="outline"
      size="sm"
      className="relative"
      onClick={() => setIsOpen(true)}
      aria-label={`Open cart (${itemCount} items, total ${formatPrice(
        totalPrice,
        { currency }
      )})`}
    >
      <ShoppingCart className="h-4 w-4" />
      {itemCount > 0 && (
        <Badge
          variant="secondary"
          className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs"
        >
          {itemCount}
        </Badge>
      )}
    </Button>
  )
} 