/**
 * Transform markdown AST to Gutenberg blocks
 */

import type {
  Root,
  Paragraph,
  Heading,
  List,
  ListItem,
  Image,
  Link,
  Text,
  Strong,
  Emphasis,
  InlineCode,
  PhrasingContent,
  Code,
  Blockquote,
} from 'mdast';
import type { ImageMap } from '../types.js';
import { parseMarkdown } from './parser.js';

/**
 * Transform markdown content to Gutenberg block HTML
 */
export function transformToGutenberg(
  content: string,
  imageMap: ImageMap = {},
): string {
  const ast = parseMarkdown(content);
  return transformASTToGutenberg(ast, imageMap);
}

/**
 * Transform markdown AST to Gutenberg block HTML
 */
export function transformASTToGutenberg(
  ast: Root,
  imageMap: ImageMap = {},
): string {
  const blocks: string[] = [];

  for (const node of ast.children) {
    const block = transformNode(node, imageMap);
    if (block) {
      blocks.push(block);
    }
  }

  return blocks.join('\n\n');
}

/**
 * Transform a single AST node to Gutenberg block
 */
function transformNode(
  node: Root['children'][number],
  imageMap: ImageMap,
): string | null {
  switch (node.type) {
    case 'heading':
      return transformHeading(node);
    case 'paragraph':
      return transformParagraph(node);
    case 'list':
      return transformList(node);
    case 'image':
      return transformImage(node, imageMap);
    case 'code':
      return transformCode(node);
    case 'blockquote':
      return transformBlockquote(node);
    case 'thematicBreak':
      return transformSeparator();
    default:
      return null;
  }
}

/**
 * Transform heading node
 */
function transformHeading(node: Heading): string {
  const level = node.depth;
  const content = transformInlineContent(node.children);
  const tag = `h${level}`;

  return `<!-- wp:heading {"level":${level}} -->
<${tag} class="wp-block-heading">${content}</${tag}>
<!-- /wp:heading -->`;
}

/**
 * Transform paragraph node
 */
function transformParagraph(node: Paragraph): string {
  const content = transformInlineContent(node.children);

  return `<!-- wp:paragraph -->
<p>${content}</p>
<!-- /wp:paragraph -->`;
}

/**
 * Transform list node
 */
function transformList(node: List): string {
  const isOrdered = node.ordered ?? false;
  const tag = isOrdered ? 'ol' : 'ul';
  const attrs = isOrdered ? ' {"ordered":true}' : '';

  const items = node.children
    .map((item) => transformListItem(item))
    .join('\n');

  return `<!-- wp:list${attrs} -->
<${tag} class="wp-block-list">
${items}
</${tag}>
<!-- /wp:list -->`;
}

/**
 * Transform list item node
 */
function transformListItem(node: ListItem): string {
  // List items can contain multiple paragraphs, but we'll handle simple case for now
  const content = node.children
    .map((child) => {
      if (child.type === 'paragraph') {
        return transformInlineContent(child.children);
      }
      return '';
    })
    .filter(Boolean)
    .join(' ');

  return `<li>${content}</li>`;
}

/**
 * Transform image node
 */
function transformImage(node: Image, imageMap: ImageMap): string {
  // Check if image was uploaded and we have WordPress media info
  const wpMedia = imageMap[node.url];

  if (wpMedia) {
    // Use WordPress media
    const alt = node.alt || '';
    const attrs = wpMedia.id ? ` {"id":${wpMedia.id},"sizeSlug":"large"}` : '';

    return `<!-- wp:image${attrs} -->
<figure class="wp-block-image size-large">
  <img src="${wpMedia.url}" alt="${escapeHtml(alt)}" class="wp-image-${wpMedia.id}"/>
</figure>
<!-- /wp:image -->`;
  } else {
    // Use original URL (for http/https URLs)
    const alt = node.alt || '';

    return `<!-- wp:image -->
<figure class="wp-block-image">
  <img src="${escapeHtml(node.url)}" alt="${escapeHtml(alt)}"/>
</figure>
<!-- /wp:image -->`;
  }
}

/**
 * Transform code block node
 */
function transformCode(node: Code): string {
  const code = escapeHtml(node.value);

  return `<!-- wp:code -->
<pre class="wp-block-code"><code>${code}</code></pre>
<!-- /wp:code -->`;
}

/**
 * Transform blockquote node
 */
function transformBlockquote(node: Blockquote): string {
  const content = node.children
    .map((child) => {
      if (child.type === 'paragraph') {
        return `<p>${transformInlineContent((child as Paragraph).children)}</p>`;
      }
      return '';
    })
    .filter(Boolean)
    .join('\n');

  return `<!-- wp:quote -->
<blockquote class="wp-block-quote">
${content}
</blockquote>
<!-- /wp:quote -->`;
}

/**
 * Transform separator (horizontal rule)
 */
function transformSeparator(): string {
  return `<!-- wp:separator -->
<hr class="wp-block-separator has-alpha-channel-opacity"/>
<!-- /wp:separator -->`;
}

/**
 * Transform inline/phrasing content
 */
function transformInlineContent(nodes: PhrasingContent[]): string {
  return nodes.map((node) => transformInlineNode(node)).join('');
}

/**
 * Transform a single inline node
 */
function transformInlineNode(node: PhrasingContent): string {
  switch (node.type) {
    case 'text':
      return escapeHtml((node as Text).value);
    case 'strong':
      return `<strong>${transformInlineContent((node as Strong).children)}</strong>`;
    case 'emphasis':
      return `<em>${transformInlineContent((node as Emphasis).children)}</em>`;
    case 'inlineCode':
      return `<code>${escapeHtml((node as InlineCode).value)}</code>`;
    case 'link':
      return transformLink(node as Link);
    case 'break':
      return '<br>';
    default:
      return '';
  }
}

/**
 * Transform link node
 */
function transformLink(node: Link): string {
  const href = escapeHtml(node.url);
  const content = transformInlineContent(node.children);
  const title = node.title ? ` title="${escapeHtml(node.title)}"` : '';

  return `<a href="${href}"${title}>${content}</a>`;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, (char) => map[char] ?? char);
}
