# Configuration Reference

Complete reference for `.md2wprc.json` configuration file.

## File Location

`.md2wprc.json` in your project root.

## Complete Example

```json
{
  "wordpress": {
    "siteUrl": "https://yourblog.com",
    "username": "admin"
  },
  "posts": {
    "defaultStatus": "draft",
    "defaultAuthor": 1
  },
  "images": {
    "basePath": "./images",
    "uploadPath": "md2wp-uploads"
  }
}
```

## Required Fields

### `wordpress.siteUrl`

WordPress site URL.

**Type:** `string`

```json
{
  "wordpress": {
    "siteUrl": "https://yourblog.com"
  }
}
```

### `wordpress.username`

WordPress username.

**Type:** `string`

```json
{
  "wordpress": {
    "username": "admin"
  }
}
```

## Optional Fields

### `posts.defaultStatus`

Default post status.

**Type:** `"draft" | "publish"`
**Default:** `"draft"`

```json
{
  "posts": {
    "defaultStatus": "draft"
  }
}
```

### `posts.defaultAuthor`

Default author ID.

**Type:** `number`

```json
{
  "posts": {
    "defaultAuthor": 1
  }
}
```

## Environment Variables

Override config with environment variables:

```bash
MD2WP_SITE_URL="https://site.com"
MD2WP_USERNAME="admin"
MD2WP_PASSWORD="xxxx xxxx xxxx"
```

## Next Steps

- [Configuration Guide →](/guide/configuration)
- [Authentication →](/guide/authentication)
