import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'md2wp',
  description: 'Publish markdown to WordPress with Gutenberg blocks',

  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
    ],
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Reference', link: '/reference/cli-commands' },
      { text: 'Roadmap', link: '/roadmap' },
      {
        text: 'v0.1.0',
        items: [
          { text: 'Changelog', link: '/changelog' },
          { text: 'Contributing', link: '/contributing' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is md2wp?', link: '/guide/what-is-md2wp' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' },
          ],
        },
        {
          text: 'Setup',
          items: [
            { text: 'Authentication', link: '/guide/authentication' },
            { text: 'Configuration', link: '/guide/configuration' },
          ],
        },
        {
          text: 'Usage',
          items: [
            { text: 'Publishing Posts', link: '/guide/publishing' },
            { text: 'Working with Images', link: '/guide/images' },
            { text: 'Frontmatter Options', link: '/guide/frontmatter' },
            { text: 'Dry Run Mode', link: '/guide/dry-run' },
          ],
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Gutenberg Blocks', link: '/guide/gutenberg' },
            { text: 'Image Caching', link: '/guide/caching' },
            { text: 'Troubleshooting', link: '/guide/troubleshooting' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'CLI Commands', link: '/reference/cli-commands' },
            { text: 'Configuration', link: '/reference/configuration' },
            { text: 'Frontmatter', link: '/reference/frontmatter' },
            { text: 'API', link: '/reference/api' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/TeamNickHart/md2wp' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Nicholas Hart',
    },

    search: {
      provider: 'local',
    },

    editLink: {
      pattern: 'https://github.com/TeamNickHart/md2wp/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
  },
});
