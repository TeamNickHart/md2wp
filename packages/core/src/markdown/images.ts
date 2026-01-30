/**
 * Image extraction from markdown AST
 */

import { dirname, resolve } from 'path';
import { visit } from 'unist-util-visit';
import type { Root, Image } from 'mdast';
import type { ImageRef } from '../types.js';
import { parseMarkdown } from './parser.js';

/**
 * Extract all image references from markdown content
 */
export function extractImages(content: string): ImageRef[] {
  const ast = parseMarkdown(content);
  return extractImagesFromAST(ast);
}

/**
 * Extract all image references from markdown AST
 */
export function extractImagesFromAST(ast: Root): ImageRef[] {
  const images: ImageRef[] = [];

  visit(ast, 'image', (node: Image) => {
    // Only process local file paths (not URLs)
    if (!node.url.startsWith('http://') && !node.url.startsWith('https://')) {
      images.push({
        path: node.url,
        alt: node.alt || undefined,
      });
    }
  });

  return images;
}

/**
 * Check if a path is a local file (not a URL)
 */
export function isLocalImagePath(path: string): boolean {
  return (
    !path.startsWith('http://') &&
    !path.startsWith('https://') &&
    !path.startsWith('//')
  );
}

/**
 * Resolve relative image path based on markdown file location
 */
export function resolveImagePath(
  imagePath: string,
  markdownFilePath: string,
): string {
  const markdownDir = dirname(markdownFilePath);
  return resolve(markdownDir, imagePath);
}
