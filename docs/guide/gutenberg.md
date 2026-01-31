# Gutenberg Blocks

md2wp converts markdown to proper WordPress Gutenberg blocks.

## Why Gutenberg?

Unlike plain HTML, Gutenberg blocks provide:
- ✅ Native WordPress editing
- ✅ Responsive images with srcset
- ✅ Block-specific features
- ✅ Future-proof with WordPress

## Markdown to Gutenberg

### Headings

```markdown
# Heading 1
## Heading 2
```
↓
```html
<!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading">Heading 1</h1>
<!-- /wp:heading -->

<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">Heading 2</h2>
<!-- /wp:heading -->
```

### Paragraphs

```markdown
This is a paragraph with **bold** and *italic*.
```
↓
```html
<!-- wp:paragraph -->
<p>This is a paragraph with <strong>bold</strong> and <em>italic</em>.</p>
<!-- /wp:paragraph -->
```

### Images

```markdown
![Alt text](./image.jpg)
```
↓
```html
<!-- wp:image {"id":123,"sizeSlug":"large"} -->
<figure class="wp-block-image size-large">
  <img src="https://site.com/.../image.jpg"
       alt="Alt text"
       class="wp-image-123"/>
</figure>
<!-- /wp:image -->
```

### Lists

```markdown
- Item 1
- Item 2
```
↓
```html
<!-- wp:list -->
<ul class="wp-block-list">
<li>Item 1</li>
<li>Item 2</li>
</ul>
<!-- /wp:list -->
```

## Supported Blocks (v1.0)

- ✅ Headings
- ✅ Paragraphs
- ✅ Lists (ordered & unordered)
- ✅ Images
- ✅ Code blocks
- ✅ Blockquotes
- ✅ Horizontal rules

## Coming Soon

- 🚧 Tables (v1.2.0)
- 🚧 Galleries (v1.5.0)
- 🚧 Custom blocks (v1.2.0)

## Next Steps

- [Publishing Guide →](/guide/publishing)
- [CLI Commands →](/reference/cli-commands)
