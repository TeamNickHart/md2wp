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
  updateFrontmatter,
  createWPConfig,
  WordPressClient,
  type ImageMap,
  type Md2wpConfig,
  type ImageRef,
} from '@md2wp/core';

interface PublishOptions {
  draft?: boolean;
  dryRun?: boolean;
}

/**
 * Upload images to WordPress and build image map
 */
async function uploadImages(
  images: ImageRef[],
  markdownFilePath: string,
  client: WordPressClient,
  cache: ImageCacheManager,
): Promise<ImageMap> {
  const imageMap: ImageMap = {};

  // First, validate all images exist (fail fast)
  const processed = await processImagesForDryRun(
    images,
    markdownFilePath,
    cache,
  );

  const missingImages = processed.filter((img) => !img.validation.exists);
  if (missingImages.length > 0) {
    console.error('\n❌ Missing images:');
    missingImages.forEach((img) => {
      console.error(`   • ${img.path}`);
      console.error(`     ${img.absolutePath}`);
    });
    throw new Error(
      `Cannot publish: ${missingImages.length} image(s) not found`,
    );
  }

  // Process each image
  let uploadCount = 0;
  let cacheHitCount = 0;

  for (let i = 0; i < processed.length; i++) {
    const img = processed[i]!; // Safe: i is within array bounds
    const progress = `[${i + 1}/${processed.length}]`;

    // Check if cached
    if (img.cacheHit && img.cachedMediaId && img.cachedUrl) {
      // Verify media still exists in WordPress
      console.log(`${progress} 🔍 Verifying cached image: ${img.path}`);
      const exists = await client.verifyMedia(img.cachedMediaId);

      if (exists) {
        console.log(`${progress} ✅ Cache hit: ${img.path}`);
        imageMap[img.path] = {
          id: img.cachedMediaId,
          url: img.cachedUrl,
        };
        cacheHitCount++;
        continue;
      } else {
        console.log(
          `${progress} ⚠️  Cached media no longer exists, re-uploading...`,
        );
      }
    }

    // Upload image
    console.log(`${progress} 📤 Uploading: ${img.path}`);
    try {
      const response = await client.uploadMedia(img.absolutePath, img.alt);

      // Add to image map
      imageMap[img.path] = {
        id: response.id,
        url: response.source_url,
      };

      // Update cache
      if (img.cacheKey) {
        cache.set(img.cacheKey, {
          mediaId: response.id,
          url: response.source_url,
          uploadedAt: new Date().toISOString(),
        });
      }

      console.log(`${progress} ✅ Uploaded: ${response.source_url}`);
      uploadCount++;
    } catch (error) {
      console.error(`${progress} ❌ Failed to upload: ${img.path}`);
      throw error;
    }
  }

  // Save cache
  await cache.save();

  // Summary
  console.log();
  if (cacheHitCount > 0) {
    console.log(`✅ Reused ${cacheHitCount} cached image(s)`);
  }
  if (uploadCount > 0) {
    console.log(`✅ Uploaded ${uploadCount} new image(s)`);
  }
  console.log();

  return imageMap;
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
    let gutenbergContent = '';

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
            console.log('      → Cache: HIT (would reuse)');
            console.log(`      → WordPress ID: ${img.cachedMediaId}`);
            console.log(`      → URL: ${img.cachedUrl}`);

            // Use cached URL in image map
            imageMap[img.path] = {
              id: img.cachedMediaId!,
              url: img.cachedUrl,
            };
          } else {
            console.log('      → Cache: MISS (would upload)');
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

      // Transform to Gutenberg blocks (for dry-run preview)
      gutenbergContent = transformToGutenberg(parsed.content, imageMap);
    }

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

    // Real publish
    console.log('🚀 Publishing to WordPress...\n');

    // Create WordPress client
    const wpConfig = createWPConfig(config);
    const client = new WordPressClient(wpConfig);

    // Validate connection
    console.log('🔌 Validating connection...');
    try {
      await client.validateConnection();
      console.log('✅ Connected to WordPress\n');
    } catch (error) {
      console.error('❌ Connection failed');
      if (error instanceof Error) {
        console.error(`   ${error.message}`);
      }
      console.error('\n💡 Tips:');
      console.error('   • Check your WordPress URL in .md2wprc.json');
      console.error('   • Verify your Application Password in .env');
      console.error('   • Run `md2wp init` to reconfigure');
      throw error;
    }

    // Upload images
    if (images.length > 0) {
      console.log(`📸 Processing ${images.length} image(s)...\n`);

      const cache = new ImageCacheManager();
      await cache.load();

      imageMap = await uploadImages(images, absolutePath, client, cache);
    }

    // Transform content with real image URLs
    const content = transformToGutenberg(parsed.content, imageMap);

    // Prepare post data
    const postData = {
      title: parsed.frontmatter.title,
      content,
      status: finalStatus,
      ...(parsed.frontmatter.slug && { slug: parsed.frontmatter.slug }),
      ...(parsed.frontmatter.excerpt && {
        excerpt: parsed.frontmatter.excerpt,
      }),
      ...(parsed.frontmatter.date && { date: parsed.frontmatter.date }),
      // TODO: Handle tags and categories (need to look up IDs)
    };

    // Create post
    console.log('📝 Creating post...');
    const post = await client.createPost(postData);
    console.log(`✅ Post created: ${post.link}\n`);

    // Write back frontmatter with post details
    try {
      await updateFrontmatter(absolutePath, {
        wp_post_id: post.id,
        wp_url: post.link,
        wp_modified: post.modified,
      });
      console.log('✅ Updated frontmatter with post details\n');
    } catch (error) {
      console.warn('⚠️  Could not update frontmatter (post is published)');
      if (error instanceof Error) {
        console.warn(`   ${error.message}\n`);
      }
    }

    // Success!
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 SUCCESS!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`📄 Title: ${post.title.rendered}`);
    console.log(`🔗 URL: ${post.link}`);
    console.log(`📝 Status: ${post.status}`);
    console.log(`🆔 Post ID: ${post.id}\n`);
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
