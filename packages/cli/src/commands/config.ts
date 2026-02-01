/**
 * Config command - Show current configuration
 */

import { existsSync } from 'fs';
import { resolve } from 'path';
import { loadConfig } from '@md2wp/core';

interface ConfigOptions {
  verbose?: boolean;
}

const CONFIG_FILE_NAMES = ['.md2wprc.json', '.md2wprc'];

/**
 * Show current configuration
 */
export async function configCommand(
  options: ConfigOptions = {},
): Promise<void> {
  let success = false;

  try {
    console.log('📋 Current Configuration\n');

    // Find config file
    const configPath = findConfigFile();

    if (!configPath) {
      console.error('❌ No configuration file found\n');
      console.error(
        'Expected one of: .md2wprc.json, .md2wprc in current directory',
      );
      console.error('\nRun "md2wp init" to create a configuration file.');
      process.exit(1);
    }

    console.log(`📁 Config file: ${configPath}\n`);

    // Load and validate config
    const config = await loadConfig(configPath);

    // Show WordPress configuration
    console.log('🌐 WordPress Configuration:');
    showWordPressConfig(config.wordpress);

    // Show environment variable overrides
    showEnvOverrides();

    // Show password status
    console.log('\n🔐 Authentication:');
    showPasswordStatus();

    // Show post defaults
    if (config.posts) {
      console.log('\n📝 Post Defaults:');
      if (config.posts.defaultStatus) {
        console.log(`   Status: ${config.posts.defaultStatus}`);
      }
      if (config.posts.defaultAuthor) {
        console.log(`   Author ID: ${config.posts.defaultAuthor}`);
      }
    }

    // Show image configuration
    if (config.images) {
      console.log('\n🖼️  Image Configuration:');
      if (config.images.basePath) {
        console.log(`   Base path: ${config.images.basePath}`);
      }
      if (config.images.uploadPath) {
        console.log(`   Upload path: ${config.images.uploadPath}`);
      }
    }

    // Show full config in verbose mode
    if (options.verbose) {
      console.log('\n📄 Full Configuration (JSON):');
      console.log('─'.repeat(60));
      console.log(JSON.stringify(config, null, 2));
      console.log('─'.repeat(60));
    }

    console.log('\n✅ Configuration is valid\n');

    success = true;
  } catch (error) {
    console.error('\n❌ Configuration Error\n');

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('Unknown error occurred');
    }

    console.error('');
  }

  process.exit(success ? 0 : 1);
}

/**
 * Find config file in current directory
 */
function findConfigFile(): string | null {
  for (const fileName of CONFIG_FILE_NAMES) {
    const filePath = resolve(process.cwd(), fileName);
    if (existsSync(filePath)) {
      return filePath;
    }
  }
  return null;
}

/**
 * Show WordPress configuration with env override indicators
 */
function showWordPressConfig(wordpress: {
  siteUrl: string;
  username: string;
}): void {
  const siteUrlFromEnv = process.env['MD2WP_SITE_URL'];
  const usernameFromEnv = process.env['MD2WP_USERNAME'];

  console.log(
    `   Site URL: ${wordpress.siteUrl}${siteUrlFromEnv ? ' (from env)' : ''}`,
  );
  console.log(
    `   Username: ${wordpress.username}${usernameFromEnv ? ' (from env)' : ''}`,
  );
}

/**
 * Show environment variable overrides
 */
function showEnvOverrides(): void {
  const hasOverrides =
    process.env['MD2WP_SITE_URL'] || process.env['MD2WP_USERNAME'];

  if (hasOverrides) {
    console.log('\n🔄 Environment Variable Overrides:');
    if (process.env['MD2WP_SITE_URL']) {
      console.log(`   MD2WP_SITE_URL: ${process.env['MD2WP_SITE_URL']}`);
    }
    if (process.env['MD2WP_USERNAME']) {
      console.log(`   MD2WP_USERNAME: ${process.env['MD2WP_USERNAME']}`);
    }
  }
}

/**
 * Show password status without revealing the actual password
 */
function showPasswordStatus(): void {
  const password = process.env['MD2WP_PASSWORD'];

  if (password) {
    // Mask the password (show first 4 chars as asterisks)
    const masked = '****' + ' '.repeat(Math.max(0, password.length - 4));
    console.log(`   Password: ${masked} ✓ Set`);
    console.log('   Source: MD2WP_PASSWORD environment variable');
  } else {
    console.log('   Password: ❌ Not set');
    console.log(
      '   Please set MD2WP_PASSWORD environment variable or add to .env file',
    );
  }
}
