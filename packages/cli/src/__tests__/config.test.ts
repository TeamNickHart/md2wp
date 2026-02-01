/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { configCommand } from '../commands/config.js';
import * as core from '@md2wp/core';
import * as fs from 'fs';

// Mock console methods to suppress output during tests
vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'error').mockImplementation(() => {});

// Mock process.exit
const mockExit = vi
  .spyOn(process, 'exit')
  .mockImplementation((code?: number | string | null | undefined) => {
    throw new Error(`EXIT_${code}`);
  });

// Mock fs module
vi.mock('fs', () => ({
  existsSync: vi.fn(),
}));

// Mock core module
vi.mock('@md2wp/core', async () => {
  const actual = await vi.importActual('@md2wp/core');
  return {
    ...actual,
    loadConfig: vi.fn(),
  };
});

describe('configCommand', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment variables
    process.env = { ...originalEnv };
    delete process.env['MD2WP_PASSWORD'];
    delete process.env['MD2WP_SITE_URL'];
    delete process.env['MD2WP_USERNAME'];
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('successful config display', () => {
    it('should display basic config', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(core.loadConfig).mockResolvedValue({
        wordpress: {
          siteUrl: 'https://example.com',
          username: 'testuser',
        },
      });

      process.env['MD2WP_PASSWORD'] = 'test-password';

      await expect(configCommand()).rejects.toThrow('EXIT_0');
      expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('should display config with all optional fields', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(core.loadConfig).mockResolvedValue({
        wordpress: {
          siteUrl: 'https://example.com',
          username: 'testuser',
        },
        posts: {
          defaultStatus: 'draft',
          defaultAuthor: 1,
        },
        images: {
          basePath: './images',
          uploadPath: '/wp-content/uploads/md2wp/',
        },
      });

      process.env['MD2WP_PASSWORD'] = 'test-password';

      await expect(configCommand()).rejects.toThrow('EXIT_0');
      expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('should display config in verbose mode', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(core.loadConfig).mockResolvedValue({
        wordpress: {
          siteUrl: 'https://example.com',
          username: 'testuser',
        },
      });

      process.env['MD2WP_PASSWORD'] = 'test-password';

      await expect(configCommand({ verbose: true })).rejects.toThrow('EXIT_0');
      expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('should show environment variable overrides', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(core.loadConfig).mockResolvedValue({
        wordpress: {
          siteUrl: 'https://example-env.com',
          username: 'envuser',
        },
      });

      process.env['MD2WP_PASSWORD'] = 'test-password';
      process.env['MD2WP_SITE_URL'] = 'https://example-env.com';
      process.env['MD2WP_USERNAME'] = 'envuser';

      await expect(configCommand()).rejects.toThrow('EXIT_0');
      expect(mockExit).toHaveBeenCalledWith(0);
    });
  });

  describe('error cases', () => {
    it('should fail when no config file found', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      await expect(configCommand()).rejects.toThrow('EXIT_1');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should fail when config is invalid', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(core.loadConfig).mockRejectedValue(
        new Error('Config must include "wordpress.siteUrl"'),
      );

      await expect(configCommand()).rejects.toThrow('EXIT_1');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should fail when loadConfig throws', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(core.loadConfig).mockRejectedValue(
        new Error('Failed to parse config'),
      );

      await expect(configCommand()).rejects.toThrow('EXIT_1');
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('password status', () => {
    it('should show password as set when MD2WP_PASSWORD is set', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(core.loadConfig).mockResolvedValue({
        wordpress: {
          siteUrl: 'https://example.com',
          username: 'testuser',
        },
      });

      process.env['MD2WP_PASSWORD'] = 'my-secret-password';

      await expect(configCommand()).rejects.toThrow('EXIT_0');
      expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('should show password as not set when MD2WP_PASSWORD is missing', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(core.loadConfig).mockResolvedValue({
        wordpress: {
          siteUrl: 'https://example.com',
          username: 'testuser',
        },
      });

      delete process.env['MD2WP_PASSWORD'];

      await expect(configCommand()).rejects.toThrow('EXIT_0');
      expect(mockExit).toHaveBeenCalledWith(0);
    });
  });

  describe('config file discovery', () => {
    it('should find .md2wprc.json', async () => {
      const mockExists = vi.mocked(fs.existsSync);
      mockExists.mockImplementation((path: any) => {
        return String(path).endsWith('.md2wprc.json');
      });

      vi.mocked(core.loadConfig).mockResolvedValue({
        wordpress: {
          siteUrl: 'https://example.com',
          username: 'testuser',
        },
      });

      process.env['MD2WP_PASSWORD'] = 'test-password';

      await expect(configCommand()).rejects.toThrow('EXIT_0');
      expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('should find .md2wprc as fallback', async () => {
      const mockExists = vi.mocked(fs.existsSync);
      mockExists.mockImplementation((path: any) => {
        const pathStr = String(path);
        return pathStr.endsWith('.md2wprc') && !pathStr.endsWith('.json');
      });

      vi.mocked(core.loadConfig).mockResolvedValue({
        wordpress: {
          siteUrl: 'https://example.com',
          username: 'testuser',
        },
      });

      process.env['MD2WP_PASSWORD'] = 'test-password';

      await expect(configCommand()).rejects.toThrow('EXIT_0');
      expect(mockExit).toHaveBeenCalledWith(0);
    });
  });

  describe('post defaults', () => {
    it('should display post defaults when configured', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(core.loadConfig).mockResolvedValue({
        wordpress: {
          siteUrl: 'https://example.com',
          username: 'testuser',
        },
        posts: {
          defaultStatus: 'publish',
          defaultAuthor: 5,
        },
      });

      process.env['MD2WP_PASSWORD'] = 'test-password';

      await expect(configCommand()).rejects.toThrow('EXIT_0');
      expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('should handle partial post defaults', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(core.loadConfig).mockResolvedValue({
        wordpress: {
          siteUrl: 'https://example.com',
          username: 'testuser',
        },
        posts: {
          defaultStatus: 'draft',
        },
      });

      process.env['MD2WP_PASSWORD'] = 'test-password';

      await expect(configCommand()).rejects.toThrow('EXIT_0');
      expect(mockExit).toHaveBeenCalledWith(0);
    });
  });

  describe('image configuration', () => {
    it('should display image configuration when configured', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(core.loadConfig).mockResolvedValue({
        wordpress: {
          siteUrl: 'https://example.com',
          username: 'testuser',
        },
        images: {
          basePath: './my-images',
          uploadPath: '/custom/upload/path/',
        },
      });

      process.env['MD2WP_PASSWORD'] = 'test-password';

      await expect(configCommand()).rejects.toThrow('EXIT_0');
      expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('should handle partial image configuration', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(core.loadConfig).mockResolvedValue({
        wordpress: {
          siteUrl: 'https://example.com',
          username: 'testuser',
        },
        images: {
          basePath: './assets',
        },
      });

      process.env['MD2WP_PASSWORD'] = 'test-password';

      await expect(configCommand()).rejects.toThrow('EXIT_0');
      expect(mockExit).toHaveBeenCalledWith(0);
    });
  });
});
