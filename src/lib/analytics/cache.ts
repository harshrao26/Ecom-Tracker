/**
 * Simple in-memory cache for analytics data
 * For production, use Redis
 */

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

export class AnalyticsCache {
  private static cache = new Map<string, CacheEntry>();

  /**
   * Set cache with TTL (in seconds)
   */
  static set(key: string, data: any, ttl: number = 300) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl * 1000, // Convert to milliseconds
    });

    console.log(`✅ Cached: ${key} (TTL: ${ttl}s)`);
  }

  /**
   * Get cache (returns null if expired or not found)
   */
  static get(key: string): any | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    const age = Date.now() - entry.timestamp;
    if (age > entry.ttl) {
      this.cache.delete(key);
      console.log(`⏰ Expired: ${key}`);
      return null;
    }

    console.log(`✅ Cache hit: ${key}`);
    return entry.data;
  }

  /**
   * Delete cache entry
   */
  static delete(key: string) {
    this.cache.delete(key);
    console.log(`🗑️ Deleted: ${key}`);
  }

  /**
   * Clear all cache
   */
  static clear() {
    this.cache.clear();
    console.log("🗑️ Cache cleared");
  }

  /**
   * Generate cache key
   */
  static generateKey(userId: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}:${params[key]}`)
      .join("|");

    return `analytics:${userId}:${sortedParams}`;
  }

  /**
   * Get cache stats
   */
  static getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export default AnalyticsCache;
