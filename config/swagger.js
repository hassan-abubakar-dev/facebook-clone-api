import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Facebook clone API',
      version: '3.0.0',
      description: 'API documentation for facebook clone App',
    },
    servers: [
      {
        url: 'http://localhost:3000', 
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
    {
      bearerAuth: [],
    },
  ],
  },
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJsDoc(options);

export { swaggerUi, swaggerSpec };
