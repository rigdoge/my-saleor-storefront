import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  price: number,
  options: {
    currency?: string
    notation?: Intl.NumberFormatOptions["notation"]
  } = {
    currency: "CNY"
  }
) {
  const currency = options.currency || "CNY";
  
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency,
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

/**
 * 性能监控工具
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Record<string, { count: number, totalTime: number, min: number, max: number }>
  private enabled: boolean

  private constructor() {
    this.metrics = {}
    this.enabled = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENABLE_MONITORING === 'true'
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  /**
   * 测量函数执行时间
   * @param name 测量名称
   * @param fn 要测量的函数
   * @returns 函数执行结果
   */
  public async measure<T>(name: string, fn: () => Promise<T> | T): Promise<T> {
    if (!this.enabled) return fn()

    const start = performance.now()
    try {
      const result = await fn()
      return result
    } finally {
      const end = performance.now()
      const duration = end - start
      this.recordMetric(name, duration)
    }
  }

  /**
   * 记录指标
   */
  private recordMetric(name: string, duration: number) {
    if (!this.metrics[name]) {
      this.metrics[name] = { count: 0, totalTime: 0, min: Infinity, max: -Infinity }
    }
    
    const metric = this.metrics[name]
    metric.count++
    metric.totalTime += duration
    metric.min = Math.min(metric.min, duration)
    metric.max = Math.max(metric.max, duration)
  }

  /**
   * 获取所有指标
   */
  public getMetrics() {
    const result: Record<string, { count: number, avgTime: number, minTime: number, maxTime: number }> = {}
    
    for (const [name, metric] of Object.entries(this.metrics)) {
      result[name] = {
        count: metric.count,
        avgTime: metric.totalTime / metric.count,
        minTime: metric.min,
        maxTime: metric.max
      }
    }
    
    return result
  }

  /**
   * 打印指标报告
   */
  public printReport() {
    if (!this.enabled) return
    
    const metrics = this.getMetrics()
    console.table(
      Object.entries(metrics).map(([name, data]) => ({
        Name: name,
        Count: data.count,
        'Avg Time (ms)': data.avgTime.toFixed(2),
        'Min Time (ms)': data.minTime.toFixed(2),
        'Max Time (ms)': data.maxTime.toFixed(2)
      }))
    )
  }

  /**
   * 重置指标
   */
  public reset() {
    this.metrics = {}
  }
} 