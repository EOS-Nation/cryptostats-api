import { withSwagger } from 'next-swagger-doc';

const swaggerHandler = withSwagger({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NextJS Swagger',
    },
    tags: [
      {
        name: "Fees",
        description: "Total fees paid to a protocol on a given day.",
        externalDocs: { description: "Find out more", url: "https://cryptostats.community/discover/fees" },
        version: '0.1.0'
      },
      {
        name: "Issuance",
        description: "The amount of tokens issued in the past day, in USD.",
        externalDocs: { description: "Find out more", url: "https://cryptostats.community/discover/issuance" },
        version: '0.1.0'
      }
    ]
  },
  schemaFolders: ['models'],
  apiFolder: 'pages/api',
});
export default swaggerHandler();