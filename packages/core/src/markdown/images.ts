/**
 * Image extraction from markdown AST
 */

import { dirname, resolve } from 'path';
import { visit } from 'unist-util-visit';
import type { Root, Image } from 'mdast';
import type { ImageRef } from '../types.js';
import { parseMarkdown } from './parser.js';
import { validateImageFile, type ImageValidation } from './image-validator.js';
import {
  hashFile,
  createCacheKey,
  type ImageCache,
} from '../cache/image-cache.js';

/**
 * Extract all image references from markdown content
 */
export function extractImages(content: string): ImageRef[] {
  const ast = parseMarkdown(content);
  return extractImagesFromAST(ast);
}

/**
 * Extract all image references from markdown AST
 */
export function extractImagesFromAST(ast: Root): ImageRef[] {
  const images: ImageRef[] = [];

  visit(ast, 'image', (node: Image) => {
    // Only process local file paths (not URLs)
    if (!node.url.startsWith('http://') && !node.url.startsWith('https://')) {
      images.push({
        path: node.url,
        alt: node.alt || undefined,
      });
    }
  });

  return images;
}

/**
 * Check if a path is a local file (not a URL)
 */
export function isLocalImagePath(path: string): boolean {
  return (
    !path.startsWith('http://') &&
    !path.startsWith('https://') &&
    !path.startsWith('//')
  );
}

/**
 * Resolve relative image path based on markdown file location
 */
export function resolveImagePath(
  imagePath: string,
  markdownFilePath: string,
): string {
  const markdownDir = dirname(markdownFilePath);
  return resolve(markdownDir, imagePath);
}

/**
 * Processed image with validation and cache info
 */
export interface ProcessedImage extends ImageRef {
  absolutePath: string;
  validation: ImageValidation;
  hash?: string;
  cacheKey?: string;
  cacheHit: boolean;
  cachedMediaId?: number;
  cachedUrl?: string;
}

/**
 * Process images for dry-run mode with full validation and cache checking
 */
export async function processImagesForDryRun(
  images: ImageRef[],
  markdownFilePath: string,
  cache?: ImageCache,
): Promise<ProcessedImage[]> {
  const processed: ProcessedImage[] = [];

  for (const image of images) {
    // Resolve path
    const absolutePath = resolveImagePath(image.path, markdownFilePath);

    // Validate file
    const validation = await validateImageFile(absolutePath);

    const processedImage: ProcessedImage = {
      ...image,
      absolutePath,
      validation,
      cacheHit: false,
    };

    // If file exists, check cache
    if (validation.exists && cache) {
      try {
        const hash = await hashFile(absolutePath);
        const cacheKey = createCacheKey(hash);

        processedImage.hash = hash;
        processedImage.cacheKey = cacheKey;

        // Check if in cache
        const cached = cache.get(cacheKey);
        if (cached) {
          processedImage.cacheHit = true;
          processedImage.cachedMediaId = cached.mediaId;
          processedImage.cachedUrl = cached.url;
        }
      } catch (error) {
        // Hash error - add to validation errors
        validation.errors.push(
          `Failed to hash file: ${(error as Error).message}`,
        );
      }
    }

    processed.push(processedImage);
  }

  return processed;
}
