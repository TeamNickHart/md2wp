#!/usr/bin/env node

/**
 * md2wp CLI entry point
 */

import { Command } from 'commander';
import { version } from './index.js';
import { initCommand } from './commands/init.js';
import { publishCommand } from './commands/publish.js';
import { validateCommand } from './commands/validate.js';
import { configCommand } from './commands/config.js';

const program = new Command();

program
  .name('md2wp')
  .description('Publish markdown files to WordPress')
  .version(version);

program
  .command('init')
  .description('Create .md2wprc.json and .env config files')
  .action(async () => {
    try {
      await initCommand();
    } catch (error) {
      console.error('Error:', (error as Error).message);
      process.exit(1);
    }
  });

program
  .command('publish <file>')
  .description('Publish a markdown file to WordPress')
  .option('--draft', 'Publish as draft')
  .option('--dry-run', 'Show what would happen without making API calls')
  .action(
    async (file: string, options: { draft?: boolean; dryRun?: boolean }) => {
      try {
        await publishCommand(file, options);
      } catch (error) {
        console.error('Error:', (error as Error).message);
        process.exit(1);
      }
    },
  );

program
  .command('validate <file>')
  .description('Validate markdown file before publishing')
  .option('--verbose', 'Show detailed validation output')
  .action(async (file: string, options: { verbose?: boolean }) => {
    try {
      await validateCommand(file, options);
    } catch (error) {
      console.error('Error:', (error as Error).message);
      process.exit(1);
    }
  });

program
  .command('config')
  .description('Show current config')
  .option('--verbose', 'Show full configuration JSON')
  .action(async (options: { verbose?: boolean }) => {
    try {
      await configCommand(options);
    } catch (error) {
      console.error('Error:', (error as Error).message);
      process.exit(1);
    }
  });

program.parse();
