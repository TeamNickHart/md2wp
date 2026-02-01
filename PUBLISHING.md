# Publishing Guide

This guide explains how to publish packages to npm using Changesets.

## Prerequisites

1. **npm Account**: Create an account at [npmjs.com](https://www.npmjs.com/)
2. **npm Login**: Log in to npm from the command line
3. **2FA**: Set up two-factor authentication (recommended)
4. **GitHub Token**: For automated releases (optional)

## Setup

### 1. Log in to npm

```bash
npm login
```

Follow the prompts to enter:

- Username
- Password
- Email
- OTP (if 2FA is enabled)

Verify you're logged in:

```bash
npm whoami
```

### 2. Verify Package Configuration

Both `@md2wp/cli` and `@md2wp/core` are configured with:

- ✅ `publishConfig.access: "public"` - Required for scoped packages
- ✅ `files: ["dist", "README.md"]` - Only publish built files
- ✅ `repository`, `bugs`, `homepage` - Package metadata
- ✅ Proper `main`, `types`, `exports` - Entry points

## Publishing Workflow

### Step 1: Create a Changeset

When you make changes that should be released, create a changeset:

```bash
pnpm changeset
```

This will:

1. Ask which packages changed
2. Ask what type of change (major/minor/patch)
3. Ask for a description of the changes
4. Create a markdown file in `.changeset/`

**Note**: A changeset has already been created for the v1.0.0 release (`.changeset/initial-release.md`)

### Step 2: Version Packages

When ready to release, update package versions:

```bash
pnpm version
```

This runs `changeset version` which:

1. Updates package.json versions
2. Generates/updates CHANGELOG.md files
3. Deletes consumed changeset files
4. Updates pnpm-lock.yaml

### Step 3: Build Packages

Ensure all packages are built:

```bash
pnpm build
```

This compiles TypeScript to JavaScript in each package's `dist/` directory.

### Step 4: Verify Build

Check that the build output is correct:

```bash
ls -la packages/cli/dist/
ls -la packages/core/dist/
```

You should see:

- `.js` files
- `.d.ts` type definition files
- `.js.map` and `.d.ts.map` source maps

### Step 5: Test Locally (Optional)

Test the CLI locally before publishing:

```bash
pnpm link:cli
md2wp --version
md2wp --help
```

Unlink when done:

```bash
pnpm unlink:cli
```

### Step 6: Commit Version Changes

```bash
git add .
git commit -m "chore: Release v1.0.0"
git push origin main
```

### Step 7: Publish to npm

Publish all packages:

```bash
pnpm release
```

This runs `pnpm build && changeset publish --provenance` which:

1. Builds all packages
2. Publishes changed packages to npm
3. Creates git tags for releases
4. Adds provenance (links package to source code)

### Step 8: Push Tags

Push the created git tags:

```bash
git push --follow-tags
```

## Verifying the Release

### On npm

Visit your packages:

- https://www.npmjs.com/package/@md2wp/cli
- https://www.npmjs.com/package/@md2wp/core

### Install and Test

```bash
npm install -g @md2wp/cli
md2wp --version
```

## Troubleshooting

### "401 Unauthorized" Error

You're not logged in to npm. Run:

```bash
npm login
```

### "403 Forbidden" Error

You don't have permission to publish to the `@md2wp` scope. Options:

1. Create the scope on npm first
2. Change package names to unscoped (e.g., `md2wp-cli`)
3. Add yourself as a maintainer to the scope

### "Package already exists" Error

The version you're trying to publish already exists. You need to:

1. Create a new changeset
2. Run `pnpm version` to bump the version
3. Try publishing again

### Build Errors

If the build fails:

```bash
pnpm clean
pnpm build
```

### Missing Files in Package

Check what will be published:

```bash
cd packages/cli
npm pack --dry-run
```

This shows what files will be included in the published package.

## Automated Publishing (GitHub Actions)

For automated releases, add a GitHub workflow (`.github/workflows/release.yml`):

```yaml
name: Release

on:
  push:
    branches:
      - main

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test:run
      - name: Create Release Pull Request or Publish
        uses: changesets/action@v1
        with:
          publish: pnpm release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

You'll need to add `NPM_TOKEN` to your GitHub repository secrets.

## Best Practices

1. **Always test locally first**: Use `pnpm link:cli` to test before publishing
2. **Semantic Versioning**: Follow semver (major.minor.patch)
3. **Meaningful Changelogs**: Write clear changeset descriptions
4. **Review Changes**: Check `git diff` before versioning
5. **CI Passes**: Ensure all tests pass before publishing
6. **Tags**: Always push tags after publishing

## Version Bumping Guide

- **Major (1.0.0 → 2.0.0)**: Breaking changes
- **Minor (1.0.0 → 1.1.0)**: New features (backwards compatible)
- **Patch (1.0.0 → 1.0.1)**: Bug fixes

## Next Steps

After your first release:

1. Monitor npm downloads
2. Watch for issues on GitHub
3. Create new changesets for future releases
4. Consider setting up automated releases
5. Keep documentation up to date

## Resources

- [Changesets Documentation](https://github.com/changesets/changesets)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
