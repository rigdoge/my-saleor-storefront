"use client"

import Image from "next/image"
import { motion, useScroll, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"
import { useRef } from "react"

const milestones = [
  {
    year: 2005,
    title: "公司成立",
    description: "在互联网电商蓬勃发展的浪潮中,我们成立了公司,开始了电商创业之路。",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60",
  },
  {
    year: 2008,
    title: "首个电商平台上线",
    description: "经过三年的积累和准备,我们的第一个电商平台正式上线运营。",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
  },
  {
    year: 2012,
    title: "移动端布局",
    description: "紧跟移动互联网发展趋势,我们推出了移动端APP,开启全渠道运营。",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=60",
  },
  {
    year: 2015,
    title: "全球化扩张",
    description: "开始布局海外市场,产品和服务覆盖多个国家和地区。",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=60",
  },
  {
    year: 2018,
    title: "技术创新",
    description: "引入人工智能和大数据技术,提供个性化购物体验。",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60",
  },
  {
    year: 2020,
    title: "数字化转型",
    description: "全面推进数字化转型,打造智能化电商生态系统。",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
  },
  {
    year: 2023,
    title: "可持续发展",
    description: "践行绿色环保理念,推动电商行业可持续发展。",
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
      {/* 公司简介 */}
      <section className="mb-16 sm:mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            关于我们
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            我们是一家专注于电子商务的科技公司，致力于为用户提供优质的购物体验。
            通过技术创新和服务升级，我们不断探索电商领域的无限可能。
          </p>
        </motion.div>
      </section>

      {/* 发展历程 */}
      <section>
        <div className="mx-auto max-w-2xl text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            发展历程
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-muted-foreground"
          >
            见证我们的成长与创新
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

      {/* 愿景和使命 */}
      <section className="mt-24 sm:mt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            愿景和使命
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            我们的愿景是成为全球领先的电商科技公司，
            通过持续创新和优质服务，为用户创造价值，
            推动电商行业的健康发展。
          </p>
        </motion.div>
      </section>
    </div>
  )
} 