'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { Cart, CartContext, CartItem } from '@/lib/types/cart'

const CartContext = createContext<CartContext | null>(null)

const CART_STORAGE_KEY = 'saleor-cart'

const defaultCart: Cart = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  currency: 'CNY'
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(defaultCart)
  const [isOpen, setIsOpen] = useState(false)

  // 从 localStorage 恢复购物车数据
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error('Failed to parse cart data:', error)
      setCart(defaultCart)
    }
  }, [])

  // 保存购物车数据到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch (error) {
      console.error('Failed to save cart data:', error)
    }
  }, [cart])

  // 添加商品到购物车
  const addItem = (item: CartItem) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(i => i.variantId === item.variantId)

      let newItems: CartItem[]
      if (existingItemIndex > -1) {
        // 如果商品已存在，更新数量
        newItems = prevCart.items.map((existingItem, index) => {
          if (index === existingItemIndex) {
            return {
              ...existingItem,
              quantity: existingItem.quantity + item.quantity
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
  }

  // 从购物车移除商品
  const removeItem = (itemId: string) => {
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
  }

  // 更新商品数量
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return

    setCart(prevCart => {
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
  }

  // 清空购物车
  const clearCart = () => {
    setCart(defaultCart)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        setIsOpen
      }}
    >
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