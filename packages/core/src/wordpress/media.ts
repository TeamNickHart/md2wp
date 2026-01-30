/**
 * WordPress media upload functionality
 */

import { readFile } from 'fs/promises';
import { basename } from 'path';
import { lookup } from 'mime-types';
import type { WPConfig, WPMediaResponse } from '../types.js';
import { createAuthHeader, buildApiUrl } from './auth.js';

/**
 * Upload a media file to WordPress
 */
export async function uploadMedia(
  filePath: string,
  config: WPConfig,
  alt?: string,
): Promise<WPMediaResponse> {
  // Read file
  const fileBuffer = await readFile(filePath);
  const fileName = basename(filePath);
  const mimeType = lookup(filePath) || 'application/octet-stream';

  // Build URL
  const url = buildApiUrl(config.siteUrl, '/media');

  // Create FormData (Node 18+ has native FormData)
  const formData = new FormData();
  const blob = new Blob([fileBuffer], { type: mimeType });
  formData.append('file', blob, fileName);

  if (alt) {
    formData.append('alt_text', alt);
  }

  // Upload
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: createAuthHeader(config),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to upload media: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const data = (await response.json()) as WPMediaResponse;
  return data;
}

/**
 * Verify that a media item still exists in WordPress
 */
export async function verifyMedia(
  mediaId: number,
  config: WPConfig,
): Promise<boolean> {
  const url = buildApiUrl(config.siteUrl, `/media/${mediaId}`);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: createAuthHeader(config),
    },
  });

  return response.ok;
}

/**
 * Get media item details
 */
export async function getMedia(
  mediaId: number,
  config: WPConfig,
): Promise<WPMediaResponse> {
  const url = buildApiUrl(config.siteUrl, `/media/${mediaId}`);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: createAuthHeader(config),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to get media: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const data = (await response.json()) as WPMediaResponse;
  return data;
}
