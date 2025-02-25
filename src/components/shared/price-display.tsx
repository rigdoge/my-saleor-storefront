"use client"

import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'

interface PriceDisplayProps {
  price: number
  currency: string
  discount?: {
    amount: number
    percentage?: number
  }
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showDiscountBadge?: boolean
}

export function PriceDisplay({
  price,
  currency,
  discount,
  size = 'md',
  className,
  showDiscountBadge = true,
}: PriceDisplayProps) {
  const hasDiscount = discount && discount.amount > 0
  const finalPrice = hasDiscount ? price - discount.amount : price
  
  // 根据尺寸确定样式
  const sizeStyles = {
    sm: {
      price: 'text-sm font-medium',
      originalPrice: 'text-xs',
      badge: 'text-xs px-1.5 py-0.5',
    },
    md: {
      price: 'text-base font-semibold',
      originalPrice: 'text-sm',
      badge: 'text-xs px-2 py-1',
    },
    lg: {
      price: 'text-2xl font-bold',
      originalPrice: 'text-base',
      badge: 'text-sm px-2 py-1',
    },
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className={cn("text-primary", sizeStyles[size].price)}>
        {formatPrice(finalPrice, { currency })}
      </span>
      
      {hasDiscount && (
        <>
          <span className={cn("text-muted-foreground line-through", sizeStyles[size].originalPrice)}>
            {formatPrice(price, { currency })}
          </span>
          
          {showDiscountBadge && discount.percentage && (
            <span className={cn(
              "rounded-full bg-red-500 font-medium text-white",
              sizeStyles[size].badge
            )}>
              -{discount.percentage}%
            </span>
          )}
        </>
      )}
    </div>
  )
} 