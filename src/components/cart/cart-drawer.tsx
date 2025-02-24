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

export function CartDrawer() {
  const { cart, isOpen, setIsOpen } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            购物车
            <span className="text-sm font-normal text-muted-foreground">
              ({cart.totalQuantity} 件商品)
            </span>
          </SheetTitle>
        </SheetHeader>
        {cart.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center space-y-4">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <h3 className="text-lg font-medium">购物车是空的</h3>
              <p className="text-sm text-muted-foreground">
                快去挑选心仪的商品吧
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              继续购物
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
                    <span className="font-medium">小计</span>
                    <span>
                      {formatPrice(cart.totalAmount, {
                        currency: cart.currency,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>运费</span>
                    <span>免费</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>总计</span>
                  <span>
                    {formatPrice(cart.totalAmount, {
                      currency: cart.currency,
                    })}
                  </span>
                </div>
                <Button className="w-full" size="lg">
                  去结算
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
} 