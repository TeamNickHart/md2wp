/**
 * Markdown parsing with frontmatter support
 */

import { readFile } from 'fs/promises';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type { Root } from 'mdast';
import type { Frontmatter, ParsedPost } from '../types.js';

/**
 * Parse a markdown file with frontmatter
 */
export async function parseMarkdownFile(filePath: string): Promise<ParsedPost> {
  // Read file
  const fileContent = await readFile(filePath, 'utf-8');

  // Parse frontmatter
  const { data, content } = matter(fileContent);

  // Validate required frontmatter fields
  if (!data.title) {
    throw new Error('Frontmatter must include a "title" field');
  }

  // Parse frontmatter into typed object
  const frontmatter: Frontmatter = {
    title: String(data.title),
    slug: data.slug ? String(data.slug) : undefined,
    status: data.status === 'publish' ? 'publish' : 'draft',
    featured_image: data.featured_image
      ? String(data.featured_image)
      : undefined,
    tags: Array.isArray(data.tags)
      ? data.tags.map((t) => String(t))
      : undefined,
    categories: Array.isArray(data.categories)
      ? data.categories.map((c) => String(c))
      : undefined,
    excerpt: data.excerpt ? String(data.excerpt) : undefined,
    date: data.date ? String(data.date) : undefined,
  };

  return {
    frontmatter,
    content,
    images: [], // Will be populated by extractImages
  };
}

/**
 * Parse markdown content into AST
 */
export function parseMarkdown(content: string): Root {
  const processor = unified().use(remarkParse).use(remarkGfm);

  const ast = processor.parse(content);
  return ast;
}

/**
 * Validate frontmatter
 */
export function validateFrontmatter(frontmatter: Frontmatter): void {
  if (!frontmatter.title || frontmatter.title.trim() === '') {
    throw new Error('Frontmatter title cannot be empty');
  }

  if (
    frontmatter.status &&
    !['draft', 'publish'].includes(frontmatter.status)
  ) {
    throw new Error('Frontmatter status must be either "draft" or "publish"');
  }
}
