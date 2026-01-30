/**
 * Frontmatter writing utilities
 */

import { readFile, writeFile } from 'fs/promises';
import matter from 'gray-matter';

/**
 * Updates to apply to frontmatter
 */
export interface FrontmatterUpdates {
  wp_post_id?: number;
  wp_url?: string;
  wp_modified?: string;
  [key: string]: unknown;
}

/**
 * Update frontmatter in a markdown file
 * Preserves existing frontmatter and content, merges in new fields
 */
export async function updateFrontmatter(
  filePath: string,
  updates: FrontmatterUpdates,
): Promise<void> {
  // Read existing file
  const fileContent = await readFile(filePath, 'utf-8');

  // Parse frontmatter
  const parsed = matter(fileContent);

  // Merge updates into existing data
  const updatedData = {
    ...parsed.data,
    ...updates,
  };

  // Stringify back to markdown with frontmatter
  const updated = matter.stringify(parsed.content, updatedData);

  // Write back to file
  await writeFile(filePath, updated, 'utf-8');
}
