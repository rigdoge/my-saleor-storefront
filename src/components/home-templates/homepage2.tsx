'use client'

import { FeaturedProducts } from "@/components/home/featured-products"
import { FeaturedCategories } from "@/components/home/featured-categories"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Homepage2() {
  return (
    <motion.div 
      className="flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 大型产品横幅 */}
      <section className="relative py-20 bg-gradient-to-r from-indigo-500/90 to-purple-600/90 text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-2xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">发现最新时尚产品</h1>
            <p className="text-lg mb-8 text-white/80">探索我们精选的高品质商品，享受限时优惠和独家折扣</p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white hover:bg-white/90 text-indigo-600">
                <Link href="/products">浏览产品</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                <Link href="/categories">查看分类</Link>
              </Button>
            </div>
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-[-1]"></div>
      </section>
      
      {/* 精选产品 - 更大展示区域 */}
      <div className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            精选产品
          </motion.h2>
          <FeaturedProducts />
        </div>
      </div>
      
      {/* 分类展示 - 紧凑设计 */}
      <div className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-2xl font-bold text-center mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            热门分类
          </motion.h2>
          <FeaturedCategories />
        </div>
      </div>
    </motion.div>
  )
} 