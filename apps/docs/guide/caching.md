# Image Caching

md2wp uses SHA-256 hashing to cache uploaded images and prevent duplicates.

## How It Works

1. **Hash file** - Generate SHA-256 hash of image content
2. **Check cache** - Look up hash in `.md2wp/cache.json`
3. **If found** - Verify media exists in WordPress, reuse
4. **If not** - Upload to WordPress, add to cache

## Cache Location

Cache is stored in `.md2wp/cache.json`:

```json
{
  "images": {
    "a1b2c3d4...": {
      "mediaId": 123,
      "url": "https://site.com/.../image.jpg",
      "uploadedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

## Benefits

- 🚀 **Faster** - No re-upload of existing images
- 💾 **Storage** - Prevents duplicates in WordPress
- ✅ **Reliable** - Verifies media still exists

## Clearing Cache

```bash
rm -rf .md2wp/cache.json
```

## Next Steps

- [Working with Images →](/guide/images)
- [Publishing Guide →](/guide/publishing)
