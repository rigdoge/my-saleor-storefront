import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  price: number,
  options: {
    currency: string
    notation?: Intl.NumberFormatOptions["notation"]
  } = {
    currency: "CNY"
  }
) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: options.currency,
    notation: options.notation,
  }).format(price)
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
} 