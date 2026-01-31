# API Reference

Use `@md2wp/core` as a library in your Node.js applications.

## Installation

```bash
npm install @md2wp/core
```

## WordPress Client

### `WordPressClient`

Main client for interacting with WordPress.

```typescript
import { WordPressClient } from '@md2wp/core';

const client = new WordPressClient({
  siteUrl: 'https://yoursite.com',
  username: 'admin',
  password: 'xxxx xxxx xxxx xxxx'
});
```

#### Methods

##### `validateConnection()`

Validate WordPress connection.

```typescript
await client.validateConnection();
// Returns: Promise<boolean>
```

##### `uploadMedia(filePath, alt?)`

Upload image to WordPress Media Library.

```typescript
const media = await client.uploadMedia('./image.jpg', 'Alt text');
// Returns: Promise<WPMediaResponse>
```

##### `createPost(post)`

Create a new WordPress post.

```typescript
const post = await client.createPost({
  title: 'My Post',
  content: '<!-- wp:paragraph --><p>Content</p><!-- /wp:paragraph -->',
  status: 'draft'
});
// Returns: Promise<WPPostResponse>
```

##### `updatePost(id, post)`

Update existing post.

```typescript
const updated = await client.updatePost(123, {
  title: 'Updated Title'
});
// Returns: Promise<WPPostResponse>
```

##### `getPost(id)`

Get post by ID.

```typescript
const post = await client.getPost(123);
// Returns: Promise<WPPostResponse>
```

## Markdown Processing

### `parseMarkdownFile(filePath)`

Parse markdown file with frontmatter.

```typescript
import { parseMarkdownFile } from '@md2wp/core';

const parsed = await parseMarkdownFile('./post.md');
// Returns: Promise<ParsedPost>

console.log(parsed.frontmatter.title);
console.log(parsed.content);
```

### `transformToGutenberg(content, imageMap?)`

Convert markdown to Gutenberg blocks.

```typescript
import { transformToGutenberg } from '@md2wp/core';

const gutenberg = transformToGutenberg(markdown, {
  './image.jpg': {
    id: 123,
    url: 'https://site.com/image.jpg'
  }
});
// Returns: string
```

### `extractImages(content)`

Extract image references from markdown.

```typescript
import { extractImages } from '@md2wp/core';

const images = extractImages(markdown);
// Returns: ImageRef[]

images.forEach(img => {
  console.log(img.path, img.alt);
});
```

## Image Processing

### `validateImageFile(absolutePath)`

Validate image file.

```typescript
import { validateImageFile } from '@md2wp/core';

const validation = await validateImageFile('/path/to/image.jpg');
// Returns: Promise<ImageValidation>

if (validation.exists) {
  console.log('Size:', validation.sizeFormatted);
}
```

### `processImagesForDryRun(images, markdownPath, cache)`

Process images with validation and cache checking.

```typescript
import { processImagesForDryRun, ImageCacheManager } from '@md2wp/core';

const cache = new ImageCacheManager();
await cache.load();

const processed = await processImagesForDryRun(images, './post.md', cache);
```

## Image Cache

### `ImageCacheManager`

Manage image upload cache.

```typescript
import { ImageCacheManager } from '@md2wp/core';

const cache = new ImageCacheManager();
await cache.load();

// Get cached image
const cached = cache.get('sha256-hash');

// Set cached image
cache.set('sha256-hash', {
  mediaId: 123,
  url: 'https://site.com/image.jpg',
  uploadedAt: new Date().toISOString()
});

// Save cache
await cache.save();
```

## Configuration

### `loadConfig()`

Load `.md2wprc.json` configuration.

```typescript
import { loadConfig } from '@md2wp/core';

const config = await loadConfig();
// Returns: Promise<Md2wpConfig>
```

### `createWPConfig(config)`

Create WordPress config with password from environment.

```typescript
import { createWPConfig, loadConfig } from '@md2wp/core';

const config = await loadConfig();
const wpConfig = createWPConfig(config);
// Returns: WPConfig (includes password from MD2WP_PASSWORD)
```

## Frontmatter

### `updateFrontmatter(filePath, updates)`

Update frontmatter in markdown file.

```typescript
import { updateFrontmatter } from '@md2wp/core';

await updateFrontmatter('./post.md', {
  wp_post_id: 123,
  wp_url: 'https://site.com/post/',
  wp_modified: new Date().toISOString()
});
```

## Type Definitions

### `Frontmatter`

```typescript
interface Frontmatter {
  title: string;
  slug?: string;
  status?: 'draft' | 'publish';
  featured_image?: string;
  tags?: string[];
  categories?: string[];
  excerpt?: string;
  date?: string;
  wp_post_id?: number;
  wp_url?: string;
  wp_modified?: string;
}
```

### `ImageRef`

```typescript
interface ImageRef {
  path: string;
  alt?: string;
}
```

### `ImageMap`

```typescript
interface ImageMap {
  [originalPath: string]: {
    id: number;
    url: string;
  };
}
```

### `WPConfig`

```typescript
interface WPConfig {
  siteUrl: string;
  username: string;
  password: string;
}
```

## Complete Example

```typescript
import {
  WordPressClient,
  parseMarkdownFile,
  extractImages,
  transformToGutenberg,
  ImageCacheManager,
  createWPConfig,
  loadConfig,
  updateFrontmatter
} from '@md2wp/core';

async function publishPost(filePath: string) {
  // 1. Load config
  const config = await loadConfig();
  const wpConfig = createWPConfig(config);

  // 2. Create WordPress client
  const client = new WordPressClient(wpConfig);

  // 3. Validate connection
  await client.validateConnection();

  // 4. Parse markdown
  const parsed = await parseMarkdownFile(filePath);

  // 5. Extract and upload images
  const images = extractImages(parsed.content);
  const imageMap = {};

  for (const img of images) {
    const media = await client.uploadMedia(img.path, img.alt);
    imageMap[img.path] = {
      id: media.id,
      url: media.source_url
    };
  }

  // 6. Transform to Gutenberg
  const content = transformToGutenberg(parsed.content, imageMap);

  // 7. Create post
  const post = await client.createPost({
    title: parsed.frontmatter.title,
    content: content,
    status: parsed.frontmatter.status || 'draft'
  });

  // 8. Update frontmatter
  await updateFrontmatter(filePath, {
    wp_post_id: post.id,
    wp_url: post.link,
    wp_modified: post.modified
  });

  return post;
}
```

## Next Steps

- [CLI Commands →](/reference/cli-commands)
- [Configuration →](/reference/configuration)
- [Publishing Guide →](/guide/publishing)
