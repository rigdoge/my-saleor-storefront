/**
 * 简单的LRU缓存实现
 */
export class LRUCache<K, V> {
  private capacity: number
  private cache: Map<K, V>
  private keyTimestamps: Map<K, number>
  private stats = {
    hits: 0,
    misses: 0,
    sets: 0,
    evictions: 0,
  }

  constructor(capacity: number) {
    this.capacity = capacity
    this.cache = new Map<K, V>()
    this.keyTimestamps = new Map<K, number>()
  }

  /**
   * 获取缓存项
   */
  get(key: K): V | undefined {
    const value = this.cache.get(key)
    
    if (value !== undefined) {
      // 更新访问时间戳
      this.keyTimestamps.set(key, Date.now())
      this.stats.hits++
      return value
    }
    
    this.stats.misses++
    return undefined
  }

  /**
   * 设置缓存项
   */
  set(key: K, value: V): void {
    // 如果已达到容量上限且是新键，则移除最久未使用的项
    if (this.cache.size >= this.capacity && !this.cache.has(key)) {
      this.evictLRU()
    }
    
    this.cache.set(key, value)
    this.keyTimestamps.set(key, Date.now())
    this.stats.sets++
  }

  /**
   * 删除缓存项
   */
  delete(key: K): boolean {
    const deleted = this.cache.delete(key)
    if (deleted) {
      this.keyTimestamps.delete(key)
    }
    return deleted
  }

  /**
   * 清空缓存
   */
  clear(): void {
    this.cache.clear()
    this.keyTimestamps.clear()
  }

  /**
   * 获取缓存大小
   */
  size(): number {
    return this.cache.size
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    return {
      ...this.stats,
      size: this.cache.size,
      capacity: this.capacity,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
    }
  }

  /**
   * 移除最久未使用的项
   */
  private evictLRU(): void {
    if (this.cache.size === 0) return

    let oldestKey: K | null = null
    let oldestTimestamp = Infinity

    // 找出最久未使用的键
    this.keyTimestamps.forEach((timestamp, key) => {
      if (timestamp < oldestTimestamp) {
        oldestTimestamp = timestamp
        oldestKey = key
      }
    });

    // 移除最久未使用的项
    if (oldestKey !== null) {
      this.cache.delete(oldestKey)
      this.keyTimestamps.delete(oldestKey)
      this.stats.evictions++
    }
  }
} 