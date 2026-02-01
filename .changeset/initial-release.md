---
'@md2wp/cli': major
'@md2wp/core': major
---

Initial v1.0.0 release of md2wp - A TypeScript CLI tool and library for publishing markdown files to WordPress with Gutenberg blocks.

## Features

### CLI (@md2wp/cli)

- `md2wp init` - Initialize configuration files
- `md2wp publish` - Publish markdown files to WordPress
- `md2wp validate` - Validate markdown and frontmatter before publishing
- `md2wp config` - Display current configuration
- Support for `--draft`, `--dry-run`, and `--verbose` flags
- Secure authentication using WordPress Application Passwords

### Core Library (@md2wp/core)

- Parse markdown files with frontmatter support
- Transform markdown to Gutenberg block HTML
- Automatic image upload to WordPress Media Library
- Intelligent image caching system
- WordPress REST API integration
- Configuration management with environment variable support
- Full TypeScript support with type definitions

## Supported Features

- **Markdown Elements**: Headings, paragraphs, lists (ordered/unordered), links, images, code blocks, blockquotes
- **Gutenberg Blocks**: Native WordPress block format (not plain HTML)
- **Frontmatter Fields**: title, slug, status, tags, categories, excerpt, date, featured_image
- **Image Processing**: Local image upload, URL replacement, caching, validation
- **Configuration**: File-based (.md2wprc.json) with environment variable overrides
- **Error Handling**: Comprehensive validation and helpful error messages

## Documentation

See the [README](https://github.com/TeamNickHart/md2wp) for full documentation and examples.
