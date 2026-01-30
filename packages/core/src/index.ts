/**
 * @md2wp/core
 * Core library for publishing markdown to WordPress
 */

export const version = '0.1.0';

// Export all types
export * from './types.js';

// Export WordPress client
export { WordPressClient } from './wordpress/client.js';

// Export markdown processing
export { parseMarkdownFile } from './markdown/parser.js';
export { extractImages } from './markdown/images.js';
export { transformToGutenberg } from './markdown/gutenberg.js';

// Export config loader
export { loadConfig, generateDefaultConfig, generateEnvTemplate, createWPConfig } from './config/loader.js';

// Export image cache
export { ImageCache as ImageCacheManager } from './cache/image-cache.js';
