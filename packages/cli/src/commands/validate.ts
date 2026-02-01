/**
 * Validate command - Validate markdown file without publishing
 */

import { resolve } from 'path';
import {
  parseMarkdownFile,
  extractImages,
  processImagesForDryRun,
  transformToGutenberg,
  ImageCacheManager,
  formatBytes,
  type ImageMap,
  type Frontmatter,
} from '@md2wp/core';

interface ValidateOptions {
  verbose?: boolean;
}

/**
 * Validate a markdown file
 */
export async function validateCommand(
  file: string,
  options: ValidateOptions = {},
): Promise<void> {
  let success = false;

  try {
    console.log('🔍 Validating markdown file...\n');

    // Resolve file path
    const absolutePath = resolve(process.cwd(), file);

    // Parse markdown file
    console.log('📄 Parsing markdown...');
    const parsed = await parseMarkdownFile(absolutePath);
    console.log('✅ Markdown parsed successfully\n');

    // Validate frontmatter
    console.log('📋 Validating frontmatter...');
    validateFrontmatter(parsed.frontmatter);
    console.log('✅ Frontmatter is valid\n');

    // Show frontmatter summary
    if (options.verbose) {
      console.log('📋 Frontmatter:');
      console.log(JSON.stringify(parsed.frontmatter, null, 2));
      console.log('');
    } else {
      console.log('📋 Frontmatter:');
      console.log(`   Title: ${parsed.frontmatter.title}`);
      console.log(`   Status: ${parsed.frontmatter.status || 'draft'}`);
      if (parsed.frontmatter.slug) {
        console.log(`   Slug: ${parsed.frontmatter.slug}`);
      }
      if (parsed.frontmatter.excerpt) {
        console.log(
          `   Excerpt: ${parsed.frontmatter.excerpt.substring(0, 50)}${parsed.frontmatter.excerpt.length > 50 ? '...' : ''}`,
        );
      }
      if (parsed.frontmatter.tags && parsed.frontmatter.tags.length > 0) {
        console.log(`   Tags: ${parsed.frontmatter.tags.join(', ')}`);
      }
      if (
        parsed.frontmatter.categories &&
        parsed.frontmatter.categories.length > 0
      ) {
        console.log(
          `   Categories: ${parsed.frontmatter.categories.join(', ')}`,
        );
      }
      console.log('');
    }

    // Extract and validate images
    const images = extractImages(parsed.content);

    if (images.length > 0) {
      console.log(`📸 Validating ${images.length} image(s)...`);

      // Load cache
      const cache = new ImageCacheManager();
      await cache.load();

      // Process images for validation
      const processed = await processImagesForDryRun(
        images,
        absolutePath,
        cache,
      );

      // Check for missing images
      const missingImages = processed.filter((img) => !img.validation.exists);
      const existingImages = processed.filter((img) => img.validation.exists);
      const cachedImages = processed.filter((img) => img.cacheHit);

      if (missingImages.length > 0) {
        console.error('\n❌ Missing images:');
        missingImages.forEach((img) => {
          console.error(`   • ${img.path}`);
          console.error(`     ${img.absolutePath}`);
        });
        console.error('');
        throw new Error(
          `Validation failed: ${missingImages.length} image(s) not found`,
        );
      }

      // Show image summary
      console.log('✅ All images exist\n');

      if (options.verbose) {
        console.log('📸 Image details:');
        existingImages.forEach((img) => {
          console.log(`   • ${img.path}`);
          console.log(`     Path: ${img.absolutePath}`);
          if (img.validation.sizeFormatted) {
            console.log(`     Size: ${img.validation.sizeFormatted}`);
          }
          if (img.cacheHit) {
            console.log(
              `     Cache: ✅ Cached (Media ID: ${img.cachedMediaId})`,
            );
          } else {
            console.log('     Cache: ⚠️  Will be uploaded');
          }
          if (img.alt) {
            console.log(`     Alt: ${img.alt}`);
          }
        });
        console.log('');
      } else {
        console.log('📸 Image summary:');
        console.log(`   Total: ${images.length}`);
        console.log(`   Cached: ${cachedImages.length}`);
        console.log(
          `   To upload: ${existingImages.length - cachedImages.length}`,
        );

        // Calculate total size of images to upload
        const toUploadSize = existingImages
          .filter((img) => !img.cacheHit)
          .reduce((sum, img) => sum + (img.validation.size || 0), 0);

        if (toUploadSize > 0) {
          console.log(`   Upload size: ${formatBytes(toUploadSize)}`);
        }
        console.log('');
      }
    } else {
      console.log('📸 No images found\n');
    }

    // Generate Gutenberg preview
    console.log('🎨 Generating Gutenberg blocks...');
    const imageMap: ImageMap = {}; // Empty map for validation
    const gutenberg = transformToGutenberg(parsed.content, imageMap);
    console.log('✅ Gutenberg blocks generated\n');

    if (options.verbose) {
      console.log('🎨 Gutenberg preview:');
      console.log('─'.repeat(60));
      console.log(gutenberg);
      console.log('─'.repeat(60));
      console.log('');
    } else {
      const blockCount = (gutenberg.match(/<!-- wp:/g) || []).length;
      console.log('🎨 Gutenberg preview:');
      console.log(`   Blocks: ${blockCount}`);
      console.log(`   Characters: ${gutenberg.length}`);
      console.log('');
    }

    // Success summary
    console.log('━'.repeat(60));
    console.log('✅ VALIDATION PASSED');
    console.log('━'.repeat(60));
    console.log('');
    console.log('✓ Frontmatter is valid');
    console.log(`✓ All ${images.length} image(s) exist`);
    console.log('✓ Gutenberg blocks generated successfully');
    console.log('');
    console.log('💡 Ready to publish with: md2wp publish ' + file);
    console.log('');

    success = true;
  } catch (error) {
    console.error('');
    console.error('━'.repeat(60));
    console.error('❌ VALIDATION FAILED');
    console.error('━'.repeat(60));
    console.error('');

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('Unknown error occurred');
    }

    console.error('');
  }

  process.exit(success ? 0 : 1);
}

