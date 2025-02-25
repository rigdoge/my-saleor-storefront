'use client'

import { Hero } from "@/components/home/hero"
import { FeaturedCategories } from "@/components/home/featured-categories"
import { FeaturedProducts } from "@/components/home/featured-products"
import { motion } from "framer-motion"

export function Homepage1() {
  return (
    <motion.div 
      className="flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
    </motion.div>
  )
} 