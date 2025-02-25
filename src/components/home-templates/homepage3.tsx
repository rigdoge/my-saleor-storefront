'use client'

import { FeaturedCategories } from "@/components/home/featured-categories"
import { FeaturedProducts } from "@/components/home/featured-products"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Homepage3() {
  // 示例促销数据
  const promotions = [
    { id: 1, title: "春季大促", description: "全场低至7折", image: "/images/promo1.jpg", link: "/products" },
    { id: 2, title: "新品上市", description: "限时免邮", image: "/images/promo2.jpg", link: "/products" },
    { id: 3, title: "会员专享", description: "额外95折", image: "/images/promo3.jpg", link: "/products" },
  ]
  
  return (
    <motion.div 
      className="flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 分类优先展示 */}
      <section className="py-12 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-center mb-2">探索分类</h2>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-10">
              快速浏览我们的热门商品分类，找到您需要的一切
            </p>
            <FeaturedCategories />
            
            <div className="flex justify-center mt-8">
              <Button asChild>
                <Link href="/categories">查看全部分类</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* 促销卡片网格 */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            限时促销
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {promotions.map((promo, index) => (
              <motion.div
                key={promo.id}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="relative h-48 w-full bg-slate-200 dark:bg-slate-700">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    商品图片 {index + 1}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{promo.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">{promo.description}</p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={promo.link}>查看详情</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 精选产品 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            精选商品
          </motion.h2>
          <FeaturedProducts />
        </div>
      </section>
      
      {/* 简单的横幅 */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">注册会员，获取更多优惠</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-indigo-100">
              成为我们的会员，享受专属折扣和最新产品消息
            </p>
            <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-white/90">
              <Link href="/register">立即注册</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
} 