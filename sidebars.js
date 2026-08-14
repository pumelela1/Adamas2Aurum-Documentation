// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  documentationSidebar: [
    'introduction',

    {
      type: 'category',
      label: 'Project Overview',
      items: [
        'project-overview/overview',
        'project-overview/goals',
        'project-overview/features',
        'project-overview/technology-stack',
      ],
    },

    {
      type: 'category',
      label: 'Project Management',
      items: [
        'project-management/overview',
        'project-management/project-plan',
        'project-management/product-backlog',
        'project-management/burndown',

        {
          type: 'category',
          label: 'Sprints',
          items: [],
        },

        {
          type: 'category',
          label: 'Meetings',
          items: [
            'project-management/meetings/overview',

            {
              type: 'category',
              label: 'August 2026',
              items: [],
            },

            {
              type: 'category',
              label: 'September 2026',
              items: [],
            },

            {
              type: 'category',
              label: 'October 2026',
              items: [],
            },
          ],
        },
      ],
    },

    {
      type: 'category',
      label: 'Requirements & Design',
      items: [
        'design/requirements',
        'design/user-stories',
        'design/design-documents',

        {
          type: 'category',
          label: 'Architecture',
          items: [
            'design/architecture/system-architecture',
            'design/architecture/component-diagram',
            'design/architecture/deployment-diagram',
            'design/architecture/database-design',
          ],
        },
      ],
    },

    {
      type: 'category',
      label: 'Implementation',
      items: [
        'implementation/overview',
        'implementation/frontend',
        'implementation/backend',
        'implementation/authentication',
        'implementation/database',
        'implementation/game-systems',
      ],
    },

    {
      type: 'category',
      label: 'Testing',
      items: [
        'testing/test-plan',
        'testing/test-cases',
        'testing/test-results',
      ],
    },

    {
      type: 'category',
      label: 'Deployment',
      items: [
        'deployment/overview',
        'deployment/deployment',
        'deployment/troubleshooting',
      ],
    },
  ],
};

export default sidebars;
