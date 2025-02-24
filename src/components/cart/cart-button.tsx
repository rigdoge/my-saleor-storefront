'use client'

import { useCart } from "@/components/providers/cart-provider"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { ShoppingBag } from "lucide-react"
import { motion } from "framer-motion"

export function CartButton() {
  const { cart, isOpen, setIsOpen } = useCart()
  const itemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative"
      onClick={() => setIsOpen(true)}
    >
      <ShoppingBag className="h-5 w-5" />
      {itemCount > 0 && (
        <motion.div
          key={itemCount}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground"
        >
          {itemCount}
        </motion.div>
      )}
      <span className="sr-only">
        打开购物车 ({itemCount} 件商品, 总计{" "}
        {formatPrice(cart?.totalAmount || 0, { currency: cart?.currency || 'CNY' })})
      </span>
    </Button>
  )
} 