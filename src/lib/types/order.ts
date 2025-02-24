export interface OrderItem {
  id: string
  productName: string
  productSku: string
  quantity: number
  unitPrice: {
    gross: {
      amount: number
      currency: string
    }
  }
  thumbnail?: {
    url: string
    alt?: string
  }
}

export interface Order {
  id: string
  number: string
  created: string
  status: string
  total: {
    gross: {
      amount: number
      currency: string
    }
  }
  lines: OrderItem[]
  shippingAddress?: {
    firstName: string
    lastName: string
    streetAddress1: string
    streetAddress2?: string
    city: string
    countryArea: string
    postalCode: string
    country: {
      code: string
      country: string
    }
    phone?: string
  }
  paymentStatus: string
  paymentMethod?: string
} 