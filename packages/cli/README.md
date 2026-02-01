# @md2wp/cli

> CLI tool for publishing markdown files to WordPress with Gutenberg blocks

[![npm version](https://img.shields.io/npm/v/@md2wp/cli.svg)](https://www.npmjs.com/package/@md2wp/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 📝 Publish markdown files directly to WordPress
- 🎨 Converts markdown to **Gutenberg blocks** (not plain HTML!)
- 🖼️ Automatic image upload and URL replacement
- 🔄 Intelligent image caching (avoid duplicate uploads)
- ✅ Validate markdown and frontmatter before publishing
- 📋 View current configuration
- 🔐 Secure authentication using WordPress Application Passwords

## Installation

```bash
npm install -g @md2wp/cli
```

## Quick Start

```bash
# Initialize configuration
md2wp init

# Validate a markdown file
md2wp validate my-post.md

# Publish to WordPress
md2wp publish my-post.md

# View configuration
md2wp config
```

## Commands

### `md2wp init`

Create `.md2wprc.json` and `.env` configuration files.

### `md2wp validate <file>`

Validate markdown file before publishing.

Options:

- `--verbose` - Show detailed validation output

### `md2wp publish <file>`

Publish a markdown file to WordPress.

Options:

- `--draft` - Publish as draft (override frontmatter)
- `--dry-run` - Preview without making API calls

### `md2wp config`

Show current configuration.

Options:

- `--verbose` - Show full configuration JSON

## Configuration

Create a `.md2wprc.json` file:

```json
{
  "wordpress": {
    "siteUrl": "https://yoursite.com",
    "username": "your-username"
  },
  "posts": {
    "defaultStatus": "draft",
    "defaultAuthor": 1
  },
  "images": {
    "basePath": "./images",
    "uploadPath": "/wp-content/uploads/md2wp/"
  }
}
```

Create a `.env` file:

```bash
MD2WP_PASSWORD=your-application-password
```

## Frontmatter

Add frontmatter to your markdown files:

```markdown
---
title: 'My Post Title'
status: draft
slug: my-post-slug
tags:
  - tutorial
  - markdown
categories:
  - development
excerpt: 'A short description'
date: 2024-01-15
---

# Your Content Here

![Hero Image](./images/hero.png)
```

## Documentation

For full documentation, visit [https://github.com/TeamNickHart/md2wp](https://github.com/TeamNickHart/md2wp)

## License

MIT © Nicholas Hart
