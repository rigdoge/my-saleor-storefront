'use client'

import { useCart } from "@/components/providers/cart-provider"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { formatPrice } from "@/lib/utils"
import { ShoppingBag } from "lucide-react"
import { CartItem } from "./cart-item"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

export function CartDrawer() {
  const { cart, isOpen, setIsOpen } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Cart
            <span className="text-sm font-normal text-muted-foreground">
              ({cart.totalQuantity} items)
            </span>
          </SheetTitle>
        </SheetHeader>
        {cart.items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-2 px-4">
            <div className="relative mb-4 h-40 w-40 text-muted-foreground">
              <Image
                src="/images/empty-cart.png"
                alt="Empty cart"
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-lg font-medium">Cart is empty</h3>
            <p className="text-center text-sm text-muted-foreground">
              Add items to your cart to see them here.
            </p>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 pr-6">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>
            <div className="pr-6">
              <Separator className="my-4" />
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Subtotal</span>
                    <span>
                      {formatPrice(cart.totalAmount, {
                        currency: cart.currency,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>
                    {formatPrice(cart.totalAmount, {
                      currency: cart.currency,
                    })}
                  </span>
                </div>
                <Button className="w-full" size="lg">
                  Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
} 