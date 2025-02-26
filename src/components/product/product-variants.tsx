'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

interface ProductVariant {
  id: string
  name: string
  sku: string
  attributes: Array<{
    attribute: {
      name: string
      slug: string
    }
    values: Array<{
      name: string
      slug: string
    }>
  }>
  quantityAvailable: number
  pricing: {
    price: {
      gross: {
        amount: number
        currency: string
      }
    }
    discount?: {
      gross: {
        amount: number
        currency: string
      }
    }
  }
}

interface ProductVariantsProps {
  variants: ProductVariant[]
  onVariantSelect: (variant: ProductVariant) => void
  selectedVariant?: ProductVariant
}

export function ProductVariants({
  variants,
  onVariantSelect,
  selectedVariant
}: ProductVariantsProps) {
  // Get all attribute types
  const attributes = variants[0]?.attributes.map(attr => ({
    name: attr.attribute.name,
    slug: attr.attribute.slug,
    values: Array.from(
      new Set(
        variants.flatMap(variant =>
          variant.attributes
            .find(a => a.attribute.slug === attr.attribute.slug)
            ?.values.map(v => v.slug) || []
        )
      )
    )
  })) || []

  // Currently selected attribute values
  const [selectedValues, setSelectedValues] = React.useState<Record<string, string>>(
    selectedVariant
      ? Object.fromEntries(
          selectedVariant.attributes.map(attr => [
            attr.attribute.slug,
            attr.values[0].slug
          ])
        )
      : {}
  )

  // Find matching variant based on selected values
  const findMatchingVariant = (values: Record<string, string>) => {
    return variants.find(variant =>
      variant.attributes.every(attr =>
        values[attr.attribute.slug] === attr.values[0].slug
      )
    )
  }

  // Check if attribute value is available
  const isValueAvailable = (attrSlug: string, valueSlug: string) => {
    const testValues = {
      ...selectedValues,
      [attrSlug]: valueSlug
    }
    return variants.some(variant =>
      variant.attributes.every(attr =>
        testValues[attr.attribute.slug] === attr.values[0].slug
      ) && variant.quantityAvailable > 0
    )
  }

  // Handle attribute value selection
  const handleValueSelect = (attrSlug: string, valueSlug: string) => {
    const newValues = {
      ...selectedValues,
      [attrSlug]: valueSlug
    }
    setSelectedValues(newValues)
    
    const matchingVariant = findMatchingVariant(newValues)
    if (matchingVariant) {
      onVariantSelect(matchingVariant)
    }
  }

  return (
    <div className="space-y-4">
      {attributes.map(attribute => (
        <div key={attribute.slug}>
          <h3 className="text-sm font-medium">{attribute.name}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {attribute.values.map(value => {
              const isSelected = selectedValues[attribute.slug] === value
              const isAvailable = isValueAvailable(attribute.slug, value)
              
              return (
                <Button
                  key={value}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "min-w-[4rem]",
                    !isAvailable && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => {
                    if (isAvailable) {
                      handleValueSelect(attribute.slug, value)
                    }
                  }}
                  disabled={!isAvailable}
                >
                  {value}
                </Button>
              )
            })}
          </div>
        </div>
      ))}

      {selectedVariant && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">SKU</span>
            <span className="text-sm text-muted-foreground">
              {selectedVariant.sku}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Stock</span>
            <span className="text-sm text-muted-foreground">
              {selectedVariant.quantityAvailable} items
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Price</span>
            <div className="flex items-center gap-2">
              {selectedVariant.pricing.discount && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(
                    selectedVariant.pricing.price.gross.amount,
                    { currency: selectedVariant.pricing.price.gross.currency }
                  )}
                </span>
              )}
              <span className="text-lg font-bold text-primary">
                {formatPrice(
                  selectedVariant.pricing.discount
                    ? selectedVariant.pricing.discount.gross.amount
                    : selectedVariant.pricing.price.gross.amount,
                  {
                    currency: selectedVariant.pricing.price.gross.currency
                  }
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 