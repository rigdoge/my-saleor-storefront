import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

const categories = [
  {
    name: "Fashion",
    href: "/categories/fashion",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=60",
    description: "Explore the latest fashion trends",
  },
  {
    name: "Home & Living",
    href: "/categories/home",
    image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&auto=format&fit=crop&q=60",
    description: "Create a cozy and comfortable home",
  },
  {
    name: "Electronics",
    href: "/categories/electronics",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&auto=format&fit=crop&q=60",
    description: "Experience new technology lifestyle",
  },
  {
    name: "Beauty & Personal Care",
    href: "/categories/beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=60",
    description: "Radiate natural beauty",
  },
]

export function FeaturedCategories() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Popular Categories</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Browse our carefully selected product categories to find what suits you
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-8">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className={cn(
                "group relative overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:-translate-y-1",
                "dark:bg-gray-800"
              )}
            >
              <div className="aspect-h-9 aspect-w-16 relative h-48">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                <p className="mt-2 text-sm text-gray-300">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
} 