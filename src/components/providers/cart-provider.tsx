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
  currency: 'USD'
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useLocalStorage<Cart>(CART_STORAGE_KEY, defaultCart, {
    onError: (error) => console.error('Failed to handle cart data:', error)
  })
  const [isOpen, setIsOpen] = useState(false)

  // Add item to cart
  const addItem = useCallback((item: CartItem) => {
    // Check stock
    if (item.stock !== undefined && item.quantity > item.stock) {
      toast({
        title: "Insufficient Stock",
        description: `This product only has ${item.stock} items in stock`,
        variant: "destructive"
      })
      return false
    }

    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(i => i.variantId === item.variantId)

      let newItems: CartItem[]
      if (existingItemIndex > -1) {
        // If item already exists, check if updated quantity exceeds stock
        const existingItem = prevCart.items[existingItemIndex]
        const newQuantity = existingItem.quantity + item.quantity
        
        if (item.stock !== undefined && newQuantity > item.stock) {
          toast({
            title: "Insufficient Stock",
            description: `This product only has ${item.stock} items in stock`,
            variant: "destructive"
          })
          return prevCart
        }
        
        // Update quantity
        newItems = prevCart.items.map((existingItem, index) => {
          if (index === existingItemIndex) {
            return {
              ...existingItem,
              quantity: newQuantity,
              // Update price in case it has changed
              price: item.price
            }
          }
          return existingItem
        })
      } else {
        // If new item, add to list
        newItems = [...prevCart.items, item]
      }

      // Calculate new totals
      const totalQuantity = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      return {
        ...prevCart,
        items: newItems,
        totalQuantity,
        totalAmount,
        currency: item.currency // Use latest added item's currency
      }
    })

    // Automatically open cart after adding item
    setIsOpen(true)
    
    // Addition successful
    return true
  }, [setCart])

  // Remove item from cart
  const removeItem = useCallback((itemId: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.id !== itemId)
      
      // Recalculate totals
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

  // Update item quantity
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) return

    setCart(prevCart => {
      // Find item to update
      const itemToUpdate = prevCart.items.find(item => item.id === itemId)
      
      // Check stock
      if (itemToUpdate && itemToUpdate.stock !== undefined && quantity > itemToUpdate.stock) {
        toast({
          title: "Insufficient Stock",
          description: `This product only has ${itemToUpdate.stock} items in stock`,
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

      // Recalculate totals
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

  // Clear cart
  const clearCart = useCallback(() => {
    setCart(defaultCart)
  }, [setCart])

  // Optimize context value with useMemo
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