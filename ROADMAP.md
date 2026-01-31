# md2wp Roadmap

## v1.0.0 - Core Functionality (Current)

**Goal:** Minimum viable product for publishing markdown to WordPress with Gutenberg blocks

- [x] Monorepo setup with Turborepo + pnpm
- [x] Core package with TypeScript
- [x] WordPress REST API client
- [x] Application Password authentication
- [x] .env file support
- [x] Markdown parsing with frontmatter
- [x] Image extraction from markdown
- [x] Gutenberg block transformer (paragraphs, headings, lists, images, links, code blocks)
- [x] Image cache system (SHA-256 hashing)
- [x] Configuration loader
- [ ] CLI publish command implementation
- [ ] CLI validate command
- [ ] CLI config command
- [ ] Unit tests for core functions
- [ ] Integration tests with mocked WordPress API
- [ ] Documentation site (VitePress)
- [ ] First npm release

### Supported Markdown Features (v1.0)

- ✅ Headings (H1-H6)
- ✅ Paragraphs
- ✅ Lists (ordered & unordered)
- ✅ Images (local file upload)
- ✅ Links
- ✅ Bold/italic/inline code
- ✅ Code blocks
- ✅ Blockquotes
- ✅ Horizontal rules

## v1.1.0 - Enhanced Authentication

**Goal:** Improve authentication UX and security

### Features

- [ ] `md2wp auth login` - Interactive credential setup
- [ ] `md2wp auth logout` - Clear stored credentials
- [ ] `md2wp auth status` - Show current auth state
- [ ] `md2wp auth refresh` - Validate and test credentials
- [ ] OS Keychain integration (secure credential storage)
  - macOS: Keychain
  - Windows: Credential Manager
  - Linux: Secret Service API
- [ ] Fallback to .env if keychain unavailable
- [ ] Better error messages for auth failures
- [ ] Token expiration detection

### Technical

- Add `@napi-rs/keyring` or `keytar` dependency
- Credential storage abstraction layer
- Automatic credential validation on load

## v1.2.0 - Advanced Markdown & Image Validation

**Goal:** Support more complex markdown structures and comprehensive image validation

### Markdown Features

- [ ] Tables → `<!-- wp:table -->`
- [ ] Task lists → `<!-- wp:list -->` with checkboxes
- [ ] Footnotes
- [ ] Definition lists
- [ ] Math equations (KaTeX)
- [ ] Mermaid diagrams
- [ ] Custom Gutenberg block mapping config

### Full Image Validation

**Current (v1.0):** Basic validation - file existence, size checking, cache lookup

**Planned for v1.2:**

- [ ] Image format validation (JPEG, PNG, WebP, GIF, SVG support)
- [ ] Image dimension checking using `image-size` library
- [ ] Dimension warnings/recommendations (e.g., optimal sizes for web)
- [ ] Format conversion suggestions (e.g., suggest WebP for better compression)
- [ ] Verbose mode flag (`--verbose`) for detailed validation output
- [ ] EXIF data extraction (orientation, camera info)
- [ ] Color profile validation
- [ ] Accessibility checks (minimum contrast for text overlays)

### Configuration

```json
{
  "blocks": {
    "table": {
      "enabled": true,
      "defaultStyle": "striped"
    },
    "math": {
      "enabled": true,
      "renderer": "katex"
    }
  }
}
```

## v1.3.0 - Post Management

**Goal:** Better management of existing posts

### Features

- [ ] Update existing posts (not just create new)
- [ ] `wp_post_id` writeback to frontmatter after publish
- [ ] `md2wp list` - List all posts
- [ ] `md2wp pull <post-id>` - Download WP post as markdown
- [ ] `md2wp delete <post-id>` - Delete post
- [ ] Draft/publish status toggling
- [ ] Scheduled publishing support

### Frontmatter Extensions

```yaml
---
wp_post_id: 12345 # Automatically added after first publish
wp_modified: 2024-01-15T10:30:00Z
---
```

## v1.4.0 - Advanced Media Features

**Goal:** Better image and media handling

### Features

- [ ] Image optimization before upload
  - Resize large images
  - Convert to WebP
  - Compress JPEG/PNG
- [ ] Media library deduplication by content hash
- [ ] Featured image support from frontmatter
- [ ] Image captions and alt text from markdown
- [ ] SVG support
- [ ] Video/audio upload support
- [ ] External image URLs (skip upload)
- [ ] Image size selection (thumbnail, medium, large, full)

### Configuration

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

