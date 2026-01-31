# Dry Run Mode

Preview Gutenberg output without publishing to WordPress.

## What is Dry Run?

Dry run mode lets you see exactly what will be published without making any changes to WordPress.

## Usage

```bash
md2wp publish post.md --dry-run
```

## What You Get

### 1. Frontmatter Validation

```
✅ Parsed frontmatter:
{
  "title": "My Post",
  "status": "draft",
  "tags": ["tutorial"]
}
```

### 2. Image Validation

```
📸 Validating 2 image(s):

   ✅ ./images/hero.png
      → /full/path/to/images/hero.png
      → 156 KB
      → Cache: HIT (would reuse)

   ❌ ./images/missing.jpg
      → /full/path/to/images/missing.jpg
      ⚠️  File not found
```

### 3. Gutenberg Preview

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 GENERATED GUTENBERG CONTENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading">My Post</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Content here...</p>
<!-- /wp:paragraph -->
```

## Use Cases

- **Test configuration** - Verify WordPress connection works
- **Validate images** - Check all images exist and aren't too large
- **Preview blocks** - See Gutenberg output before publishing
- **Debug issues** - Find problems before publishing

## Next Steps

- [Publishing Guide →](/guide/publishing)
- [Working with Images →](/guide/images)
