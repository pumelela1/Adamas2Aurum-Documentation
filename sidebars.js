// @ts-check

/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  documentationSidebar: [
    'introduction',
    'ai-declaration',

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
        'project-management/roadmap',
        'project-management/methodology',
        'project-management/work-tracker',
        'project-management/git-methodology',
        'project-management/meetings',
        'project-management/user-stories',
        'project-management/product-backlog',
        'project-management/project-plan',
        'project-management/burndown',
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
			'sprints/sprint-1-meeting-10',
			'sprints/sprint-1-meeting-11',
			'sprints/sprint-1-meeting-12',
			'sprints/sprint-2-meeting-13',
			'sprints/sprint-2-meeting-14',
			'sprints/sprint-2-meeting-15',
            'sprints/sprint-2-meeting-16',
            'sprints/sprint-2-meeting-17',
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
        'implementation/map-system',
        'implementation/backend',
        'implementation/curation',
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
        'deployment/ci',
        'deployment/troubleshooting',
      ],
    },
  ],
};

export default sidebars;
