---
title: 'Testing md2wp Gutenberg Transformation'
status: draft
tags:
  - test
  - markdown
  - gutenberg
categories:
  - development
excerpt: 'A test post to showcase markdown to Gutenberg block conversion'
---

# Welcome to md2wp!

This is a **test post** to demonstrate how md2wp converts _markdown_ to proper **Gutenberg blocks**.

## What Gets Transformed?

md2wp supports the following markdown features:

- Paragraphs with **bold** and _italic_ text
- Headings at all levels
- Ordered and unordered lists
- Links like [this one](https://example.com)
- Code blocks and `inline code`
- Images (local and remote)
- Blockquotes
- Horizontal rules

### Code Example

Here's some JavaScript code:

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
  return true;
}

greet('WordPress');
```

### Lists

Unordered list:

- First item
- Second item with **bold text**
- Third item with a [link](https://wordpress.org)

Ordered list:

1. Step one
2. Step two
3. Step three

## Blockquote Example

> This is a blockquote that will be converted to a Gutenberg quote block.
>
> It can have multiple paragraphs.

---

## Try It Yourself

Run this command to see the Gutenberg output:

```bash
md2wp publish test-post.md --dry-run
```

The output shows exactly what would be sent to WordPress!
