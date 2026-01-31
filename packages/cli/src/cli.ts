#!/usr/bin/env node

/**
 * md2wp CLI entry point
 */

import { Command } from 'commander';
import { version } from './index.js';
import { initCommand } from './commands/init.js';
import { publishCommand } from './commands/publish.js';

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
  .description('Validate frontmatter and config')
  .action((file: string) => {
    console.log('TODO: Implement validate command', { file });
  });

program
  .command('config')
  .description('Show current config')
  .action(() => {
    console.log('TODO: Implement config command');
  });

program.parse();
