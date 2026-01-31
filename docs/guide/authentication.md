# Authentication

md2wp uses **WordPress Application Passwords** for secure, token-based authentication. This is more secure than using your main WordPress password and allows you to revoke access without changing your password.

## What are Application Passwords?

Application Passwords are special passwords for applications to access your WordPress site via the REST API. They were introduced in WordPress 5.6.

**Benefits:**

- 🔐 Separate from your main WordPress password
- 🚫 Can be revoked individually without affecting other apps
- 📝 Named for easy identification
- ✅ WordPress-recommended authentication method

## Setup Steps

### 1. Create Application Password in WordPress

1. **Log into WordPress admin**
2. Navigate to **Users → Profile** (or visit `/wp-admin/profile.php`)
3. Scroll down to the **"Application Passwords"** section
4. In the "New Application Password Name" field, enter: `md2wp`
5. Click **"Add New Application Password"**

You'll see a password like:

```
xxxx xxxx xxxx xxxx xxxx xxxx
```

::: warning Important
**Copy this password immediately!** WordPress only shows it once. If you lose it, you'll need to create a new one.
:::

### 2. Store in `.env` File

Create or edit `.env` in your project directory:

```bash
# WordPress Application Password
# Generated from Users → Profile → Application Passwords
MD2WP_PASSWORD="xxxx xxxx xxxx xxxx xxxx xxxx"
```

::: danger Security Warning
**Never commit `.env` to version control!**

Add to your `.gitignore`:

```gitignore
.env
.env.local
.env.*.local
```

:::

### 3. Configure WordPress Site

Edit `.md2wprc.json`:

```json
{
  "wordpress": {
    "siteUrl": "https://yourblog.com",
    "username": "your-wordpress-username"
  }
}
```

## Environment Variables

md2wp supports these environment variables (all optional):

```bash
# Required: Application Password
MD2WP_PASSWORD="xxxx xxxx xxxx xxxx xxxx xxxx"

# Optional: Override config file
MD2WP_SITE_URL="https://yoursite.com"
MD2WP_USERNAME="your-username"
```

**Priority:** Environment variables override `.md2wprc.json` settings.

## Multiple WordPress Sites

### Option 1: Multiple `.env` Files

Use different env files for different sites:

```bash
# .env.production
MD2WP_PASSWORD="prod-password-here"

# .env.staging
MD2WP_PASSWORD="staging-password-here"
```

Load with:

```bash
# Production
env $(cat .env.production) md2wp publish post.md

# Staging
env $(cat .env.staging) md2wp publish post.md
```

### Option 2: Multiple Config Files

Create separate config files:

```bash
# .md2wprc.prod.json
{
  "wordpress": {
    "siteUrl": "https://prod.com",
    "username": "admin"
  }
}

# .md2wprc.staging.json
{
  "wordpress": {
    "siteUrl": "https://staging.com",
    "username": "admin"
  }
}
```

::: tip Coming in v1.1.0
Native multi-site support with `--site` flag:

```bash
md2wp publish post.md --site production
md2wp publish post.md --site staging
```

:::

## CI/CD Environments

### GitHub Actions

Store password as a secret:

1. Go to your repo **Settings → Secrets → Actions**
2. Add new secret: `MD2WP_PASSWORD`
3. Use in workflow:

```yaml
name: Publish to WordPress

on:
  push:
    branches: [main]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20

      - name: Install md2wp
        run: npm install -g @md2wp/cli

      - name: Publish posts
        env:
          MD2WP_PASSWORD: ${{ secrets.MD2WP_PASSWORD }}
        run: |
          md2wp publish posts/*.md
```

### GitLab CI

Add `MD2WP_PASSWORD` to **Settings → CI/CD → Variables**:

```yaml
publish:
  image: node:20
  script:
    - npm install -g @md2wp/cli
    - md2wp publish posts/*.md
  only:
    - main
```

### Environment Variables in CI

```bash
# All settings via env vars
export MD2WP_SITE_URL="https://yoursite.com"
export MD2WP_USERNAME="admin"
export MD2WP_PASSWORD="xxxx xxxx xxxx xxxx"

md2wp publish post.md
```

## Security Best Practices

### ✅ Do

- ✅ Use Application Passwords (never your main password)
- ✅ Store passwords in `.env` file
- ✅ Add `.env` to `.gitignore`
- ✅ Use environment variables in CI/CD
- ✅ Revoke unused Application Passwords
- ✅ Use descriptive names for Application Passwords

### ❌ Don't

- ❌ Commit passwords to Git
- ❌ Share passwords in team chats
- ❌ Use your main WordPress password
- ❌ Store passwords in config files
- ❌ Hardcode passwords in scripts

## Managing Application Passwords

### View All Application Passwords

1. Go to **Users → Profile**
2. Scroll to **"Application Passwords"**
3. See list of all your application passwords

### Revoke an Application Password

1. Find the password in the list
2. Click **"Revoke"** next to it
3. Confirm revocation

The revoked password will immediately stop working.

### Rotate Passwords

Regular rotation is good security practice:

1. Create a new Application Password
2. Update your `.env` file
3. Test that publishing works
4. Revoke the old Application Password

## Troubleshooting

### "Authentication failed"

**Check these:**

- ✅ Password is correct in `.env`
- ✅ Username matches WordPress user
- ✅ WordPress site URL is correct (no trailing slash)
- ✅ Application Password wasn't revoked
- ✅ WordPress version is 5.6+

### "Application Passwords not available"

WordPress 5.6+ required. If you're on an older version:

1. **Update WordPress** (recommended), or
2. **Install plugin:** [Application Passwords](https://wordpress.org/plugins/application-passwords/)

### "Config not found"

Run `md2wp init` to create config files:

```bash
md2wp init
```

### Test Connection

Use dry-run to test without publishing:

```bash
md2wp publish post.md --dry-run
```

For real connection test:

```bash
md2wp publish post.md
# Will validate connection before doing anything
```

## Advanced: OS Keychain Storage

::: tip Coming in v1.1.0
Secure password storage in OS keychain:

- macOS: Keychain
- Windows: Credential Manager
- Linux: Secret Service API

```bash
# Store password securely
md2wp auth login

# Publish (no .env needed!)
md2wp publish post.md
```

See [Roadmap](/roadmap) for details.
:::

## Next Steps

- [Configuration Guide →](/guide/configuration)
- [Publishing Posts →](/guide/publishing)
- [Troubleshooting →](/guide/troubleshooting)
