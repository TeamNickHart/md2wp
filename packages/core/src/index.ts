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
export {
  extractImages,
  processImagesForDryRun,
  type ProcessedImage,
} from './markdown/images.js';
export { transformToGutenberg } from './markdown/gutenberg.js';
export {
  validateImageFile,
  formatBytes,
  type ImageValidation,
} from './markdown/image-validator.js';
export {
  updateFrontmatter,
  type FrontmatterUpdates,
} from './markdown/frontmatter-writer.js';

// Export config loader
export {
  loadConfig,
  generateDefaultConfig,
  generateEnvTemplate,
  createWPConfig,
} from './config/loader.js';

// Export image cache
export {
  ImageCache as ImageCacheManager,
  hashFile,
  createCacheKey,
} from './cache/image-cache.js';
