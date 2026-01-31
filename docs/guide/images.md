# Working with Images

md2wp automatically uploads local images to WordPress Media Library and replaces paths with WordPress URLs.

## Basic Image Syntax

Use standard markdown image syntax:

```markdown
![Alt text](./images/photo.jpg)
```

md2wp will:

1. Find the image file
2. Upload to WordPress Media Library
3. Replace path with WordPress URL
4. Cache for future use

## Image Paths

### Relative Paths (Recommended)

Relative to the markdown file:

```markdown
![Logo](./logo.png)
![Hero](./images/hero.jpg)
![Screenshot](../assets/screenshot.png)
```

**Directory structure:**

```
my-blog/
├── post.md
├── logo.png
└── images/
    └── hero.jpg
```

### Absolute Paths

From project root:

```markdown
![Logo](/assets/logo.png)
```

::: tip
Relative paths are more portable when moving files around.
:::

### Remote URLs

External images are left unchanged:

```markdown
![Remote](https://example.com/image.jpg)
```

md2wp doesn't upload these - WordPress loads them directly.

## Image Upload Process

### 1. Validation

Before uploading, md2wp checks:

- ✅ File exists
- ✅ File size (warns if >2MB, errors if >10MB)
- ✅ Readable by the process

### 2. Cache Check

Image is hashed (SHA-256) and checked against cache:

```json
// .md2wp/cache.json
{
  "images": {
    "a1b2c3d4...": {
      "mediaId": 123,
      "url": "https://site.com/wp-content/uploads/image.jpg",
      "uploadedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### 3. Upload or Reuse

- **Cache hit**: Verify media exists in WordPress, reuse
- **Cache miss**: Upload to WordPress Media Library

### 4. URL Replacement

Gutenberg image block is generated with WordPress URL:

```html
<!-- wp:image {"id":123,"sizeSlug":"large"} -->
<figure class="wp-block-image size-large">
  <img
    src="https://site.com/wp-content/uploads/image.jpg"
    alt="Alt text"
    class="wp-image-123"
  />
</figure>
<!-- /wp:image -->
```

## Alt Text

Alt text is preserved from markdown:

```markdown
![A beautiful sunset over the ocean](./sunset.jpg)
```

↓

```html
<img src="..." alt="A beautiful sunset over the ocean" />
```

::: tip Accessibility
Always provide descriptive alt text for better accessibility and SEO.
:::

## Image Validation

### Dry Run Validation

See image validation before uploading:

```bash
md2wp publish post.md --dry-run
```

Output:

```
📸 Validating 3 image(s):

   ✅ ./images/hero.png
      → /full/path/to/images/hero.png
      → 156 KB
      → Cache: HIT (would reuse)
      → WordPress ID: 45
      → URL: https://site.com/.../hero.png

   ✅ ./images/logo.jpg
      → /full/path/to/images/logo.jpg
      → 2.8 MB
      → Cache: MISS (would upload)
      ⚠️  Large file size: 2.8 MB (recommend <2 MB)

   ❌ ./images/missing.png
      → /full/path/to/images/missing.png
      ⚠️  File not found

📤 Would upload 1 image(s)
📊 Total upload size: 2.8 MB

⚠️  Image errors found - publish would fail
```

### File Size Warnings

- **< 2 MB**: ✅ Good
- **2-10 MB**: ⚠️ Warning (recommend optimizing)
- **> 10 MB**: ❌ Error (WordPress usually rejects)

::: tip Coming in v1.2.0
Full image validation:

- Format checking (JPEG, PNG, WebP, GIF, SVG)
- Dimension validation
- EXIF data extraction
- Optimization suggestions
  :::

## Publish Progress

During real publish, you'll see upload progress:

```
📸 Processing 3 image(s)...

[1/3] 🔍 Verifying cached image: ./images/hero.png
[1/3] ✅ Cache hit: ./images/hero.png

[2/3] 📤 Uploading: ./images/logo.jpg
[2/3] ✅ Uploaded: https://site.com/.../logo.jpg

[3/3] 📤 Uploading: ./images/new.png
[3/3] ✅ Uploaded: https://site.com/.../new.png

