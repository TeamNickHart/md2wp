# Publishing Posts

Learn how to publish markdown files to WordPress using md2wp.

## Basic Publishing

### Create a Markdown File

Create `my-post.md` with frontmatter:

```markdown
---
title: 'My First Post'
status: draft
---

# Hello WordPress!

This is my first post using md2wp.
```

### Publish

```bash
md2wp publish my-post.md
```

Output:

```
🚀 Publishing to WordPress...

🔌 Validating connection...
✅ Connected to WordPress

📝 Creating post...
✅ Post created: https://yoursite.com/my-first-post/

✅ Updated frontmatter with post details

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 SUCCESS!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Title: My First Post
🔗 URL: https://yoursite.com/my-first-post/
📝 Status: draft
🆔 Post ID: 123
```

## Publish Options

### Draft Mode (Default)

Publish as draft:

```bash
md2wp publish post.md
# or explicitly
md2wp publish post.md --draft
```

### Publish Immediately

Bypass draft status:

```bash
md2wp publish post.md --publish
```

::: warning
Using `--publish` will make your post public immediately, even if frontmatter says `draft`.
:::

### Dry Run Mode

Preview without publishing:

```bash
md2wp publish post.md --dry-run
```

Shows:

- Parsed frontmatter
- Image validation
- Generated Gutenberg blocks
- **No changes made to WordPress**

[Learn more about dry-run →](/guide/dry-run)

## What Happens When You Publish

### 1. Validation

md2wp validates:

- ✅ Configuration exists
- ✅ WordPress connection works
- ✅ Frontmatter has required fields
- ✅ All images exist locally

### 2. Image Upload

For each local image:

1. Check cache (SHA-256 hash)
2. If cached: verify still exists in WordPress
3. If not cached: upload to WordPress Media Library
4. Update cache with WordPress media ID and URL

[Learn more about images →](/guide/images)

### 3. Content Transformation

Markdown is converted to Gutenberg blocks:

```markdown
## Heading
```

↓

```html
<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">Heading</h2>
<!-- /wp:heading -->
```

[Learn more about Gutenberg →](/guide/gutenberg)

### 4. Post Creation

Post is created via WordPress REST API with:

- Title from frontmatter
- Gutenberg block content
- Status (draft/publish)
- Slug (if specified)
- Tags and categories (if specified)
- Excerpt (if specified)
- Date (if specified)

### 5. Frontmatter Update

Your markdown file is updated with WordPress post details:

```markdown
---
title: 'My First Post'
status: draft
wp_post_id: 123
wp_url: https://yoursite.com/my-first-post/
wp_modified: 2024-01-15T10:30:00Z
---
```

These fields enable future post updates (coming in v1.3.0).

## Post Status

Control post visibility with `status`:

```yaml
---
title: "Post Title"
status: draft    # Private, only visible to editors
# or
status: publish  # Public, visible to everyone
---
```

**Priority:**

1. `--draft` or `--publish` flag (highest)
2. Frontmatter `status` field
3. `.md2wprc.json` `defaultStatus`
4. Default: `draft`

## Slugs and URLs

### Auto-Generated Slugs

WordPress generates slug from title:

```yaml
---
title: 'My First WordPress Post'
---
```

→ URL: `https://yoursite.com/my-first-wordpress-post/`

### Custom Slugs

Specify your own slug:

```yaml
---
title: 'My First WordPress Post'
slug: first-post
---
```

→ URL: `https://yoursite.com/first-post/`

## Tags and Categories

### Tags

```yaml
---
title: 'Post Title'
tags:
  - tutorial
  - markdown
  - wordpress
---
```

::: warning Current Limitation (v1.0)
Tags and categories are not yet implemented. They're parsed but not sent to WordPress.

**Coming in v1.2.0:** Automatic tag/category creation if they don't exist.
:::

### Categories

```yaml
---
title: 'Post Title'
categories:
  - Technology
  - Tutorials
---
```

## Excerpts

Add a custom excerpt:

```yaml
---
title: 'Post Title'
excerpt: 'A brief summary of this post that appears in post listings.'
---
```

If omitted, WordPress auto-generates from content.

## Post Dates

### Publish Date

```yaml
---
title: 'Post Title'
date: 2024-01-15
---
```

Supports formats:

- `2024-01-15`
- `2024-01-15T10:30:00`
- `2024-01-15T10:30:00Z`

::: tip
For scheduled posts, combine with `status: publish` (coming in v1.3.0).
:::

### Auto-Date

If no `date` specified, WordPress uses current date/time.

## Batch Publishing

::: tip Coming in v2.2.0
Publish multiple posts:

```bash
md2wp publish posts/*.md
md2wp publish blog/**/*.md
```

:::

Current workaround with bash:

```bash
for file in posts/*.md; do
  md2wp publish "$file"
done
```

## Error Handling

### Connection Failed

```
❌ Connection failed
   Authentication failed: 401 Unauthorized
```

**Fix:**

- Check WordPress URL in `.md2wprc.json`
- Verify Application Password in `.env`
- Make sure WordPress is accessible

### Missing Images

```
❌ Missing images:
   • ./images/hero.png
     /full/path/to/images/hero.png

Cannot publish: 1 image(s) not found
```

**Fix:**

- Verify image path in markdown
- Check image file exists
- Use relative paths from markdown file

### Invalid Frontmatter

```
❌ Error: Frontmatter must include a "title" field
```

**Fix:**

```yaml
---
title: 'Your Post Title' # Required!
---
```

## Post Updates

::: tip Coming in v1.3.0
Update existing posts:

```bash
# First publish creates wp_post_id
md2wp publish post.md

# Edit post.md, then publish again
# md2wp detects wp_post_id and updates instead of creating
md2wp publish post.md  # Updates existing post
```

:::

Currently: Each publish creates a **new post**. To update, manually edit in WordPress.

## Best Practices

### ✅ Do

- ✅ Use `--dry-run` before first publish
- ✅ Start with `status: draft`
- ✅ Specify custom slugs for important posts
- ✅ Version control your markdown files
- ✅ Keep images organized in subdirectories

### ❌ Don't

- ❌ Publish without testing first
- ❌ Delete `wp_post_id` from frontmatter
- ❌ Publish to production without review
- ❌ Use absolute image paths
- ❌ Commit `.env` file to Git

## Examples

### Blog Post

```markdown
---
title: 'How to Use md2wp'
slug: how-to-use-md2wp
status: draft
excerpt: 'Learn how to publish markdown to WordPress using md2wp'
tags: [tutorial, markdown, wordpress]
categories: [Tutorials]
---

# How to Use md2wp

md2wp makes it easy to publish markdown to WordPress...
```

### Tutorial with Images

```markdown
---
title: 'Building a Static Site'
status: draft
---

# Building a Static Site

Follow these steps:

1. Install dependencies
2. Configure your site
3. Add content

![Site Structure](./images/structure.png)
```

### Scheduled Post

```markdown
---
title: 'New Year Post'
status: publish
date: 2025-01-01T00:00:00Z
---

Happy New Year!
```

## Next Steps

- [Working with Images →](/guide/images)
- [Frontmatter Reference →](/reference/frontmatter)
- [Dry Run Mode →](/guide/dry-run)
- [Troubleshooting →](/guide/troubleshooting)
