# Troubleshooting

Common issues and solutions when using md2wp.

## Authentication Issues

### "Authentication failed: 401 Unauthorized"

**Symptoms:**

```
❌ Connection failed
   Authentication failed: 401 Unauthorized
```

**Causes:**

- Wrong Application Password
- Wrong username
- Application Password revoked
- Wrong WordPress URL

**Solutions:**

1. **Check Application Password:**

   ```bash
   cat .env
   # Should show: MD2WP_PASSWORD="xxxx xxxx xxxx xxxx"
   ```

2. **Verify WordPress URL:**

   ```json
   // .md2wprc.json
   {
     "wordpress": {
       "siteUrl": "https://yoursite.com" // No trailing slash!
     }
   }
   ```

3. **Regenerate Application Password:**
   - WordPress Admin → Users → Profile
   - Revoke old password
   - Create new Application Password
   - Update `.env` file

4. **Check WordPress version:**
   ```bash
   # WordPress 5.6+ required
   # Or install Application Passwords plugin
   ```

---

### "Config not found"

**Symptoms:**

```
❌ Error: Config not found
```

**Solution:**

```bash
# Initialize config files
md2wp init
```

---

## Image Issues

### "Image not found"

**Symptoms:**

```
❌ ./images/photo.jpg
   File not found
```

**Solutions:**

1. **Check file exists:**

   ```bash
   ls -la ./images/photo.jpg
   ```

2. **Check path is relative:**

   ```markdown
   <!-- ✅ Good -->

   ![Photo](./images/photo.jpg)

   <!-- ❌ Bad -->

   ![Photo](/Users/you/images/photo.jpg)
   ```

3. **Check case sensitivity (Linux/macOS):**
   ```bash
   # photo.jpg vs Photo.jpg
   ls images/
   ```

---

### "Image too large"

**Symptoms:**

```
⚠️  Large file size: 8.5 MB (recommend <2 MB)
```

**Solutions:**

1. **Optimize with ImageMagick:**

   ```bash
   magick input.jpg -resize 2000x2000\> -quality 80 output.jpg
   ```