✅ Reused 1 cached image(s)
✅ Uploaded 2 new image(s)
```

## Image Caching

### How It Works

md2wp caches uploaded images using SHA-256 hash:

1. **Hash file** → `a1b2c3...`
2. **Check cache** → Previously uploaded?
3. **If yes** → Verify in WordPress, reuse
4. **If no** → Upload, add to cache

### Cache Benefits

- 🚀 **Faster** - No re-upload of existing images
- 💾 **Storage** - Prevents duplicates in WordPress
- ✅ **Reliable** - Verifies media still exists

### Cache Location

Cache is stored in `.md2wp/cache.json`:

```json
{
  "images": {
    "sha256-hash-here": {
      "mediaId": 123,
      "url": "https://site.com/wp-content/uploads/2024/01/image.jpg",
      "uploadedAt": "2024-01-15T10:30:00Z",
      "verified": "2024-01-16T08:00:00Z"
    }
  }
}
```

::: tip
Commit `.md2wp/` to Git to share cache with your team.
:::

### Cache Invalidation

Cache is automatically invalidated when:

- Image file content changes (new hash)
- Media deleted from WordPress (verification fails)

Manual cache clear:

```bash
rm -rf .md2wp/cache.json
```

[Learn more about caching →](/guide/caching)

## Supported Formats

Current support (v1.0):

- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)
- ✅ GIF (.gif)
- ✅ WebP (.webp)
- ✅ SVG (.svg)

::: tip Coming in v1.2.0
Format validation and warnings for unsupported formats.
:::

## Image Optimization

::: tip Coming in v1.4.0
Automatic optimization before upload:

```json
// .md2wprc.json
{
  "images": {
    "optimize": true,
    "maxWidth": 2000,
    "quality": 85,
    "format": "webp" // Convert to WebP
  }
}
```

Features:

- Resize large images
- Convert to WebP
- Compress JPEG/PNG
- Strip EXIF data
  :::

Current workaround - optimize before publishing:

```bash
# Using ImageMagick
magick hero.jpg -resize 2000x2000\> -quality 85 hero-opt.jpg

# Using sharp-cli
npm install -g sharp-cli
sharp -i hero.jpg -o hero-opt.jpg resize 2000 --quality 85
```

## Inline Images

Images can be inline with text:

```markdown
Here's a small icon ![icon](./icon.png) in the middle of text.
```

md2wp generates:

```html
<p>Here's a small icon <img src="..." alt="icon" /> in the middle of text.</p>
```

## Featured Images

::: tip Coming in v1.4.0
Set featured image in frontmatter:

```yaml
---
title: 'Post Title'
featured_image: ./images/hero.jpg
---
```

md2wp will upload and set as post's featured image.
:::

Current workaround - set manually in WordPress after publishing.

## Image Galleries

::: tip Coming in v1.5.0
Create galleries with multiple images:

```markdown
::: gallery
![Image 1](./img1.jpg)
![Image 2](./img2.jpg)
![Image 3](./img3.jpg)
:::
```

Converts to `<!-- wp:gallery -->` block.
:::

## Troubleshooting

### Image Not Found

```
❌ ./images/photo.jpg
   File not found
```

**Fix:**

- Check path is relative to markdown file
- Verify file exists
- Check file name (case-sensitive on Linux/macOS)

### Image Too Large

```
⚠️  Large file size: 8.5 MB (recommend <2 MB)
```

**Fix:**

```bash
# Optimize with ImageMagick
magick input.jpg -resize 2000x2000\> -quality 80 output.jpg

# Or use online tools
# - TinyPNG: https://tinypng.com
# - Squoosh: https://squoosh.app
```

### Upload Failed

```
❌ Failed to upload: ./image.jpg
   Failed to upload media: 500 Internal Server Error
```

**Common causes:**

- WordPress upload limit too low
- File type not allowed
- Permissions issue on WordPress server

**Fix:**

- Check WordPress max upload size
- Check allowed file types in WordPress
- Contact hosting provider

### Cache Issues

If images aren't being reused:

```bash
# Clear cache and try again
rm -rf .md2wp/cache.json
md2wp publish post.md
```

## Best Practices

### ✅ Do

- ✅ Use relative paths
- ✅ Optimize images before uploading
- ✅ Provide descriptive alt text
- ✅ Keep images <2 MB
- ✅ Organize images in subdirectories
- ✅ Use descriptive file names

### ❌ Don't

- ❌ Use absolute system paths
- ❌ Upload huge images (>10 MB)
- ❌ Leave alt text empty
- ❌ Mix different path styles
- ❌ Use special characters in file names

## Examples

### Blog Post with Images

```markdown
---
title: 'Travel Photography Tips'
---

# Travel Photography Tips

Here are some tips for better travel photos:

![Beautiful sunset](./images/sunset.jpg)

## Equipment

I recommend this camera:

![Canon EOS](./gear/canon.jpg)

## Examples

Here's a before and after:

![Before](./examples/before.jpg)
![After](./examples/after.jpg)
```

### Tutorial with Screenshots

```markdown
---
title: 'How to Use WordPress'
---

# Getting Started

1. Log into WordPress:
   ![Login Screen](./screenshots/login.png)

2. Create a new post:
   ![New Post](./screenshots/new-post.png)

3. Publish:
   ![Publish Button](./screenshots/publish.png)
```

## Next Steps

- [Image Caching Guide →](/guide/caching)
- [Dry Run Mode →](/guide/dry-run)
- [Troubleshooting →](/guide/troubleshooting)