## v1.5.0 - Content Management

**Goal:** Advanced content features

### Features

- [ ] Inter-post link resolution (`[See this post](./other-post.md)`)
- [ ] Category/tag creation if they don't exist
- [ ] Custom post types support
- [ ] Custom fields/meta data
- [ ] Taxonomy management
- [ ] Post templates
- [ ] Content snippets/reusable blocks

## v2.0.0 - Multi-Platform Support

**Goal:** Support other blogging platforms

### Platforms

- [ ] Ghost CMS
- [ ] Medium
- [ ] Dev.to
- [ ] Hashnode
- [ ] Substack (if API available)

### Architecture

- [ ] Platform adapter interface
- [ ] Platform-specific transformers
- [ ] Unified CLI across platforms
- [ ] Platform auto-detection from config

### Usage

```bash
md2wp publish post.md --platform wordpress
md2wp publish post.md --platform ghost
```

## v2.1.0 - VS Code Extension

**Goal:** Publish from within VS Code

### Features

- [ ] Right-click publish from editor
- [ ] Frontmatter snippet generator
- [ ] Live preview as Gutenberg blocks
- [ ] Image upload progress in status bar
- [ ] Post list sidebar
- [ ] Markdown validation/linting
- [ ] WordPress site switcher

## v2.2.0 - Advanced Workflows

**Goal:** Support complex publishing workflows

### Features

- [ ] Batch publishing (`md2wp publish posts/*.md`)
- [ ] Watch mode (`md2wp watch posts/`)
- [ ] Git hooks integration
- [ ] CI/CD deployment (GitHub Actions, GitLab CI)
- [ ] Content versioning
- [ ] Rollback support
- [ ] Diff view before publish
- [ ] Approval workflow for teams

## v3.0.0 - Enterprise Features

**Goal:** Support large teams and complex sites

### Features

- [ ] Multi-site support
- [ ] Multi-user authentication
- [ ] Team collaboration (review/approve)
- [ ] Content analytics
- [ ] SEO optimization suggestions
- [ ] Accessibility checking
- [ ] Translation management (WPML/Polylang)
- [ ] Custom block development SDK

## Community Features (Ongoing)

- [ ] Plugin system for custom transformers
- [ ] Template marketplace
- [ ] WordPress plugin (server-side companion)
- [ ] Web UI (Electron app or web dashboard)
- [ ] Mobile app (React Native)

## Technical Debt & Improvements

### Code Quality

- [ ] Increase test coverage to 90%+
- [ ] E2E tests with real WordPress (Docker)
- [ ] Performance benchmarks
- [ ] Memory usage optimization
- [ ] Bundle size reduction

### Documentation

- [ ] API documentation (TypeDoc)
- [ ] Video tutorials
- [ ] Migration guides
- [ ] Troubleshooting guide
- [ ] Contributing guide

### DevX

- [ ] Better error messages
- [ ] Debug mode (`--debug` flag)
- [ ] Verbose logging
- [ ] Progress indicators for long operations
- [ ] Prettier CLI output (better UX)

## Authentication Future Ideas

### v1.1 - OS Keychain (Planned)

**Secure, native credential storage**

```bash
md2wp auth login
# Prompts for credentials
# Stores in OS keychain
# Never touches filesystem
```

**Implementation:**

- Use `@napi-rs/keyring` for cross-platform support
- Encrypted by OS (Keychain/Credential Manager/Secret Service)
- Automatic credential loading
- Revocation support

### v2.0 - OAuth Flow (WordPress.com)

**Browser-based authentication**

```bash
md2wp auth login --oauth
# Opens browser
# User authorizes
# CLI receives token
# Token stored securely
```

**Note:** Only works for WordPress.com or self-hosted with OAuth plugin

### v2.1 - JWT Support

**Token-based authentication**

For WordPress sites with JWT authentication plugins:

```json
{
  "wordpress": {
    "authType": "jwt",
    "tokenUrl": "https://site.com/wp-json/jwt-auth/v1/token"
  }
}
```

### v3.0 - SSO / Enterprise Auth

**For enterprise WordPress setups**

- SAML 2.0 support
- LDAP integration
- Active Directory
- Custom OAuth providers

---

## Contributing

Have ideas for features? Open an issue or discussion on GitHub!

## Release Schedule

- v1.0.0: Target Q2 2024
- v1.1.0: Target Q3 2024
- v2.0.0: Target Q4 2024

_Schedule subject to change based on community feedback and contributions_
