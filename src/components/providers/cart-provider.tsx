'use client'

import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import type { Cart, CartContext, CartItem } from '@/lib/types/cart'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { toast } from '@/components/ui/use-toast'

const CartContext = createContext<CartContext | null>(null)

const CART_STORAGE_KEY = 'saleor-cart'

const defaultCart: Cart = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  currency: 'CNY'
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useLocalStorage<Cart>(CART_STORAGE_KEY, defaultCart, {
    onError: (error) => console.error('Failed to handle cart data:', error)
  })
  const [isOpen, setIsOpen] = useState(false)

  // 添加商品到购物车
  const addItem = useCallback((item: CartItem) => {
    // 检查库存
    if (item.stock !== undefined && item.quantity > item.stock) {
      toast({
        title: "库存不足",
        description: `该商品当前库存仅剩 ${item.stock} 件`,
        variant: "destructive"
      })
      return false
    }

    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(i => i.variantId === item.variantId)

      let newItems: CartItem[]
      if (existingItemIndex > -1) {
        // 如果商品已存在，检查更新后的数量是否超过库存
        const existingItem = prevCart.items[existingItemIndex]
        const newQuantity = existingItem.quantity + item.quantity
        
        if (item.stock !== undefined && newQuantity > item.stock) {
          toast({
            title: "库存不足",
            description: `该商品当前库存仅剩 ${item.stock} 件`,
            variant: "destructive"
          })
          return prevCart
        }
        
        // 更新数量
        newItems = prevCart.items.map((existingItem, index) => {
          if (index === existingItemIndex) {
            return {
              ...existingItem,
              quantity: newQuantity,
              // 更新价格，以防价格变化
              price: item.price
            }
          }
          return existingItem
        })
      } else {
        // 如果是新商品，添加到列表
        newItems = [...prevCart.items, item]
      }

      // 计算新的总数和总金额
      const totalQuantity = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      return {
        ...prevCart,
        items: newItems,
        totalQuantity,
        totalAmount,
        currency: item.currency // 使用最新添加商品的货币
      }
    })

    // 添加商品后自动打开购物车
    setIsOpen(true)
    
    // 添加成功
    return true
  }, [setCart])

  // 从购物车移除商品
  const removeItem = useCallback((itemId: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.id !== itemId)
      
      // 重新计算总数和总金额
      const totalQuantity = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      return {
        ...prevCart,
        items: newItems,
        totalQuantity,
        totalAmount
      }
    })
  }, [setCart])

  // 更新商品数量
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) return

    setCart(prevCart => {
      // 找到要更新的商品
      const itemToUpdate = prevCart.items.find(item => item.id === itemId)
      
      // 检查库存
      if (itemToUpdate && itemToUpdate.stock !== undefined && quantity > itemToUpdate.stock) {
        toast({
          title: "库存不足",
          description: `该商品当前库存仅剩 ${itemToUpdate.stock} 件`,
          variant: "destructive"
        })
        return prevCart
      }
      
      const newItems = prevCart.items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity
          }
        }
        return item
      })

      // 重新计算总数和总金额
      const totalQuantity = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      return {
        ...prevCart,
        items: newItems,
        totalQuantity,
        totalAmount
      }
    })
  }, [setCart])

  // 清空购物车
  const clearCart = useCallback(() => {
    setCart(defaultCart)
  }, [setCart])

  // 使用useMemo优化上下文值
  const contextValue = useMemo(() => ({
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isOpen,
    setIsOpen
  }), [cart, addItem, removeItem, updateQuantity, clearCart, isOpen, setIsOpen])

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 