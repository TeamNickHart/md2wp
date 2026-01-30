/**
 * Main WordPress client class
 */

import type {
  WPConfig,
  WPMediaResponse,
  WPPostInput,
  WPPostResponse,
  BlogPlatformClient,
} from '../types.js';
import { validateConfig } from './auth.js';
import { uploadMedia as upload, verifyMedia as verify } from './media.js';
import {
  createPost as create,
  updatePost as update,
  getPost as get,
} from './posts.js';

/**
 * WordPress REST API client
 * Implements BlogPlatformClient interface for potential multi-platform support
 */
export class WordPressClient implements BlogPlatformClient {
  private config: WPConfig;

  constructor(config: WPConfig) {
    validateConfig(config);
    this.config = config;
  }

  /**
   * Upload a media file to WordPress
   */
  async uploadMedia(filePath: string, alt?: string): Promise<WPMediaResponse> {
    return upload(filePath, this.config, alt);
  }

  /**
   * Verify that a media item still exists
   */
  async verifyMedia(id: number): Promise<boolean> {
    return verify(id, this.config);
  }

  /**
   * Create a new post
   */
  async createPost(post: WPPostInput): Promise<WPPostResponse> {
    return create(post, this.config);
  }

  /**
   * Update an existing post
   */
  async updatePost(id: number, post: WPPostInput): Promise<WPPostResponse> {
    return update(id, post, this.config);
  }

  /**
   * Get a post by ID
   */
  async getPost(id: number): Promise<WPPostResponse> {
    return get(id, this.config);
  }

  /**
   * Get the WordPress site URL
   */
  getSiteUrl(): string {
    return this.config.siteUrl;
  }
}
