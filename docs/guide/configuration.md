# Configuration

md2wp uses two configuration files:
- `.md2wprc.json` - WordPress site settings
- `.env` - Application Password (keep secret!)

## Configuration File

Create `.md2wprc.json` in your project root:

```json
{
  "wordpress": {
    "siteUrl": "https://yourblog.com",
    "username": "your-username"
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

### WordPress Settings

#### `wordpress.siteUrl` (required)

Your WordPress site URL.

```json
{
  "wordpress": {
    "siteUrl": "https://yourblog.com"
  }
}
```

::: tip
- ✅ Include `https://`
- ✅ No trailing slash
- ✅ Use root domain (not `/wp-admin`)
:::

#### `wordpress.username` (required)

Your WordPress username (must match Application Password user).

```json
{
  "wordpress": {
    "username": "admin"
  }
}
```

### Post Settings

#### `posts.defaultStatus`

Default post status when not specified in frontmatter.

**Options:** `draft` | `publish`
**Default:** `draft`

```json
{
  "posts": {
    "defaultStatus": "draft"
  }
}
```

#### `posts.defaultAuthor`

Default author ID for posts.

**Type:** `number`
**Default:** Current authenticated user

```json
{
  "posts": {
    "defaultAuthor": 1
  }
}
```

::: tip
Find author ID in WordPress:
- Users → All Users → hover over user → see ID in URL
- Or use `wp user list` in WP-CLI
:::

### Image Settings

#### `images.basePath`

Base directory for resolving relative image paths.

**Type:** `string`
**Default:** Directory containing markdown file

```json
{
  "images": {
    "basePath": "./content/images"
  }
}
```

#### `images.uploadPath`

WordPress upload subdirectory.

**Type:** `string`
**Default:** WordPress default (usually `YYYY/MM/`)

```json
{
  "images": {
    "uploadPath": "md2wp-uploads"
  }
}
```

::: tip Coming in v1.4.0
Image optimization settings:
```json
{
  "images": {
    "optimize": true,
    "maxWidth": 2000,
    "quality": 85,
    "format": "webp"
  }
}
```
:::

## Environment Variables

Environment variables **override** config file settings.

### Available Variables

```bash
# WordPress credentials
MD2WP_PASSWORD="xxxx xxxx xxxx xxxx"  # Required
MD2WP_SITE_URL="https://site.com"     # Optional
MD2WP_USERNAME="admin"                 # Optional
```

### Loading .env Files

md2wp automatically loads `.env` from:
1. Current working directory
2. Parent directories (searches up)

**Example `.env`:**
```bash
# WordPress Application Password
MD2WP_PASSWORD="xxxx xxxx xxxx xxxx xxxx xxxx"

# Optional overrides
MD2WP_SITE_URL="https://staging.example.com"
```

## Configuration Priority

Settings are resolved in this order (highest priority first):

1. **Environment variables** (`MD2WP_*`)
2. **Config file** (`.md2wprc.json`)
3. **Frontmatter** (in markdown file)
4. **Defaults**

**Example:**
```json
// .md2wprc.json
{
  "posts": { "defaultStatus": "draft" }
}
```

```bash
# Override with env var
export MD2WP_DEFAULT_STATUS=publish
```

```yaml
# Override with frontmatter
---
status: draft
---
```

**Result:** Frontmatter wins → post is `draft`

## Multiple Environments

### Separate Config Files

```bash
# Production
.md2wprc.production.json

# Staging
.md2wprc.staging.json

# Development
.md2wprc.development.json
```

Specify which to use:
```bash
# Coming in v1.1.0
md2wp publish post.md --config .md2wprc.staging.json
```

### Separate .env Files

```bash
.env.production
.env.staging
.env.development
```

Load explicitly:
```bash
# Load staging env
env $(cat .env.staging | xargs) md2wp publish post.md
```

## Cache Configuration

Image cache is stored in `.md2wp/cache.json`:

```json
{
  "images": {
    "sha256-hash-of-image": {
      "mediaId": 123,
      "url": "https://site.com/wp-content/uploads/image.jpg",
      "uploadedAt": "2024-01-15T10:30:00Z",
      "verified": "2024-01-16T08:00:00Z"
    }
  }
}
```

::: warning
Don't edit `cache.json` manually! Let md2wp manage it.
:::

## Validation

Validate your configuration:

```bash
# Coming in v1.0.0
md2wp validate
md2wp config --validate
```

Show current configuration:

```bash
# Coming in v1.0.0
md2wp config
md2wp config --show
```

## Example Configurations

### Minimal (required only)

```json
{
  "wordpress": {
    "siteUrl": "https://yourblog.com",
    "username": "admin"
  }
}
```

### Typical Setup

```json
{
  "wordpress": {
    "siteUrl": "https://yourblog.com",
    "username": "admin"
  },
  "posts": {
    "defaultStatus": "draft"
  }
}
```

### Advanced

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
    "basePath": "./content/images",
    "uploadPath": "blog-images"
  }
}
```

## Troubleshooting

### Config not found

```bash
# Create config files
md2wp init
```

### Invalid JSON

Use a JSON validator or:
```bash
# Check JSON syntax
cat .md2wprc.json | jq .
```

### Wrong password

```bash
# Check .env file exists
ls -la .env

# Check password format (should have spaces)
cat .env
```

## Next Steps

- [Authentication Setup →](/guide/authentication)
- [Publishing Posts →](/guide/publishing)
- [CLI Commands Reference →](/reference/cli-commands)
