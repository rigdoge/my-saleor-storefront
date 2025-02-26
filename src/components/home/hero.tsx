import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl">
            Discover Curated Products
            <span className="block text-primary">Quality Living Starts Here</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            We carefully select quality products to provide you with an exceptional shopping experience. From fashion to home goods, we meet all your quality lifestyle needs.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/products">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>
    </section>
  )
} 