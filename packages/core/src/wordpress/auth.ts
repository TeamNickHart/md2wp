/**
 * WordPress authentication utilities
 * Uses Application Passwords (available in WordPress 5.6+)
 */

import type { WPConfig } from '../types.js';

/**
 * Generate Basic Auth header for WordPress Application Passwords
 */
export function createAuthHeader(config: WPConfig): string {
  const credentials = `${config.username}:${config.password}`;
  const base64Credentials = Buffer.from(credentials).toString('base64');
  return `Basic ${base64Credentials}`;
}

/**
 * Create common headers for WordPress REST API requests
 */
export function createHeaders(config: WPConfig): Record<string, string> {
  return {
    Authorization: createAuthHeader(config),
    'Content-Type': 'application/json',
  };
}

/**
 * Validate WordPress config
 */
export function validateConfig(config: WPConfig): void {
  if (!config.siteUrl) {
    throw new Error('WordPress siteUrl is required');
  }

  if (!config.username) {
    throw new Error('WordPress username is required');
  }

  if (!config.password) {
    throw new Error('WordPress password is required');
  }

  // Normalize site URL (remove trailing slash)
  if (config.siteUrl.endsWith('/')) {
    config.siteUrl = config.siteUrl.slice(0, -1);
  }

  // Ensure site URL has protocol
  if (
    !config.siteUrl.startsWith('http://') &&
    !config.siteUrl.startsWith('https://')
  ) {
    config.siteUrl = `https://${config.siteUrl}`;
  }
}

/**
 * Build WordPress REST API endpoint URL
 */
export function buildApiUrl(siteUrl: string, path: string): string {
  const normalizedSiteUrl = siteUrl.endsWith('/')
    ? siteUrl.slice(0, -1)
    : siteUrl;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedSiteUrl}/wp-json/wp/v2${normalizedPath}`;
}
