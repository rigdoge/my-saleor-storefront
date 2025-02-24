import { Hero } from "@/components/home/hero"
import { FeaturedCategories } from "@/components/home/featured-categories"
import { FeaturedProducts } from "@/components/home/featured-products"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
    </div>
  )
} 