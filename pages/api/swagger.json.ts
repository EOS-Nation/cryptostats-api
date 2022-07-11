import { withSwagger } from 'next-swagger-doc';

const swaggerHandler = withSwagger({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pinax CryptoStats API',
      version: '0.1.0',
    },
  },
  schemaFolders: ['models'],
  apiFolder: 'pages/api',
});
export default swaggerHandler();