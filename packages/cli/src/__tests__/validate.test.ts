/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateCommand } from '../commands/validate.js';
import * as core from '@md2wp/core';

// Mock console methods to suppress output during tests
vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'error').mockImplementation(() => {});

// Mock process.exit to prevent actual exit and allow testing
const mockExit = vi
  .spyOn(process, 'exit')
  .mockImplementation((code?: number | string | null | undefined) => {
    throw new Error(`EXIT_${code}`);
  });

// Mock core functions
vi.mock('@md2wp/core', async () => {
  const actual = await vi.importActual('@md2wp/core');
  return {
    ...actual,
    parseMarkdownFile: vi.fn(),
    extractImages: vi.fn(),
    processImagesForDryRun: vi.fn(),
    transformToGutenberg: vi.fn(),
    ImageCacheManager: vi.fn(),
  };
});

describe('validateCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default ImageCacheManager mock
    vi.mocked(core.ImageCacheManager).mockImplementation(
      () =>
        ({
          load: vi.fn().mockResolvedValue(undefined),
          save: vi.fn().mockResolvedValue(undefined),
          get: vi.fn(),
          set: vi.fn(),
          has: vi.fn(),
          delete: vi.fn(),
          clear: vi.fn(),
        }) as any,
    );
  });

  describe('successful validation', () => {
    it('should pass validation for valid markdown with minimal frontmatter', async () => {
      vi.mocked(core.parseMarkdownFile).mockResolvedValue({
        frontmatter: {
          title: 'Test Post',
        },
        content: '# Hello World',
        images: [],
      });

      vi.mocked(core.extractImages).mockReturnValue([]);
      vi.mocked(core.transformToGutenberg).mockReturnValue(
        '<!-- wp:heading --><h1>Hello World</h1><!-- /wp:heading -->',
      );

      await expect(validateCommand('test.md')).rejects.toThrow('EXIT_0');
      expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('should pass validation for markdown with full frontmatter', async () => {
      vi.mocked(core.parseMarkdownFile).mockResolvedValue({
        frontmatter: {
          title: 'Complete Post',
          status: 'publish',
          slug: 'complete-post',
          excerpt: 'This is an excerpt',
          tags: ['tag1', 'tag2'],
          categories: ['cat1', 'cat2'],
          date: '2024-01-15T10:30:00Z',
          wp_post_id: 456,
          wp_url: 'https://example.com/complete-post',
        },
        content: 'Content',
        images: [],
      });

      vi.mocked(core.extractImages).mockReturnValue([]);
      vi.mocked(core.transformToGutenberg).mockReturnValue(
        '<!-- wp:paragraph -->Content<!-- /wp:paragraph -->',
      );

      await expect(validateCommand('test.md')).rejects.toThrow('EXIT_0');
      expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('should pass validation with existing images', async () => {
      vi.mocked(core.parseMarkdownFile).mockResolvedValue({
        frontmatter: {
          title: 'Post with Images',
        },
        content: '![Alt](./image.png)',
        images: [],
      });

      vi.mocked(core.extractImages).mockReturnValue([
        { path: './image.png', alt: 'Alt' },
      ]);

      vi.mocked(core.processImagesForDryRun).mockResolvedValue([
        {
          path: './image.png',
          absolutePath: '/abs/path/image.png',
          alt: 'Alt',
          validation: {
            exists: true,
            absolutePath: '/abs/path/image.png',
            size: 1024,
            sizeFormatted: '1.0 KB',
            errors: [],
            warnings: [],
          },
          cacheHit: false,
        },
      ]);

      vi.mocked(core.transformToGutenberg).mockReturnValue('<!-- wp:image -->');

      await expect(validateCommand('test.md')).rejects.toThrow('EXIT_0');
      expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('should pass validation with cached images', async () => {
      vi.mocked(core.parseMarkdownFile).mockResolvedValue({
        frontmatter: {
          title: 'Post with Cached Image',
        },
        content: '![Cached](./cached.png)',
        images: [],
      });

      vi.mocked(core.extractImages).mockReturnValue([
        { path: './cached.png', alt: 'Cached' },
      ]);

      vi.mocked(core.processImagesForDryRun).mockResolvedValue([
        {
          path: './cached.png',
          absolutePath: '/abs/path/cached.png',
          alt: 'Cached',
          validation: {
            exists: true,
            absolutePath: '/abs/path/cached.png',
            size: 2048,
            sizeFormatted: '2.0 KB',
            errors: [],
            warnings: [],
          },
          cacheHit: true,
          cachedMediaId: 123,
        },
      ]);

      vi.mocked(core.transformToGutenberg).mockReturnValue('<!-- wp:image -->');

      await expect(
        validateCommand('test.md', { verbose: true }),
      ).rejects.toThrow('EXIT_0');
      expect(mockExit).toHaveBeenCalledWith(0);
    });
  });

  describe('frontmatter validation errors', () => {
    it('should fail when title is missing', async () => {
      vi.mocked(core.parseMarkdownFile).mockResolvedValue({
        frontmatter: {
          status: 'draft',
        } as any,
        content: 'Content',
        images: [],
      });

      await expect(validateCommand('test.md')).rejects.toThrow('EXIT_1');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should fail when title is not a string', async () => {
      vi.mocked(core.parseMarkdownFile).mockResolvedValue({
        frontmatter: {
          title: 123 as any,
        },
        content: 'Content',
        images: [],
      });

      await expect(validateCommand('test.md')).rejects.toThrow('EXIT_1');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should fail when status is invalid', async () => {
      vi.mocked(core.parseMarkdownFile).mockResolvedValue({
        frontmatter: {
          title: 'Test',
          status: 'invalid' as any,
        },
        content: 'Content',
        images: [],
      });

      await expect(validateCommand('test.md')).rejects.toThrow('EXIT_1');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should fail when slug is not a string', async () => {
      vi.mocked(core.parseMarkdownFile).mockResolvedValue({
        frontmatter: {
          title: 'Test',
          slug: 123 as any,
        },
        content: 'Content',
        images: [],
      });

      await expect(validateCommand('test.md')).rejects.toThrow('EXIT_1');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should fail when excerpt is not a string', async () => {
      vi.mocked(core.parseMarkdownFile).mockResolvedValue({
        frontmatter: {
          title: 'Test',
          excerpt: 123 as any,
        },
        content: 'Content',
        images: [],
      });

      await expect(validateCommand('test.md')).rejects.toThrow('EXIT_1');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should fail when tags is not an array', async () => {
      vi.mocked(core.parseMarkdownFile).mockResolvedValue({
        frontmatter: {
          title: 'Test',
          tags: 'tag1,tag2' as any,
        },
        content: 'Content',
        images: [],
      });

      await expect(validateCommand('test.md')).rejects.toThrow('EXIT_1');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should fail when tags contains non-strings', async () => {
      vi.mocked(core.parseMarkdownFile).mockResolvedValue({
        frontmatter: {
          title: 'Test',
          tags: ['tag1', 123] as any,
        },
        content: 'Content',
        images: [],
      });

      await expect(validateCommand('test.md')).rejects.toThrow('EXIT_1');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should fail when categories is not an array', async () => {
      vi.mocked(core.parseMarkdownFile).mockResolvedValue({
        frontmatter: {
          title: 'Test',
          categories: 'cat1,cat2' as any,
        },
        content: 'Content',
        images: [],
      });

      await expect(validateCommand('test.md')).rejects.toThrow('EXIT_1');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should fail when categories contains non-strings', async () => {
      vi.mocked(core.parseMarkdownFile).mockResolvedValue({
        frontmatter: {
          title: 'Test',
          categories: ['cat1', 123] as any,
        },
        content: 'Content',
        images: [],
      });

      await expect(validateCommand('test.md')).rejects.toThrow('EXIT_1');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should fail when date is not a string', async () => {
      vi.mocked(core.parseMarkdownFile).mockResolvedValue({
        frontmatter: {
          title: 'Test',
          date: 123 as any,
        },
        content: 'Content',
        images: [],
      });

      await expect(validateCommand('test.md')).rejects.toThrow('EXIT_1');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should fail when date is invalid ISO format', async () => {
      vi.mocked(core.parseMarkdownFile).mockResolvedValue({
        frontmatter: {
          title: 'Test',
          date: 'not-a-date',
        },
        content: 'Content',
        images: [],
      });

      await expect(validateCommand('test.md')).rejects.toThrow('EXIT_1');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should fail when wp_post_id is not a number', async () => {
      vi.mocked(core.parseMarkdownFile).mockResolvedValue({
        frontmatter: {
          title: 'Test',
          wp_post_id: '123' as any,
        },
        content: 'Content',
        images: [],
      });

      await expect(validateCommand('test.md')).rejects.toThrow('EXIT_1');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should fail when wp_url is not a string', async () => {
      vi.mocked(core.parseMarkdownFile).mockResolvedValue({
        frontmatter: {
          title: 'Test',
          wp_url: 123 as any,
        },
        content: 'Content',
        images: [],
      });

      await expect(validateCommand('test.md')).rejects.toThrow('EXIT_1');
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('image validation errors', () => {
    it('should fail when images are missing', async () => {
      vi.mocked(core.parseMarkdownFile).mockResolvedValue({
        frontmatter: {
          title: 'Test',
        },
        content: '![Missing](./missing.png)',
        images: [],
      });

      vi.mocked(core.extractImages).mockReturnValue([
        { path: './missing.png', alt: 'Missing' },
      ]);

      vi.mocked(core.processImagesForDryRun).mockResolvedValue([
        {
          path: './missing.png',
          absolutePath: '/abs/path/missing.png',
          alt: 'Missing',
          validation: {
            exists: false,
            absolutePath: '/abs/path/missing.png',
            errors: ['File not found'],
            warnings: [],
          },
          cacheHit: false,
        },
      ]);

      await expect(validateCommand('test.md')).rejects.toThrow('EXIT_1');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should fail when multiple images are missing', async () => {
      vi.mocked(core.parseMarkdownFile).mockResolvedValue({
        frontmatter: {
          title: 'Test',
        },
        content: '![Missing1](./missing1.png) ![Missing2](./missing2.png)',
        images: [],
      });

      vi.mocked(core.extractImages).mockReturnValue([
        { path: './missing1.png', alt: 'Missing1' },
        { path: './missing2.png', alt: 'Missing2' },
      ]);

      vi.mocked(core.processImagesForDryRun).mockResolvedValue([
        {
          path: './missing1.png',
          absolutePath: '/abs/path/missing1.png',
          alt: 'Missing1',
          validation: {
            exists: false,
            absolutePath: '/abs/path/missing1.png',
            errors: ['File not found'],
            warnings: [],
          },
          cacheHit: false,
        },
        {
          path: './missing2.png',
          absolutePath: '/abs/path/missing2.png',
          alt: 'Missing2',
          validation: {
            exists: false,
            absolutePath: '/abs/path/missing2.png',
            errors: ['File not found'],
            warnings: [],
          },
          cacheHit: false,
        },
      ]);

      await expect(validateCommand('test.md')).rejects.toThrow('EXIT_1');
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('valid date formats', () => {
    it('should accept ISO 8601 date with time and timezone', async () => {
      vi.mocked(core.parseMarkdownFile).mockResolvedValue({
        frontmatter: {
          title: 'Test',
          date: '2024-01-15T10:30:00Z',
        },
        content: 'Content',
        images: [],
      });

      vi.mocked(core.extractImages).mockReturnValue([]);
      vi.mocked(core.transformToGutenberg).mockReturnValue(
        '<!-- wp:paragraph -->',
      );

      await expect(validateCommand('test.md')).rejects.toThrow('EXIT_0');
      expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('should accept ISO 8601 date without time', async () => {
      vi.mocked(core.parseMarkdownFile).mockResolvedValue({
        frontmatter: {
          title: 'Test',
          date: '2024-01-15',
        },
        content: 'Content',
        images: [],
      });

      vi.mocked(core.extractImages).mockReturnValue([]);
      vi.mocked(core.transformToGutenberg).mockReturnValue(
        '<!-- wp:paragraph -->',
      );

      await expect(validateCommand('test.md')).rejects.toThrow('EXIT_0');
      expect(mockExit).toHaveBeenCalledWith(0);
    });
  });

  describe('status field validation', () => {
    it('should accept status "draft"', async () => {
      vi.mocked(core.parseMarkdownFile).mockResolvedValue({
        frontmatter: {
          title: 'Test',
          status: 'draft',
        },
        content: 'Content',
        images: [],
      });

      vi.mocked(core.extractImages).mockReturnValue([]);
      vi.mocked(core.transformToGutenberg).mockReturnValue(
        '<!-- wp:paragraph -->',
      );

      await expect(validateCommand('test.md')).rejects.toThrow('EXIT_0');
      expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('should accept status "publish"', async () => {
      vi.mocked(core.parseMarkdownFile).mockResolvedValue({
        frontmatter: {
          title: 'Test',
          status: 'publish',
        },
        content: 'Content',
        images: [],
      });

      vi.mocked(core.extractImages).mockReturnValue([]);
      vi.mocked(core.transformToGutenberg).mockReturnValue(
        '<!-- wp:paragraph -->',
      );

      await expect(validateCommand('test.md')).rejects.toThrow('EXIT_0');
      expect(mockExit).toHaveBeenCalledWith(0);
    });
  });
});
