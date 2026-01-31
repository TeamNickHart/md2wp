# Installation

## System Requirements

- **Node.js** 18.0.0 or higher
- **npm**, **pnpm**, or **yarn**
- **WordPress** 5.6+ with REST API enabled

## Install Globally

Install md2wp as a global CLI tool:

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

Verify the installation:

```bash
md2wp --version
# Should output: 0.1.0 (or current version)
```

Check available commands:

```bash
md2wp --help
```

## Install as Project Dependency

If you want to use md2wp in a specific project:

::: code-group
```bash [npm]
npm install --save-dev @md2wp/cli
```

```bash [pnpm]
pnpm add -D @md2wp/cli
```

```bash [yarn]
yarn add -D @md2wp/cli
```
:::

Then use via npm scripts:

```json
{
  "scripts": {
    "publish-post": "md2wp publish",
    "publish-draft": "md2wp publish --draft"
  }
}
```

## Use as a Library

Install the core library for programmatic use:

```bash
npm install @md2wp/core
```

Example usage:

```typescript
import {
  WordPressClient,
  parseMarkdownFile,
  transformToGutenberg
} from '@md2wp/core';

// Create WordPress client
const client = new WordPressClient({
  siteUrl: 'https://yoursite.com',
  username: 'yourname',
  password: 'your-app-password'
});

// Parse markdown
const parsed = await parseMarkdownFile('./post.md');

// Transform to Gutenberg
const content = transformToGutenberg(parsed.content);

// Create post
const post = await client.createPost({
  title: parsed.frontmatter.title,
  content: content,
  status: 'draft'
});

console.log('Published:', post.link);
```

## Development Setup

If you want to contribute or develop md2wp:

### Clone Repository

```bash
git clone https://github.com/TeamNickHart/md2wp.git
cd md2wp
```

### Install Dependencies

```bash
# Install pnpm if you don't have it
npm install -g pnpm

# Install dependencies
pnpm install
```

### Build All Packages

```bash
pnpm build
```

### Link CLI Locally

To use your local build globally:

```bash
pnpm link:cli
```

Now `md2wp` command will use your local development version.

### Unlink When Done

```bash
pnpm unlink:cli
```

## Updating

### Global Installation

::: code-group
```bash [npm]
npm update -g @md2wp/cli
```

```bash [pnpm]
pnpm update -g @md2wp/cli
```

```bash [yarn]
yarn global upgrade @md2wp/cli
```
:::

### Project Dependency

::: code-group
```bash [npm]
npm update @md2wp/cli
```

```bash [pnpm]
pnpm update @md2wp/cli
```

```bash [yarn]
yarn upgrade @md2wp/cli
```
:::

## Uninstalling

### Global Installation

::: code-group
```bash [npm]
npm uninstall -g @md2wp/cli
```

```bash [pnpm]
pnpm remove -g @md2wp/cli
```

```bash [yarn]
yarn global remove @md2wp/cli
```
:::

### Project Dependency

::: code-group
```bash [npm]
npm uninstall @md2wp/cli
```

```bash [pnpm]
pnpm remove @md2wp/cli
```

```bash [yarn]
yarn remove @md2wp/cli
```
:::

## Troubleshooting Installation

### Permission Errors (EACCES)

On macOS/Linux, you might see permission errors with global installs:

```bash
# Option 1: Use a version manager (recommended)
# Install nvm: https://github.com/nvm-sh/nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# Then install md2wp normally
npm install -g @md2wp/cli

# Option 2: Fix npm permissions
# https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally
```

### Command Not Found

If `md2wp` command isn't found after installation:

```bash
# Check npm global bin directory
npm config get prefix

# Add to your PATH (add to ~/.zshrc or ~/.bashrc)
export PATH="$PATH:$(npm config get prefix)/bin"
```

### Version Mismatch

If you have multiple Node.js versions:

```bash
# Check Node.js version
node --version  # Should be 18.0.0 or higher

# Check which md2wp is being used
which md2wp

# Check md2wp version
md2wp --version
```

## Next Steps

- [Getting Started Guide →](/guide/getting-started)
- [Authentication Setup →](/guide/authentication)
- [Configuration →](/guide/configuration)
