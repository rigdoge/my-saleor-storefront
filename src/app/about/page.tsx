"use client"

import Image from "next/image"
import { motion, useScroll, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"
import { useRef } from "react"

const milestones = [
  {
    year: 2005,
    title: "Company Founded",
    description: "In the wave of booming e-commerce development, we established our company and began our entrepreneurial journey.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60",
  },
  {
    year: 2008,
    title: "First E-commerce Platform Launched",
    description: "After three years of accumulation and preparation, our first e-commerce platform was officially launched.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
  },
  {
    year: 2012,
    title: "Mobile Strategy",
    description: "Following the trend of mobile internet development, we launched our mobile app and began omni-channel operations.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=60",
  },
  {
    year: 2015,
    title: "Global Expansion",
    description: "Started expanding into overseas markets, with products and services covering multiple countries and regions.",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=60",
  },
  {
    year: 2018,
    title: "Technological Innovation",
    description: "Introduced artificial intelligence and big data technologies to provide personalized shopping experiences.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60",
  },
  {
    year: 2020,
    title: "Digital Transformation",
    description: "Comprehensively advanced digital transformation to build an intelligent e-commerce ecosystem.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
  },
  {
    year: 2023,
    title: "Sustainable Development",
    description: "Practicing green and environmental concepts to promote sustainable development in the e-commerce industry.",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=60",
  },
]

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  })

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <div className="container py-16 sm:py-24">
      {/* Company Profile */}
      <section className="mb-16 sm:mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            About Us
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            We are a technology company focused on e-commerce, committed to providing users with a high-quality shopping experience.
            Through technological innovation and service upgrades, we continuously explore the unlimited possibilities in the e-commerce field.
          </p>
        </motion.div>
      </section>

      {/* Development History */}
      <section>
        <div className="mx-auto max-w-2xl text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Our Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-muted-foreground"
          >
            Witness our growth and innovation
          </motion.p>
        </div>

        <div className="relative" ref={containerRef}>
          {/* 时间轴线 - 带进度动画 */}
          <div className="absolute left-1/2 h-full w-0.5 -translate-x-1/2 bg-border/20" />
          <motion.div
            className="absolute left-1/2 h-full w-0.5 -translate-x-1/2 bg-primary origin-top"
            style={{ scaleY }}
          />

          {/* 里程碑 */}
          <div className="space-y-24 py-12">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={cn(
                  "relative flex items-center gap-8",
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                )}
              >
                {/* 图片 */}
                <motion.div 
                  className="w-1/2"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    duration: 0.8,
                    delay: 0.2,
                    type: "spring",
                    stiffness: 50
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="aspect-[4/3] relative overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={milestone.image}
                      alt={milestone.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </motion.div>

                {/* 内容 */}
                <motion.div 
                  className="w-1/2 space-y-4"
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    duration: 0.8,
                    delay: 0.4,
                    type: "spring",
                    stiffness: 50
                  }}
                >
                  <motion.div 
                    className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary"
                    whileHover={{ scale: 1.05 }}
                  >
                    {milestone.year}
                  </motion.div>
                  <h3 className="text-2xl font-bold">{milestone.title}</h3>
                  <p className="text-muted-foreground">
                    {milestone.description}
                  </p>
                </motion.div>

                {/* 时间点 */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ 
                      duration: 0.4,
                      delay: 0.2,
                      type: "spring",
                      stiffness: 200
                    }}
                    className="relative"
                  >
                    {/* 外圈 */}
                    <motion.div 
                      className="absolute -inset-2 rounded-full bg-primary/10"
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.2 }}
                    />
                    {/* 内圈 */}
                    <motion.div 
                      className="relative h-4 w-4 rounded-full bg-primary"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision and Mission */}
      <section className="mt-24 sm:mt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Vision and Mission
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our vision is to become a globally leading e-commerce technology company,
            creating value for users through continuous innovation and quality service,
            and promoting the healthy development of the e-commerce industry.
          </p>
        </motion.div>
      </section>
    </div>
  )
} 