2. **Use online tools:**
   - [TinyPNG](https://tinypng.com)
   - [Squoosh](https://squoosh.app)

3. **Check WordPress upload limit:**
   - WordPress Admin → Media → Add New
   - See "Maximum upload file size"

---

### "Failed to upload media"

**Symptoms:**

```
❌ Failed to upload: ./image.jpg
   Failed to upload media: 500 Internal Server Error
```

**Causes:**

- WordPress upload directory permissions
- PHP upload limit too low
- File type not allowed

**Solutions:**

1. **Check WordPress upload settings:**
   - PHP `upload_max_filesize`
   - PHP `post_max_size`
   - PHP `memory_limit`

2. **Check file permissions:**

   ```bash
   # WordPress uploads directory should be writable
   ls -la wp-content/uploads/
   ```

3. **Check allowed file types:**
   - WordPress Admin → Settings → Media
   - Or contact hosting provider

---

## Connection Issues

### "Failed to connect to WordPress"

**Symptoms:**

```
❌ Failed to connect to WordPress: Network error
```

**Solutions:**

1. **Check WordPress URL:**

   ```bash
   curl https://yoursite.com/wp-json/
   # Should return JSON
   ```

2. **Check REST API enabled:**

   ```bash
   curl https://yoursite.com/wp-json/wp/v2/
   ```

3. **Check firewall/security plugins:**
   - Some security plugins block REST API
   - Wordfence, iThemes Security, etc.
   - Add md2wp user-agent to allowlist

4. **Check SSL certificate:**
   ```bash
   curl https://yoursite.com/
   # Should not show SSL errors
   ```

---

## CLI Issues

### "Command not found: md2wp"

**Symptoms:**

```bash
md2wp: command not found
```

**Solutions:**

1. **Check installation:**

   ```bash
   npm list -g @md2wp/cli
   ```

2. **Check PATH:**

   ```bash
   echo $PATH
   npm config get prefix
   ```

3. **Reinstall:**

   ```bash
   npm install -g @md2wp/cli
   ```

4. **Use npx:**
   ```bash
   npx @md2wp/cli publish post.md
   ```

---

### "Permission denied (EACCES)"

**Symptoms:**

```
Error: EACCES: permission denied
```

**Solutions:**

1. **Fix npm permissions (recommended):**

   ```bash
   # Use nvm
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 20
   nvm use 20
   ```

2. **Or change npm directory:**
   ```bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc
   ```

---

## Build Issues

### "Module not found"

**For contributors:**

**Symptoms:**

```
Error: Cannot find module '@md2wp/core'
```

**Solutions:**

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Build packages:**

   ```bash
   pnpm build
   ```

3. **Link CLI:**
   ```bash
   pnpm link:cli
   ```

---

## Frontmatter Issues

### "Frontmatter must include a 'title' field"

**Symptoms:**

```
❌ Error: Frontmatter must include a "title" field
```

**Solution:**

```yaml
---
title: 'Your Post Title' # Required!
---
```

---

### "Invalid frontmatter status"

**Symptoms:**

```
❌ Error: Frontmatter status must be either "draft" or "publish"
```

**Solution:**

```yaml
---
status: draft # ✅ Correct
# status: published  # ❌ Wrong
---
```

---

## Performance Issues

### Slow uploads

**Symptoms:**

- Image uploads taking too long
- Connection timeouts

**Solutions:**

1. **Optimize images before uploading:**

   ```bash
   magick *.jpg -resize 2000x2000\> -quality 80 optimized/
   ```

2. **Check internet connection:**

   ```bash
   speedtest-cli
   ```

3. **Use local WordPress for testing:**
   ```bash
   # LocalWP, MAMP, or Docker
   ```

---

## Cache Issues

### Cache not working

**Symptoms:**

- Images re-upload every time
- No cache hits

**Solutions:**

1. **Check cache exists:**

   ```bash
   ls -la .md2wp/cache.json
   ```

2. **Check cache permissions:**

   ```bash
   chmod 644 .md2wp/cache.json
   ```

3. **Rebuild cache:**
   ```bash
   rm -rf .md2wp/cache.json
   md2wp publish post.md
   ```

---

## Debug Mode

**Coming in v1.1.0:**

```bash
md2wp publish post.md --verbose
md2wp publish post.md --debug
```

**Current workaround:**

```bash
NODE_DEBUG=* md2wp publish post.md
```

---

## Getting Help

Still having issues?

1. **Check documentation:**
   - [Getting Started](/guide/getting-started)
   - [Authentication](/guide/authentication)
   - [CLI Commands](/reference/cli-commands)

2. **Search GitHub Issues:**
   - [md2wp Issues](https://github.com/TeamNickHart/md2wp/issues)

3. **Create new issue:**
   - [Report a bug](https://github.com/TeamNickHart/md2wp/issues/new)
   - Include:
     - md2wp version (`md2wp --version`)
     - Node.js version (`node --version`)
     - WordPress version
     - Error message
     - Steps to reproduce

4. **Community:**
   - [GitHub Discussions](https://github.com/TeamNickHart/md2wp/discussions)

---

## Common Workflows

### Testing before production

```bash
# 1. Dry run first
md2wp publish post.md --dry-run

# 2. Publish as draft
md2wp publish post.md --draft

# 3. Review in WordPress

# 4. Update status in frontmatter
# status: publish

# 5. Publish for real
md2wp publish post.md
```

### Recovering from failed publish

```bash
# 1. Check what went wrong
md2wp publish post.md --dry-run

# 2. Fix issues (images, frontmatter, etc.)

# 3. Clear cache if needed
rm -rf .md2wp/cache.json

# 4. Try again
md2wp publish post.md
```

---

## Best Practices

To avoid issues:

- ✅ Use `--dry-run` before first publish
- ✅ Start with small posts
- ✅ Optimize images before uploading
- ✅ Keep md2wp updated
- ✅ Version control your markdown
- ✅ Test on staging first
- ✅ Back up WordPress regularly

---

## Next Steps

- [Getting Started Guide →](/guide/getting-started)
- [Authentication Setup →](/guide/authentication)
- [CLI Commands →](/reference/cli-commands)
