export interface CartItem {
  id: string
  variantId: string
  name: string
  slug: string
  quantity: number
  price: number
  currency: string
  stock?: number
  thumbnail?: {
    url: string
    alt?: string
  }
  variant?: {
    id: string
    name: string
    quantityAvailable: number
  }
}

export interface Cart {
  items: CartItem[]
  totalQuantity: number
  totalAmount: number
  currency: string
}

export interface CartContext {
  cart: Cart
  addItem: (item: CartItem) => boolean
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
} 