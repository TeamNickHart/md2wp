---
title: 'Example Post with Images'
slug: example-images
status: draft
excerpt: 'Demonstrating image handling in md2wp'
tags:
  - examples
  - images
categories:
  - Tutorials
---

# Working with Images

This example shows how md2wp handles local images.

## Local Image Example

![Sample screenshot](./images/screenshot.png)

Images are automatically:

- Uploaded to WordPress media library
- Cached to avoid duplicate uploads
- Validated for size and existence
- Converted to proper Gutenberg image blocks

## Image Features

- ✅ Automatic upload on publish
- ✅ SHA-256 based caching
- ✅ Size validation and warnings
- ✅ Alt text preservation
- ✅ Responsive WordPress srcset

## Testing

To test with real images, add some files to `examples/images/` and run:

```bash
pnpm cli publish examples/post-with-images.md --dry-run
```

The dry-run will show whether images exist and their sizes.