/**
 * Validate frontmatter has required fields
 */
function validateFrontmatter(frontmatter: Frontmatter): void {
  // Check required field: title
  if (!frontmatter.title || typeof frontmatter.title !== 'string') {
    throw new Error('Frontmatter must include a "title" field (string)');
  }

  // Validate status if present
  if (frontmatter.status) {
    if (
      typeof frontmatter.status !== 'string' ||
      !['draft', 'publish'].includes(frontmatter.status)
    ) {
      throw new Error('Frontmatter "status" must be "draft" or "publish"');
    }
  }

  // Validate slug if present
  if (frontmatter.slug && typeof frontmatter.slug !== 'string') {
    throw new Error('Frontmatter "slug" must be a string');
  }

  // Validate excerpt if present
  if (frontmatter.excerpt && typeof frontmatter.excerpt !== 'string') {
    throw new Error('Frontmatter "excerpt" must be a string');
  }

  // Validate tags if present
  if (frontmatter.tags) {
    if (!Array.isArray(frontmatter.tags)) {
      throw new Error('Frontmatter "tags" must be an array');
    }
    if (!frontmatter.tags.every((tag) => typeof tag === 'string')) {
      throw new Error('Frontmatter "tags" must be an array of strings');
    }
  }

  // Validate categories if present
  if (frontmatter.categories) {
    if (!Array.isArray(frontmatter.categories)) {
      throw new Error('Frontmatter "categories" must be an array');
    }
    if (!frontmatter.categories.every((cat) => typeof cat === 'string')) {
      throw new Error('Frontmatter "categories" must be an array of strings');
    }
  }

  // Validate date if present
  if (frontmatter.date) {
    if (typeof frontmatter.date !== 'string') {
      throw new Error('Frontmatter "date" must be a string (ISO 8601 format)');
    }
    // Try to parse date
    const dateObj = new Date(frontmatter.date);
    if (isNaN(dateObj.getTime())) {
      throw new Error(
        'Frontmatter "date" must be a valid ISO 8601 date (e.g., "2024-01-15" or "2024-01-15T10:30:00Z")',
      );
    }
  }

  // Validate wp_post_id if present (should be number)
  if (frontmatter.wp_post_id && typeof frontmatter.wp_post_id !== 'number') {
    throw new Error('Frontmatter "wp_post_id" must be a number');
  }

  // Validate wp_url if present
  if (frontmatter.wp_url && typeof frontmatter.wp_url !== 'string') {
    throw new Error('Frontmatter "wp_url" must be a string');
  }
}
