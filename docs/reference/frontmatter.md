# Frontmatter Reference

Complete reference for all frontmatter fields supported by md2wp.

## Required Fields

### `title`

Post title.

**Type:** `string` (required)

```yaml
---
title: "My Blog Post"
---
```

**WordPress:** Sets post title visible in WordPress admin and on your site.

---

## Optional Fields

### `slug`

URL-friendly post slug.

**Type:** `string`
**Default:** Auto-generated from title

```yaml
---
title: "My First WordPress Post"
slug: first-post
---
```

**Result:** `https://yoursite.com/first-post/`

**Rules:**
- Lowercase only
- Hyphens for spaces
- No special characters
- Must be unique

---

### `status`

Post publication status.

**Type:** `"draft" | "publish"`
**Default:** From config (`posts.defaultStatus`) or `"draft"`

```yaml
---
title: "My Post"
status: draft    # Private, only visible to editors
---
```

```yaml
---
title: "My Post"
status: publish  # Public, visible to everyone
---
```

**Priority:**
1. `--draft` or `--publish` CLI flag
2. Frontmatter `status`
3. Config `posts.defaultStatus`
4. Default: `draft`

---

### `excerpt`

Post excerpt (summary).

**Type:** `string`

```yaml
---
title: "My Post"
excerpt: "A brief summary of this post that appears in listings."
---
```

**WordPress:** Used in:
- Post listings
- RSS feeds
- SEO meta descriptions

**Default:** Auto-generated from first paragraph if not specified.

---

### `date`

Post publication date.

**Type:** `string` (ISO 8601 format)

```yaml
---
title: "My Post"
date: 2024-01-15
---
```

**Formats supported:**
- `2024-01-15` (date only)
- `2024-01-15T10:30:00` (with time)
- `2024-01-15T10:30:00Z` (UTC)
- `2024-01-15T10:30:00-07:00` (with timezone)

**Default:** Current date/time if not specified.

::: tip Scheduled Posts
Combine with `status: publish` for scheduling (coming in v1.3.0):
```yaml
---
status: publish
date: 2025-01-01T00:00:00Z
---
```
:::

---

### `tags`

Post tags.

**Type:** `string[]` (array of strings)

```yaml
---
title: "My Post"
tags:
  - tutorial
  - markdown
  - wordpress
---
```

**Single-line format:**
```yaml
---
tags: [tutorial, markdown, wordpress]
---
```

::: warning v1.0 Limitation
Tags are parsed but not yet sent to WordPress.
**Coming in v1.2.0:** Automatic tag creation.
:::

---

### `categories`

Post categories.

**Type:** `string[]` (array of strings)

```yaml
---
title: "My Post"
categories:
  - Technology
  - Tutorials
---
```

::: warning v1.0 Limitation
Categories are parsed but not yet sent to WordPress.
**Coming in v1.2.0:** Automatic category creation.
:::

---

### `featured_image`

Featured image path.

**Type:** `string` (file path)

```yaml
---
title: "My Post"
featured_image: ./images/hero.jpg
---
```

::: warning Coming in v1.4.0
Featured images not yet implemented in v1.0.

**Workaround:** Set manually in WordPress after publishing.
:::

---

## WordPress-Specific Fields

These fields are automatically added by md2wp after publishing:

### `wp_post_id`

WordPress post ID.

**Type:** `number`
**Auto-added:** After first publish

```yaml
---
title: "My Post"
wp_post_id: 123  # Added automatically
---
```

**Usage:** Enables post updates (coming in v1.3.0).

::: danger Don't Edit
Don't manually change `wp_post_id`! md2wp uses this to identify the post.
:::

---

### `wp_url`

Published post URL.

**Type:** `string`
**Auto-added:** After first publish

```yaml
---
title: "My Post"
wp_url: https://yoursite.com/my-post/
---
```

**Usage:** Quick reference to published post.

---

### `wp_modified`

Last modified date in WordPress.

**Type:** `string` (ISO 8601)
**Auto-added:** After publish/update

```yaml
---
title: "My Post"
wp_modified: 2024-01-15T10:30:00Z
---
```

**Usage:** Track when post was last updated.

---

## Complete Example

```yaml
---
# Required
title: "Complete Guide to md2wp"

# Publication
slug: complete-guide-md2wp
status: draft
date: 2024-01-15T10:00:00Z

# Content
excerpt: "Everything you need to know about publishing markdown to WordPress"
tags:
  - tutorial
  - markdown
  - wordpress
  - gutenberg
categories:
  - Tutorials
  - Documentation

# Media
featured_image: ./images/hero.jpg

# WordPress (auto-added)
wp_post_id: 123
wp_url: https://yoursite.com/complete-guide-md2wp/
wp_modified: 2024-01-15T10:30:00Z
---

# Your content here...
```

## Validation

### Required Field Missing

```yaml
---
# ❌ Error: title is required
slug: my-post
---
```

**Error:**
```
❌ Error: Frontmatter must include a "title" field
```

### Invalid Status

```yaml
---
title: "My Post"
status: published  # ❌ Invalid
---
```

**Valid values:** `draft` or `publish` only

### Invalid Date Format

```yaml
---
title: "My Post"
date: 01/15/2024  # ❌ Wrong format
---
```

**Correct:**
```yaml
date: 2024-01-15
```

## Type Coercion

md2wp automatically converts types when needed:

**Numbers to strings:**
```yaml
---
title: 123  # Converted to "123"
---
```

**Arrays from single values:**
```yaml
---
tags: tutorial  # Converted to ["tutorial"]
---
```

## YAML Syntax

### Multi-line Strings

**Literal block (`|`):**
```yaml
---
excerpt: |
  This is a multi-line
  excerpt that preserves
  line breaks.
---
```

**Folded block (`>`):**
```yaml
---
excerpt: >
  This is a multi-line
  excerpt that folds into
  a single line.
---
```

### Escaping Special Characters

**Quotes in strings:**
```yaml
---
title: 'Post with "quotes" in title'
# or
title: "Post with 'quotes' in title"
---
```

**Colons in strings:**
```yaml
---
title: "Title: With Colon"  # Must quote
---
```

## Comments

Add comments in frontmatter:

```yaml
---
title: "My Post"
# This is a comment
status: draft  # Inline comment
# tags: [wip]  # Commented out
---
```

## Best Practices

### ✅ Do

- ✅ Always include `title`
- ✅ Use descriptive slugs
- ✅ Provide excerpts for better SEO
- ✅ Use array format for tags/categories
- ✅ ISO 8601 date format
- ✅ Keep frontmatter concise

### ❌ Don't

- ❌ Edit `wp_post_id` manually
- ❌ Use special characters in slugs
- ❌ Mix date formats
- ❌ Include sensitive data
- ❌ Use tabs (use spaces)

## Validation

Validate frontmatter before publishing:

```bash
# Coming in v1.0.0
md2wp validate post.md
```

Or use dry-run:
```bash
md2wp publish post.md --dry-run
```

Shows parsed frontmatter:
```
✅ Parsed frontmatter:
{
  "title": "My Post",
  "status": "draft",
  "tags": ["tutorial", "markdown"]
}
```

## Next Steps

- [CLI Commands →](/reference/cli-commands)
- [Configuration →](/reference/configuration)
- [Publishing Guide →](/guide/publishing)
