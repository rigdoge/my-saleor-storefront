import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl">
            发现精选好物
            <span className="block text-primary">品质生活从这里开始</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            我们精心挑选优质商品，为您提供卓越的购物体验。从时尚服饰到家居用品，满足您的品质生活需求。
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/products">
                立即选购
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/categories">浏览分类</Link>
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