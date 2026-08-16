// @ts-check

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Adamas2Aurum',
  tagline: 'Project Documentation',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  // GitHub Pages
  url: 'https://pumelela1.github.io',
  baseUrl: '/Adamas2Aurum-Documentation/',

  // GitHub repository
  organizationName: 'pumelela1',
  projectName: 'Adamas2Aurum-Documentation',
  deploymentBranch: 'gh-pages',

  trailingSlash: false,

  // Fail the build if we accidentally create broken links.
  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',

          // Allows GitHub's "Edit this page" link to point
          // directly to the documentation source files.
          editUrl:
            'https://github.com/pumelela1/Adamas2Aurum-Documentation/tree/main/',
        },

        // We are using Docusaurus as documentation, not as a blog.
        blog: false,

        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',

      colorMode: {
        respectPrefersColorScheme: true,
      },

      navbar: {
        title: 'Adamas2Aurum',
        logo: {
          alt: 'Adamas2Aurum Logo',
          src: 'img/logo.svg',
        },

        items: [
          {
            type: 'docSidebar',
            sidebarId: 'documentationSidebar',
            position: 'left',
            label: 'Documentation',
          },

          {
            href: 'https://github.com/pumelela1/Adamas2Aurum-Documentation',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },

      footer: {
        style: 'dark',

        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'Project Overview',
                to: '/docs/project-overview/overview',
              },
              {
                label: 'Project Management',
                to: '/docs/project-management/overview',
              },
              {
                label: 'Requirements & Design',
                to: '/docs/design/requirements',
              },
            ],
          },

          {
            title: 'Project',
            items: [
              {
                label: 'Implementation',
                to: '/docs/implementation/overview',
              },
              {
                label: 'Testing',
                to: '/docs/testing/test-plan',
              },
              {
                label: 'Deployment',
                to: '/docs/deployment/overview',
              },
            ],
          },

          {
            title: 'Repository',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/pumelela1/Adamas2Aurum-Documentation',
              },
            ],
          },
        ],

        copyright:
          `Adamas2Aurum Project Documentation © ${new Date().getFullYear()}`,
      },

      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
