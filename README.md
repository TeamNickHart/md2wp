# md2wp

A TypeScript CLI tool and library for publishing markdown files to WordPress, with automatic image upload and management.

## Project Status

🚧 **This project is in active development** - Currently completing Step 2/13: Core library implementation

## Quick Start

```bash
# Install (coming soon to npm)
npm install -g @md2wp/cli

# Initialize configuration
md2wp init

# Publish a markdown file to WordPress
md2wp publish my-post.md
```

## Packages

- **[@md2wp/core](./packages/core)** - Core library for WordPress API integration and markdown processing
- **[@md2wp/cli](./packages/cli)** - Command-line interface for publishing markdown to WordPress
- **[@md2wp/vscode](./packages/vscode)** - VS Code extension (scaffold only for v1)
- **[docs](./apps/docs)** - VitePress documentation site

## Development

This is a monorepo managed with [pnpm](https://pnpm.io/) and [Turborepo](https://turbo.build/).

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Getting Started

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint and format
pnpm lint
pnpm format

# Run documentation site locally
pnpm docs:dev
```

### Available Scripts

- `pnpm build` - Build all packages
- `pnpm dev` - Run all packages in watch mode
- `pnpm test` - Run tests in all packages
- `pnpm lint` - Lint all packages
- `pnpm lint:fix` - Fix lint issues
- `pnpm format` - Format code with Prettier
- `pnpm typecheck` - Type check all packages
- `pnpm clean` - Clean build artifacts
- `pnpm changeset` - Create a changeset for version management

## Features

- 📝 Publish markdown files directly to WordPress
- 🎨 Converts markdown to **Gutenberg blocks** (not plain HTML!)
- 🖼️ Automatic image upload and URL replacement
- 🔄 Intelligent image caching (avoid duplicate uploads)
- ⚙️ Flexible configuration via `.md2wprc.json`
- 🎯 Support for GFM: paragraphs, headings, lists, images, links, code blocks
- 🔐 Secure authentication using WordPress Application Passwords
- 🧪 Dry-run mode to preview changes (coming soon)
- 📦 Published as both CLI tool and library

## Authentication

md2wp uses **WordPress Application Passwords** for secure authentication. These are special passwords just for apps (not your main WordPress password).

### Setup Authentication

1. **Initialize md2wp** in your project:
   ```bash
   md2wp init
   ```
   This creates two files:
   - `.md2wprc.json` - WordPress site URL and username
   - `.env` - Your Application Password (keep this secret!)

2. **Create an Application Password** in WordPress:
   - Log into your WordPress admin
   - Go to **Users → Profile** (or `/wp-admin/profile.php`)
   - Scroll to "Application Passwords" section
   - Enter `md2wp` as the application name
   - Click "Add New Application Password"
   - **Copy the generated password** (it looks like: `xxxx xxxx xxxx xxxx`)

3. **Add password to `.env`**:
   ```bash
   # .env
   MD2WP_PASSWORD=xxxx xxxx xxxx xxxx
   ```

4. **Update `.md2wprc.json`** with your site details:
   ```json
   {
     "wordpress": {
       "siteUrl": "https://yoursite.com",
       "username": "your-username"
     },
     "posts": {
       "defaultStatus": "draft"
     }
   }
   ```

5. **⚠️ Important:** Add `.env` to your `.gitignore`:
   ```gitignore
   .env
   ```

### Environment Variables

You can also set credentials via environment variables:

```bash
export MD2WP_PASSWORD="xxxx xxxx xxxx xxxx"
export MD2WP_SITE_URL="https://yoursite.com"
export MD2WP_USERNAME="your-username"
```

Environment variables take precedence over config file settings.

## Usage

### Publish a Post

Create a markdown file with frontmatter:

```markdown
---
title: "My First Post"
status: draft
tags:
  - tutorial
  - markdown
categories:
  - development
---

# Hello WordPress!

This is my **first post** published with md2wp.

![Hero Image](./images/hero.png)

- Markdown is converted to Gutenberg blocks
- Images are automatically uploaded
- Links work perfectly

Check out my [website](https://example.com)!
```

Publish it:

```bash
md2wp publish my-first-post.md
```

### Frontmatter Options

```yaml
---
title: "Post Title"              # Required
slug: custom-url-slug            # Optional
status: draft | publish          # Optional (default: draft)
featured_image: ./images/hero.jpg # Optional
tags:                            # Optional
  - tag1
  - tag2
categories:                      # Optional
  - category1
excerpt: "Short description"     # Optional
date: 2024-01-15                 # Optional
---
```

### CLI Commands

```bash
# Initialize config files
md2wp init

# Publish a post
md2wp publish post.md

# Publish as draft (override frontmatter)
md2wp publish post.md --draft

# Dry run (preview without publishing)
md2wp publish post.md --dry-run

# Validate frontmatter and config
md2wp validate post.md

# Show current config
md2wp config
```

## How It Works

1. **Parse** - Reads your markdown file and extracts frontmatter
2. **Process Images** - Finds local images, uploads to WordPress Media Library
3. **Transform** - Converts markdown to Gutenberg block HTML format
4. **Publish** - Sends to WordPress REST API
5. **Cache** - Remembers uploaded images (avoids duplicates)

### Gutenberg Block Format

md2wp converts your markdown to proper Gutenberg blocks:

```markdown
# Heading
```
→
```html
<!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading">Heading</h1>
<!-- /wp:heading -->
```

```markdown
![Alt text](./image.png)
```
→
```html
<!-- wp:image {"id":123,"sizeSlug":"large"} -->
<figure class="wp-block-image size-large">
  <img src="https://site.com/wp-content/uploads/image.jpg"
       alt="Alt text"
       class="wp-image-123"/>
</figure>
<!-- /wp:image -->
```

This means:
- ✅ WordPress knows these are "real" images (not just HTML)
- ✅ Automatic responsive srcsets
- ✅ Native Gutenberg editing experience
- ✅ Future-proof with WordPress

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for planned features and improvements.

## License

MIT © Nicholas Hart
