/**
 * Configuration loader with environment variable support
 */

import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { config as loadDotenv } from 'dotenv';
import type { Md2wpConfig, WPConfig } from '../types.js';

const CONFIG_FILE_NAMES = ['.md2wprc.json', '.md2wprc'];

// Load .env file if it exists
loadDotenvFile();

/**
 * Load configuration from file and environment
 */
export async function loadConfig(
  configPath?: string,
): Promise<Md2wpConfig> {
  let config: Md2wpConfig;

  if (configPath) {
    // Load from specified path
    config = await loadConfigFile(configPath);
  } else {
    // Search for config file in current directory
    config = await findAndLoadConfig();
  }

  // Apply environment variable overrides
  config = applyEnvOverrides(config);

  // Validate config
  validateConfig(config);

  return config;
}

/**
 * Load configuration from a specific file
 */
async function loadConfigFile(filePath: string): Promise<Md2wpConfig> {
  const absolutePath = resolve(filePath);

  if (!existsSync(absolutePath)) {
    throw new Error(`Config file not found: ${absolutePath}`);
  }

  const content = await readFile(absolutePath, 'utf-8');
  const config = JSON.parse(content) as Md2wpConfig;

  return config;
}

/**
 * Search for config file in current directory
 */
async function findAndLoadConfig(): Promise<Md2wpConfig> {
  for (const fileName of CONFIG_FILE_NAMES) {
    const filePath = resolve(process.cwd(), fileName);

    if (existsSync(filePath)) {
      return loadConfigFile(filePath);
    }
  }

  throw new Error(
    `Config file not found. Create ${CONFIG_FILE_NAMES[0]} in the current directory or specify path with --config flag.`,
  );
}

/**
 * Apply environment variable overrides
 */
function applyEnvOverrides(config: Md2wpConfig): Md2wpConfig {
  const overrides = { ...config };

  // Override WordPress config from env
  if (process.env['MD2WP_SITE_URL']) {
    overrides.wordpress.siteUrl = process.env['MD2WP_SITE_URL'];
  }

  if (process.env['MD2WP_USERNAME']) {
    overrides.wordpress.username = process.env['MD2WP_USERNAME'];
  }

  return overrides;
}

/**
 * Validate configuration
 */
export function validateConfig(config: Md2wpConfig): void {
  if (!config.wordpress) {
    throw new Error('Config must include "wordpress" section');
  }

  if (!config.wordpress.siteUrl) {
    throw new Error('Config must include "wordpress.siteUrl"');
  }

  if (!config.wordpress.username) {
    throw new Error('Config must include "wordpress.username"');
  }

  // Validate post defaults if provided
  if (config.posts?.defaultStatus) {
    if (!['draft', 'publish'].includes(config.posts.defaultStatus)) {
      throw new Error(
        'Config "posts.defaultStatus" must be "draft" or "publish"',
      );
    }
  }
}

/**
 * Create WPConfig from Md2wpConfig
 */
export function createWPConfig(config: Md2wpConfig): WPConfig {
  // Get password from environment
  const password = process.env['MD2WP_PASSWORD'];

  if (!password) {
    throw new Error(
      'MD2WP_PASSWORD environment variable is required. Set it to your WordPress Application Password.',
    );
  }

  return {
    siteUrl: config.wordpress.siteUrl,
    username: config.wordpress.username,
    password,
  };
}

/**
 * Generate default config template
 */
export function generateDefaultConfig(): Md2wpConfig {
  return {
    wordpress: {
      siteUrl: 'https://yoursite.com',
      username: 'your-username',
    },
    posts: {
      defaultStatus: 'draft',
      defaultAuthor: 1,
    },
    images: {
      basePath: './images',
      uploadPath: '/wp-content/uploads/md2wp/',
    },
  };
}

/**
 * Load .env file from current directory
 */
function loadDotenvFile(): void {
  const envPath = resolve(process.cwd(), '.env');

  if (existsSync(envPath)) {
    loadDotenv({ path: envPath });
  }
}

/**
 * Generate .env template content
 */
export function generateEnvTemplate(): string {
  return `# WordPress Application Password
# Create one at: https://yoursite.com/wp-admin/profile.php
# Look for "Application Passwords" section
MD2WP_PASSWORD=xxxx xxxx xxxx xxxx

# Optional: Override config file settings
# MD2WP_SITE_URL=https://yoursite.com
# MD2WP_USERNAME=your-username
`;
}
