export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'PathMuslim v1.0 API',
    version: '0.1.0',
    description: 'API documentation for PathMuslim - Islamic Learning Guide for New Muslims',
    contact: {
      name: 'PathMuslim Team',
      url: 'https://pathmuslim.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3002',
      description: 'Development server',
    },
    {
      url: 'https://pathmuslim.com',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token from /api/auth/signin endpoint',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          name: { type: 'string' },
          created_at: { type: 'string' },
        },
      },
      Module: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          duration_minutes: { type: 'number' },
          prerequisites: { type: 'array', items: { type: 'string' } },
          learning_objectives: { type: 'array', items: { type: 'string' } },
          created_at: { type: 'string' },
        },
      },
      QAAnswer: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          question: { type: 'string' },
          answer: { type: 'string' },
          category: { type: 'string' },
          helpful_count: { type: 'number' },
          sources: { type: 'array', items: { type: 'object' } },
        },
      },
      Milestone: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          icon: { type: 'string' },
          required_modules: { type: 'number' },
          earned: { type: 'boolean' },
        },
      },
      Source: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string', enum: ['quran', 'hadith', 'scholar', 'text'] },
          title: { type: 'string' },
          content: { type: 'string' },
          reference: { type: 'string' },
        },
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { type: 'object' },
          error: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    '/api/health': {
      get: {
        summary: 'Health check endpoint',
        description: 'Returns the health status of the API server',
        tags: ['Health'],
        responses: {
          '200': {
            description: 'Server is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    timestamp: { type: 'string' },
                    version: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/learning/modules': {
      get: {
        summary: 'List all learning modules',
        tags: ['Learning'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          '200': {
            description: 'List of modules retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Module' } },
                  },
                },
              },
            },
          },
          '401': { description: 'Authentication required' },
        },
      },
    },
    '/api/qa/search': {
      get: {
        summary: 'Search Q&A knowledge base',
        tags: ['Q&A'],
        parameters: [
          { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Search query' },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'sort', in: 'query', schema: { type: 'string', default: 'relevance' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        ],
        responses: {
          '200': { description: 'Search results' },
          '400': { description: 'Invalid query parameters' },
        },
      },
    },
    '/api/qa/answers/{id}': {
      get: {
        summary: 'Get a specific Q&A answer',
        tags: ['Q&A'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Answer retrieved successfully' },
          '404': { description: 'Answer not found' },
        },
      },
    },
    '/api/learning/milestones': {
      get: {
        summary: 'Get user milestones',
        tags: ['Learning'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Milestones data retrieved successfully' },
          '401': { description: 'Authentication required' },
        },
      },
    },
    '/api/sources/quran': {
      get: {
        summary: 'Get Quranic sources',
        tags: ['Sources'],
        parameters: [
          { name: 'surah', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 114 } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          '200': { description: 'Quranic sources retrieved successfully' },
          '400': { description: 'Invalid query parameters' },
        },
      },
    },
  },
};
