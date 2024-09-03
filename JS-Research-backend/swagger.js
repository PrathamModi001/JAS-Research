import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
const options = {
    definition: {
        openapi: '3.0.0', // Use OpenAPI 3.0.0 specification
        info: {
            title: 'Research_Paper', // Replace with your actual API title
            version: '1.0.0', // Update as needed
            description: 'Research_Paper', // Provide a clear description
        },
    },
    apis: ['./routers/*.js'],
    servers: [{ url: 'http://localhost:8000' }], // Specify the server URL
};

// Generate Swagger specification dynamically
const specs = swaggerJsdoc(options);

export default (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs)); // Serve Swagger UI at '/api-docs'
};
