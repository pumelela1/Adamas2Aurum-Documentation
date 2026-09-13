// @ts-check

/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
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
        'project-management/meetings',
        'project-management/user-stories',
        'project-management/product-backlog',
      ],
    },

    {
      type: 'category',
      label: 'Sprints',
      items: [
        'sprints/sprints',
        {
          type: 'category',
          label: 'Minutes',
          items: [
            'sprints/sprint-1-meeting-1',
            'sprints/sprint-1-meeting-2',
            'sprints/sprint-1-meeting-3',
            'sprints/sprint-1-meeting-4',
            'sprints/sprint-1-meeting-5',
            'sprints/sprint-1-meeting-6',
            'sprints/sprint-1-meeting-7',
            'sprints/sprint-1-meeting-8',
            'sprints/sprint-1-meeting-9',
            'sprints/sprint-2-meeting-16',
          ],
	},
      ],
    },

    {
      type: 'category',
      label: 'Requirements & Design',
      items: [
        'design/design-documents',
        'design/requirements',
        {
          type: 'category',
          label: 'Architecture',
          items: [
            'design/architecture/system-architecture',
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
        'implementation/api-reference',
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
      ],
    },

    {
      type: 'category',
      label: 'Deployment',
      items: [
        'deployment/overview',
        'deployment/deployment',
        'deployment/configuration',
        'deployment/troubleshooting',
      ],
    },
  ],
};

export default sidebars;
