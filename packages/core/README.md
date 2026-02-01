# @md2wp/core

> Core library for publishing markdown files to WordPress with Gutenberg blocks

[![npm version](https://img.shields.io/npm/v/@md2wp/core.svg)](https://www.npmjs.com/package/@md2wp/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 📝 Parse markdown files with frontmatter
- 🎨 Transform markdown to Gutenberg block HTML
- 🖼️ Extract and process images from markdown
- 📤 Upload images to WordPress Media Library
- 🔄 Image caching system (avoid duplicate uploads)
- 🔐 WordPress REST API integration
- ⚙️ Configuration management with environment variables

## Installation

```bash
npm install @md2wp/core
```

## Usage

### Parse Markdown

```typescript
import { parseMarkdownFile } from '@md2wp/core';

const parsed = await parseMarkdownFile('./my-post.md');
console.log(parsed.frontmatter.title);
console.log(parsed.content);
console.log(parsed.images);
```

### Transform to Gutenberg

```typescript
import { transformToGutenberg } from '@md2wp/core';

const gutenbergHTML = transformToGutenberg(markdownContent, imageMap);
```

### Upload to WordPress

```typescript
import { WordPressClient, createPost } from '@md2wp/core';

const client = new WordPressClient({
  siteUrl: 'https://yoursite.com',
  username: 'your-username',
  password: 'your-app-password',
});

const post = await createPost(client, {
  title: 'My Post',
  content: gutenbergHTML,
  status: 'draft',
});
```

### Image Processing

```typescript
import { extractImages, uploadImages, ImageCacheManager } from '@md2wp/core';

// Extract images from markdown
const images = extractImages(markdownContent);

// Upload images to WordPress
const cache = new ImageCacheManager();
await cache.load();

const imageMap = await uploadImages(client, images, markdownPath, cache);
await cache.save();
```

### Configuration

```typescript
import { loadConfig, createWPConfig } from '@md2wp/core';

// Load configuration from .md2wprc.json
const config = await loadConfig();

// Create WordPress API config
const wpConfig = createWPConfig(config);
```

## API Reference

### Markdown Processing

- `parseMarkdownFile(filePath: string): Promise<ParsedPost>` - Parse markdown file
- `extractImages(markdown: string): ImageRef[]` - Extract image references
- `transformToGutenberg(markdown: string, imageMap: ImageMap): string` - Convert to Gutenberg blocks

### WordPress API

- `WordPressClient` - WordPress REST API client
- `createPost(client, post): Promise<WPPostResponse>` - Create new post
- `updatePost(client, id, post): Promise<WPPostResponse>` - Update existing post
- `uploadImage(client, imagePath): Promise<WPMediaResponse>` - Upload image

### Image Processing

- `uploadImages(client, images, basePath, cache): Promise<ImageMap>` - Upload all images
- `processImagesForDryRun(images, basePath, cache): Promise<ProcessedImage[]>` - Validate images
- `ImageCacheManager` - Manage image upload cache

### Configuration

- `loadConfig(configPath?: string): Promise<Md2wpConfig>` - Load configuration
- `createWPConfig(config): WPConfig` - Create WordPress API config
- `validateConfig(config): void` - Validate configuration structure

### Frontmatter

- `updateFrontmatter(filePath, updates): Promise<void>` - Update frontmatter in file

## Types

```typescript
interface Md2wpConfig {
  wordpress: {
    siteUrl: string;
    username: string;
  };
  posts?: {
    defaultStatus?: 'draft' | 'publish';
    defaultAuthor?: number;
  };
  images?: {
    basePath?: string;
    uploadPath?: string;
  };
}

interface ParsedPost {
  frontmatter: Frontmatter;
  content: string;
  images: ImageRef[];
}

interface Frontmatter {
  title: string;
  slug?: string;
  status?: 'draft' | 'publish';
  tags?: string[];
  categories?: string[];
  excerpt?: string;
  date?: string;
  wp_post_id?: number;
  wp_url?: string;
}
```

## Documentation

For full documentation and examples, visit [https://github.com/TeamNickHart/md2wp](https://github.com/TeamNickHart/md2wp)

## License

MIT © Nicholas Hart
