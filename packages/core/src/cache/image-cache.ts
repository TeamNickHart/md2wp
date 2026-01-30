/**
 * Image cache system for tracking uploaded images
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { createHash } from 'crypto';
import { dirname } from 'path';
import { existsSync } from 'fs';
import type { ImageCache as ImageCacheType, CachedImage } from '../types.js';

const DEFAULT_CACHE_DIR = '.md2wp';
const CACHE_FILE = 'cache.json';

/**
 * Image cache manager
 */
export class ImageCache {
  private cachePath: string;
  private cache: ImageCacheType;

  constructor(cacheDir: string = DEFAULT_CACHE_DIR) {
    this.cachePath = `${cacheDir}/${CACHE_FILE}`;
    this.cache = { images: {} };
  }

  /**
   * Load cache from disk
   */
  async load(): Promise<void> {
    try {
      if (existsSync(this.cachePath)) {
        const data = await readFile(this.cachePath, 'utf-8');
        this.cache = JSON.parse(data) as ImageCacheType;
      }
    } catch (error) {
      // If cache is corrupted, start fresh
      this.cache = { images: {} };
    }
  }

  /**
   * Save cache to disk
   */
  async save(): Promise<void> {
    // Ensure cache directory exists
    const cacheDir = dirname(this.cachePath);
    await mkdir(cacheDir, { recursive: true });

    // Write cache
    const data = JSON.stringify(this.cache, null, 2);
    await writeFile(this.cachePath, data, 'utf-8');
  }

  /**
   * Get cached image by hash
   */
  get(hash: string): CachedImage | undefined {
    return this.cache.images[hash];
  }

  /**
   * Set cached image
   */
  set(hash: string, image: CachedImage): void {
    this.cache.images[hash] = image;
  }

  /**
   * Check if image is cached
   */
  has(hash: string): boolean {
    return hash in this.cache.images;
  }

  /**
   * Update verification timestamp for cached image
   */
  updateVerified(hash: string): void {
    const image = this.cache.images[hash];
    if (image) {
      image.verified = new Date().toISOString();
    }
  }

  /**
   * Remove image from cache
   */
  remove(hash: string): void {
    delete this.cache.images[hash];
  }

  /**
   * Clear all cached images
   */
  clear(): void {
    this.cache = { images: {} };
  }

  /**
   * Get all cached images
   */
  getAll(): Record<string, CachedImage> {
    return this.cache.images;
  }
}

/**
 * Hash a file using SHA-256
 */
export async function hashFile(filePath: string): Promise<string> {
  const buffer = await readFile(filePath);
  const hash = createHash('sha256');
  hash.update(buffer);
  return hash.digest('hex');
}

/**
 * Create cache key from file hash
 */
export function createCacheKey(hash: string): string {
  return `sha256-${hash}`;
}
