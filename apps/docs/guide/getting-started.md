# Getting Started

This guide will help you publish your first post to WordPress using md2wp.

## Prerequisites

- **Node.js** 18.0.0 or higher
- **WordPress** 5.6+ (for Application Passwords)
- **WordPress REST API** enabled (default on most sites)

## Installation

Install md2wp globally:

::: code-group
```bash [npm]
npm install -g @md2wp/cli
```

```bash [pnpm]
pnpm add -g @md2wp/cli
```

```bash [yarn]
yarn global add @md2wp/cli
```
:::

Verify installation:

```bash
md2wp --version
```

## Initialize Configuration

Run the init command in your project directory:

```bash
md2wp init
```

This creates two files:

### `.md2wprc.json`
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

### `.env`
```bash
# WordPress Application Password
MD2WP_PASSWORD=your-app-password-here
```

::: warning Important
Add `.env` to your `.gitignore` to keep your password secret!
```gitignore
.env
```
:::

## Configure WordPress

### 1. Update `.md2wprc.json`

Edit the configuration file with your WordPress details:

```json
{
  "wordpress": {
    "siteUrl": "https://yourblog.com",  // Your WordPress site URL
    "username": "yourname"               // Your WordPress username
  },
  "posts": {
    "defaultStatus": "draft"             // Default post status
  }
}
```

### 2. Create Application Password

1. **Log into WordPress admin**
2. Go to **Users → Profile** (`/wp-admin/profile.php`)
3. Scroll to **"Application Passwords"** section
4. Enter application name: `md2wp`
5. Click **"Add New Application Password"**
6. **Copy the password** (looks like: `xxxx xxxx xxxx xxxx xxxx xxxx`)

::: tip WordPress 5.6+ Required
Application Passwords were introduced in WordPress 5.6. If you don't see this section, update WordPress or install the [Application Passwords plugin](https://wordpress.org/plugins/application-passwords/).
:::

### 3. Add Password to `.env`

Paste the Application Password into your `.env` file:

```bash
MD2WP_PASSWORD="xxxx xxxx xxxx xxxx xxxx xxxx"
```

## Create Your First Post

Create a markdown file `my-first-post.md`:

```markdown
---
title: "My First md2wp Post"
status: draft
tags:
  - tutorial
  - markdown
categories:
  - Technology
excerpt: "Learning to publish markdown to WordPress"
---

# Hello WordPress!

This is my **first post** published using md2wp.

## What is md2wp?

md2wp is a tool that lets you:

- Write in markdown
- Publish to WordPress
- Manage images automatically

![Sample Image](./images/sample.jpg)

Check out the [documentation](https://md2wp.dev) for more!
```

## Publish Your Post

### Preview First (Dry Run)

Test without publishing:

```bash
md2wp publish my-first-post.md --dry-run
```

This shows:
- ✅ Parsed frontmatter
- ✅ Image validation results
- ✅ Generated Gutenberg blocks
- ✅ No changes made to WordPress

### Publish for Real

```bash
md2wp publish my-first-post.md
```

You'll see:
```
🚀 Publishing to WordPress...

🔌 Validating connection...
✅ Connected to WordPress

📸 Processing 1 image(s)...
[1/1] 📤 Uploading: ./images/sample.jpg
[1/1] ✅ Uploaded: https://yoursite.com/wp-content/uploads/sample.jpg

✅ Uploaded 1 new image(s)

📝 Creating post...
✅ Post created: https://yoursite.com/my-first-md2wp-post/

✅ Updated frontmatter with post details

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 SUCCESS!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Title: My First md2wp Post
🔗 URL: https://yoursite.com/my-first-md2wp-post/
📝 Status: draft
🆔 Post ID: 123
```

## What Happened?

After publishing, md2wp updated your markdown file:

```markdown{8-10}
---
title: "My First md2wp Post"
status: draft
tags:
  - tutorial
  - markdown
categories: [Technology]
wp_post_id: 123
wp_url: https://yoursite.com/my-first-md2wp-post/
wp_modified: 2024-01-15T10:30:00Z
---
```

These fields track the WordPress post for future updates.

## Next Steps

- [Learn about frontmatter options →](/guide/frontmatter)
- [Working with images →](/guide/images)
- [CLI command reference →](/reference/cli-commands)
- [Troubleshooting →](/guide/troubleshooting)

## Common Issues

### "Authentication failed"
- ✅ Check WordPress URL in `.md2wprc.json`
- ✅ Verify username is correct
- ✅ Regenerate Application Password
- ✅ Make sure password is in `.env` file

### "Image not found"
- ✅ Check image path is relative to markdown file
- ✅ Make sure image file exists
- ✅ Use `--dry-run` to see validation errors

### "Config not found"
- ✅ Run `md2wp init` in your project directory
- ✅ Make sure `.md2wprc.json` exists
