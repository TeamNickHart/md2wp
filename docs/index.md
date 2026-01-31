---
layout: home

hero:
  name: md2wp
  text: Markdown to WordPress
  tagline: Publish markdown files to WordPress with automatic Gutenberg block conversion and image management
  image:
    src: /hero-image.svg
    alt: md2wp
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/TeamNickHart/md2wp

features:
  - icon: 📝
    title: Write in Markdown
    details: Use your favorite markdown editor. md2wp handles the conversion to WordPress.

  - icon: 🎨
    title: Gutenberg Blocks
    details: Converts to proper Gutenberg blocks, not plain HTML. Full WordPress editing experience.

  - icon: 🖼️
    title: Automatic Images
    details: Local images are automatically uploaded to WordPress Media Library with smart caching.

  - icon: 🔐
    title: Secure Auth
    details: Uses WordPress Application Passwords for secure, token-based authentication.

  - icon: ⚡
    title: Fast & Efficient
    details: SHA-256 based caching prevents duplicate uploads. Images are uploaded once and reused.

  - icon: 🧪
    title: Dry Run Mode
    details: Preview Gutenberg output before publishing. Test without touching WordPress.

  - icon: 📦
    title: CLI & Library
    details: Use as a command-line tool or integrate into your Node.js applications.

  - icon: 🎯
    title: Full GFM Support
    details: Headings, lists, images, links, code blocks, blockquotes, and more.

  - icon: 🔄
    title: Post Updates
    details: Frontmatter tracks WordPress post IDs. Updates coming in v1.3.0.
---

## Quick Start

```bash
# Install globally
npm install -g @md2wp/cli

# Initialize configuration
md2wp init

# Publish your first post
md2wp publish my-post.md
```

## Example Markdown

```markdown
---
title: "My First WordPress Post"
status: draft
tags:
  - tutorial
  - markdown
---

# Hello WordPress!

This is my **first post** published with md2wp.

![Hero Image](./images/hero.png)

- Markdown is converted to Gutenberg blocks
- Images are automatically uploaded
- Links work perfectly

Check out my [website](https://example.com)!
```

## What You Get

After publishing, your markdown file is updated with WordPress details:

```markdown
---
title: "My First WordPress Post"
wp_post_id: 123
wp_url: https://yoursite.com/my-first-post/
wp_modified: 2024-01-15T10:30:00Z
---
```

Ready to get started? [Follow the installation guide →](/guide/installation)
