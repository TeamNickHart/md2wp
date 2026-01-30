/**
 * Publish command - Publish markdown to WordPress
 */

import { resolve } from 'path';
import {
  loadConfig,
  parseMarkdownFile,
  extractImages,
  processImagesForDryRun,
  transformToGutenberg,
  ImageCacheManager,
  formatBytes,
  type ImageMap,
  type Md2wpConfig,
} from '@md2wp/core';

interface PublishOptions {
  draft?: boolean;
  dryRun?: boolean;
}

export async function publishCommand(
  filePath: string,
  options: PublishOptions,
): Promise<void> {
  try {
    console.log(`📄 Processing: ${filePath}\n`);

    // Load configuration (but don't validate password in dry-run mode)
    let config: Md2wpConfig;
    try {
      config = await loadConfig();
    } catch (error) {
      // If config doesn't exist and we're in dry-run, use minimal config
      if (options.dryRun) {
        console.log('⚠️  No config found, using defaults for dry-run\n');
        config = {
          wordpress: { siteUrl: 'https://example.com', username: 'user' },
          posts: { defaultStatus: 'draft' as const },
        };
      } else {
        throw error;
      }
    }

    // Parse markdown file
    const absolutePath = resolve(filePath);
    const parsed = await parseMarkdownFile(absolutePath);

    console.log('✅ Parsed frontmatter:');
    console.log(JSON.stringify(parsed.frontmatter, null, 2));
    console.log();

    // Override status if --draft flag is used
    const finalStatus = options.draft
      ? 'draft'
      : parsed.frontmatter.status || config.posts?.defaultStatus || 'draft';

    console.log(`📝 Status: ${finalStatus}`);
    console.log();

    // Extract images
    const images = extractImages(parsed.content);

    // Process images with validation (in dry-run mode)
    let imageMap: ImageMap = {};
    let hasImageErrors = false;

    if (images.length > 0 && options.dryRun) {
      // Load cache
      const cache = new ImageCacheManager();
      await cache.load();

      // Process images
      const processed = await processImagesForDryRun(
        images,
        absolutePath,
        cache,
      );

      console.log(`📸 Validating ${images.length} image(s):\n`);

      let totalSize = 0;
      const toUpload: string[] = [];

      processed.forEach((img) => {
        const status = img.validation.exists ? '✅' : '❌';
        console.log(`   ${status} ${img.path}`);
        console.log(`      → ${img.absolutePath}`);

        if (img.validation.exists) {
          if (img.validation.size) {
            console.log(`      → ${img.validation.sizeFormatted}`);
            totalSize += img.validation.size;
          }

          if (img.cacheHit && img.cachedUrl) {
            console.log(`      → Cache: HIT (would reuse)`);
            console.log(`      → WordPress ID: ${img.cachedMediaId}`);
            console.log(`      → URL: ${img.cachedUrl}`);

            // Use cached URL in image map
            imageMap[img.path] = {
              id: img.cachedMediaId!,
              url: img.cachedUrl,
            };
          } else {
            console.log(`      → Cache: MISS (would upload)`);
            toUpload.push(img.path);

            // Use placeholder URL
            const placeholderIndex = toUpload.length;
            imageMap[img.path] = {
              id: 999 + placeholderIndex,
              url: `https://example.com/wp-content/uploads/image-${placeholderIndex}.jpg`,
            };
          }
        } else {
          hasImageErrors = true;
        }

        // Show errors
        if (img.validation.errors.length > 0) {
          img.validation.errors.forEach((err) => {
            console.log(`      ⚠️  ${err}`);
          });
        }

        // Show warnings
        if (img.validation.warnings.length > 0) {
          img.validation.warnings.forEach((warn) => {
            console.log(`      ⚠️  ${warn}`);
          });
        }

        console.log();
      });

      if (toUpload.length > 0) {
        console.log(`📤 Would upload ${toUpload.length} image(s)`);
        console.log(`📊 Total upload size: ${formatBytes(totalSize)}\n`);
      }

      if (hasImageErrors) {
        console.log('⚠️  Image errors found - publish would fail\n');
      }
    } else if (images.length > 0) {
      // Non-dry-run mode - just show image count
      console.log(`📸 Found ${images.length} image(s)\n`);
      // TODO: Actual image upload would go here
    }

    // Transform to Gutenberg blocks
    const gutenbergContent = transformToGutenberg(parsed.content, imageMap);

    if (options.dryRun) {
      console.log('🔍 DRY RUN - No changes will be made to WordPress\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📋 GENERATED GUTENBERG CONTENT:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log(gutenbergContent);
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n💡 To publish for real, run without --dry-run flag');
      return;
    }

    // Real publish (not yet fully implemented)
    console.log('🚀 Publishing to WordPress...\n');

    // TODO: Create WordPress client
    // TODO: Upload images and get real URLs
    // TODO: Transform with real image URLs
    // TODO: Create/update post
    // TODO: Handle errors

    console.log('❌ Real publishing not yet implemented');
    console.log('   Use --dry-run to preview the Gutenberg output');
    console.log('\n💡 Coming soon: Full publish workflow with image upload');
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Error:', error.message);
      if (error.message.includes('MD2WP_PASSWORD')) {
        console.error(
          '\n💡 For dry-run mode, you can skip setting up credentials:',
        );
        console.error('   md2wp publish post.md --dry-run');
      }
    } else {
      console.error('❌ Unknown error:', error);
    }
    process.exit(1);
  }
}
