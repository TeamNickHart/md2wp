/**
 * WordPress posts API functionality
 */

import type { WPConfig, WPPostInput, WPPostResponse } from '../types.js';
import { createHeaders, buildApiUrl } from './auth.js';

/**
 * Create a new WordPress post
 */
export async function createPost(
  post: WPPostInput,
  config: WPConfig,
): Promise<WPPostResponse> {
  const url = buildApiUrl(config.siteUrl, '/posts');

  const response = await fetch(url, {
    method: 'POST',
    headers: createHeaders(config),
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to create post: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const data = (await response.json()) as WPPostResponse;
  return data;
}

/**
 * Update an existing WordPress post
 */
export async function updatePost(
  id: number,
  post: WPPostInput,
  config: WPConfig,
): Promise<WPPostResponse> {
  const url = buildApiUrl(config.siteUrl, `/posts/${id}`);

  const response = await fetch(url, {
    method: 'PUT',
    headers: createHeaders(config),
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to update post: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const data = (await response.json()) as WPPostResponse;
  return data;
}

/**
 * Get a WordPress post by ID
 */
export async function getPost(
  id: number,
  config: WPConfig,
): Promise<WPPostResponse> {
  const url = buildApiUrl(config.siteUrl, `/posts/${id}`);

  const response = await fetch(url, {
    method: 'GET',
    headers: createHeaders(config),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to get post: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const data = (await response.json()) as WPPostResponse;
  return data;
}

/**
 * Delete a WordPress post
 */
export async function deletePost(
  id: number,
  config: WPConfig,
  force = false,
): Promise<void> {
  const url = buildApiUrl(
    config.siteUrl,
    `/posts/${id}${force ? '?force=true' : ''}`,
  );

  const response = await fetch(url, {
    method: 'DELETE',
    headers: createHeaders(config),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to delete post: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }
}
