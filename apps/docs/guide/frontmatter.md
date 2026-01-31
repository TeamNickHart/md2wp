# Frontmatter

All post metadata is defined in YAML frontmatter at the top of your markdown file.

## Basic Example

```yaml
---
title: "My Blog Post"
status: draft
tags:
  - tutorial
  - markdown
categories:
  - Technology
---

# Post content starts here...
```

## Required Fields

### `title`

Post title (required).

```yaml
---
title: "My First Post"
---
```

## Optional Fields

- `slug` - Custom URL slug
- `status` - `draft` or `publish`
- `excerpt` - Post summary
- `date` - Publication date
- `tags` - Array of tags
- `categories` - Array of categories

## Complete Example

```yaml
---
title: "Complete Guide"
slug: complete-guide
status: draft
excerpt: "A comprehensive guide"
date: 2024-01-15
tags: [tutorial, guide]
categories: [Documentation]
---
```

## WordPress Fields (Auto-Added)

After publishing, md2wp adds:

```yaml
wp_post_id: 123
wp_url: https://yoursite.com/post/
wp_modified: 2024-01-15T10:30:00Z
```

## Next Steps

- [Frontmatter Reference →](/reference/frontmatter) - Complete field reference
- [Publishing Guide →](/guide/publishing)
