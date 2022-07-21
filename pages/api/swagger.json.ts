import type { NextApiRequest, NextApiResponse } from 'next'
import { setCache } from "@utils/utils"
import { createSwaggerSpec } from 'next-swagger-doc';
import { title, description, version, homepage } from "@utils/constants";

export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  setCache(res);
  const spec = createSwaggerSpec({
    definition: {
      openapi: '3.0.0',
      info: {
        version: version,
        title: title,
        description: description,
        contact: { url: homepage },
        license: { name: "Apache 2.0", url: "http://www.apache.org/licenses/LICENSE-2.0.html" }
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
  return res.status(200).json(spec);
}