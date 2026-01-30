/**
 * Core type definitions for md2wp
 */

// Configuration types
export interface Md2wpConfig {
  wordpress: {
    siteUrl: string;
    username: string;
  };
  posts?: {
    defaultStatus?: 'draft' | 'publish';
    defaultAuthor?: number;
  };
  images?: {
    basePath?: string;
    uploadPath?: string;
  };
}

export interface WPConfig {
  siteUrl: string;
  username: string;
  password: string;
}

// Frontmatter types
export interface Frontmatter {
  title: string;
  slug?: string | undefined;
  status?: 'draft' | 'publish' | undefined;
  featured_image?: string | undefined;
  tags?: string[] | undefined;
  categories?: string[] | undefined;
  excerpt?: string | undefined;
  date?: string | undefined;
  // WordPress-specific fields (added after publish)
  wp_post_id?: number | undefined;
  wp_url?: string | undefined;
  wp_modified?: string | undefined;
}

// Parsed markdown types
export interface ParsedPost {
  frontmatter: Frontmatter;
  content: string;
  images: ImageRef[];
}

export interface ImageRef {
  path: string;
  alt?: string | undefined;
}

// WordPress API response types
export interface WPMediaResponse {
  id: number;
  source_url: string;
  alt_text: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: Record<string, unknown>;
  };
}

export interface WPPostInput {
  title: string;
  content: string;
  status: 'draft' | 'publish' | 'private' | 'pending';
  slug?: string;
  excerpt?: string;
  featured_media?: number;
  categories?: number[];
  tags?: number[];
  date?: string;
}

export interface WPPostResponse {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_media: number;
  categories: number[];
  tags: number[];
}

// Image cache types
export interface CachedImage {
  mediaId: number;
  url: string;
  uploadedAt: string;
  verified?: string;
}

export interface ImageCache {
  images: Record<string, CachedImage>;
}

// Image processing types
export interface ProcessedImage {
  originalPath: string;
  hash: string;
  mediaId: number;
  url: string;
  alt?: string;
}

export interface ImageMap {
  [originalPath: string]: {
    id: number;
    url: string;
  };
}

// Platform abstraction (for future multi-platform support)
export interface BlogPlatformClient {
  uploadMedia(filePath: string): Promise<WPMediaResponse>;
  createPost(post: WPPostInput): Promise<WPPostResponse>;
  updatePost(id: number, post: WPPostInput): Promise<WPPostResponse>;
  getPost(id: number): Promise<WPPostResponse>;
  verifyMedia(id: number): Promise<boolean>;
}
