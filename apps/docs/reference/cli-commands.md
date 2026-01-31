# CLI Commands

Complete reference for all md2wp CLI commands.

## `md2wp init`

Initialize md2wp configuration files.

### Usage

```bash
md2wp init [options]
```

### Description

Creates two configuration files in the current directory:
- `.md2wprc.json` - WordPress site configuration
- `.env` - Application Password storage (git-ignored)

### Options

None currently. Interactive prompts guide you through setup.

### Example

```bash
cd my-blog
md2wp init

# Creates:
# - .md2wprc.json
# - .env
# - .md2wp/ (cache directory)
```

### Output Files

**.md2wprc.json:**
```json
{
  "wordpress": {
    "siteUrl": "https://your-site.com",
    "username": "your-username"
  },
  "posts": {
    "defaultStatus": "draft"
  }
}
```

**.env:**
```bash
MD2WP_PASSWORD="your-app-password-here"
```

---

## `md2wp publish`

Publish a markdown file to WordPress.

### Usage

```bash
md2wp publish <file> [options]
```

### Arguments

#### `<file>`

Path to markdown file to publish.

**Type:** `string` (required)

```bash
md2wp publish my-post.md
md2wp publish posts/tutorial.md
md2wp publish ../blog/article.md
```

### Options

#### `--draft`

Force post status to draft (overrides frontmatter).

**Type:** `boolean`
**Default:** Uses frontmatter or config default

```bash
md2wp publish post.md --draft
```

#### `--dry-run`

Preview without publishing to WordPress.

**Type:** `boolean`
**Default:** `false`

```bash
md2wp publish post.md --dry-run
```

Shows:
- Parsed frontmatter
- Image validation results
- Generated Gutenberg blocks
- No actual publishing

### Examples

**Basic publish:**
```bash
md2wp publish my-post.md
```

**Publish as draft:**
```bash
md2wp publish my-post.md --draft
```

**Preview only:**
```bash
md2wp publish my-post.md --dry-run
```

**Multiple files (bash):**
```bash
for file in posts/*.md; do
  md2wp publish "$file" --draft
done
```

### Output

**Success:**
```
🚀 Publishing to WordPress...

🔌 Validating connection...
✅ Connected to WordPress

📸 Processing 2 image(s)...
[1/2] 📤 Uploading: ./images/hero.jpg
[1/2] ✅ Uploaded: https://site.com/.../hero.jpg
[2/2] ✅ Cache hit: ./images/logo.png

✅ Uploaded 1 new image(s)
✅ Reused 1 cached image(s)

📝 Creating post...
✅ Post created: https://yoursite.com/my-post/

✅ Updated frontmatter with post details

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 SUCCESS!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Title: My First Post
🔗 URL: https://yoursite.com/my-post/
📝 Status: draft
🆔 Post ID: 123
```

**Errors:**
```
❌ Connection failed
   Authentication failed: 401 Unauthorized

💡 Tips:
   • Check your WordPress URL in .md2wprc.json
   • Verify your Application Password in .env
   • Run `md2wp init` to reconfigure
```

### Exit Codes

- `0` - Success
- `1` - Error (connection, missing images, etc.)

---

## `md2wp --help`

Show help information.

### Usage

```bash
md2wp --help
md2wp -h

# Command-specific help
md2wp publish --help
md2wp init --help
```

### Output

```
md2wp - Publish markdown to WordPress

Usage:
  md2wp <command> [options]

Commands:
  init              Initialize configuration
  publish <file>    Publish markdown file to WordPress

Options:
  --version, -v     Show version number
  --help, -h        Show help

Examples:
  md2wp init
  md2wp publish my-post.md
  md2wp publish post.md --dry-run
  md2wp publish post.md --draft

For more information, visit:
https://md2wp.dev
```

---

## `md2wp --version`

Show md2wp version.

### Usage

```bash
md2wp --version
md2wp -v
```

### Output

```
0.1.0
```

---

## Coming Soon

### `md2wp validate` (v1.0.0)

Validate markdown and configuration.

```bash
md2wp validate post.md
md2wp validate --all
```

### `md2wp config` (v1.0.0)

Show or manage configuration.

```bash
md2wp config              # Show current config
md2wp config --validate   # Validate config
md2wp config --edit       # Open config in editor
```

### `md2wp auth` (v1.1.0)

Manage authentication.

```bash
md2wp auth login          # Interactive auth setup
md2wp auth logout         # Clear credentials
md2wp auth status         # Show auth status
md2wp auth refresh        # Test connection
```

### `md2wp list` (v1.3.0)

List WordPress posts.

```bash
md2wp list                # List all posts
md2wp list --status draft # List drafts only
md2wp list --limit 10     # Limit results
```

### `md2wp pull` (v1.3.0)

Download WordPress post as markdown.

```bash
md2wp pull <post-id>              # Download post
md2wp pull 123 --output post.md   # Save to file
```

### `md2wp delete` (v1.3.0)

Delete WordPress post.

```bash
md2wp delete <post-id>        # Move to trash
md2wp delete 123 --force      # Delete permanently
```

### `md2wp watch` (v2.2.0)

Watch directory and auto-publish changes.

```bash
md2wp watch posts/            # Watch directory
md2wp watch posts/ --draft    # Always publish as draft
```

## Environment Variables

All commands respect these environment variables:

```bash
MD2WP_PASSWORD="xxxx xxxx xxxx"  # WordPress Application Password
MD2WP_SITE_URL="https://site.com" # Override config siteUrl
MD2WP_USERNAME="admin"            # Override config username
```

## Global Options

Available for all commands:

- `--help`, `-h` - Show help
- `--version`, `-v` - Show version
- `--verbose` - Enable verbose logging (coming soon)
- `--quiet` - Suppress output (coming soon)
- `--config <file>` - Use custom config file (coming soon)

## Exit Codes

- `0` - Success
- `1` - Error (validation, connection, etc.)
- `2` - Invalid arguments
- `130` - Interrupted (Ctrl+C)

## Configuration Files

Commands look for config in:

1. Current directory (`.md2wprc.json`)
2. Parent directories (searches up)
3. Home directory (`~/.md2wprc.json`) - coming soon

Environment variables take precedence over config files.

## Examples

### Complete Workflow

```bash
# 1. Initialize
cd my-blog
md2wp init

# 2. Test dry-run
md2wp publish first-post.md --dry-run

# 3. Publish as draft
md2wp publish first-post.md --draft

# 4. Review in WordPress, then publish
# Edit post.md, update status to publish
md2wp publish first-post.md
```

### Batch Publishing

```bash
# Publish all posts as drafts
for file in posts/*.md; do
  md2wp publish "$file" --draft
done

# Or with find
find posts -name "*.md" -exec md2wp publish {} --draft \;
```

### CI/CD

```yaml
# GitHub Actions
- name: Publish posts
  env:
    MD2WP_PASSWORD: ${{ secrets.MD2WP_PASSWORD }}
  run: |
    md2wp publish posts/new-post.md
```

## Next Steps

- [Configuration Reference →](/reference/configuration)
- [Frontmatter Reference →](/reference/frontmatter)
- [Publishing Guide →](/guide/publishing)
