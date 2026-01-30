/**
 * Init command - Create configuration files
 */

import { writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { generateDefaultConfig, generateEnvTemplate } from '@md2wp/core';

export async function initCommand(): Promise<void> {
  const configPath = resolve(process.cwd(), '.md2wprc.json');
  const envPath = resolve(process.cwd(), '.env');

  console.log('🚀 Initializing md2wp...\n');

  // Create .md2wprc.json
  if (existsSync(configPath)) {
    console.log('⚠️  .md2wprc.json already exists, skipping...');
  } else {
    const config = generateDefaultConfig();
    await writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
    console.log('✅ Created .md2wprc.json');
  }

  // Create .env
  if (existsSync(envPath)) {
    console.log('⚠️  .env already exists, skipping...');
  } else {
    const envContent = generateEnvTemplate();
    await writeFile(envPath, envContent, 'utf-8');
    console.log('✅ Created .env');
  }

  console.log('\n📝 Next steps:');
  console.log('1. Edit .md2wprc.json with your WordPress site URL and username');
  console.log('2. Create an Application Password in WordPress:');
  console.log('   - Go to your WordPress admin → Users → Profile');
  console.log('   - Scroll to "Application Passwords"');
  console.log('   - Enter "md2wp" as the name');
  console.log('   - Click "Add New Application Password"');
  console.log('   - Copy the generated password');
  console.log('3. Edit .env and paste the password into MD2WP_PASSWORD');
  console.log('4. Run: md2wp publish your-post.md');
  console.log('\n💡 Tip: Add .env to your .gitignore to keep your password safe!');
}
