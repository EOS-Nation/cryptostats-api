// import type { NextApiRequest, NextApiResponse } from 'next'
import type { NextRequest } from 'next/server'
import { core } from "@utils/config"

/**
 * @openapi
 * /api/eos/v1/chain/get_info:
 *   get:
 *     tags:
 *       - Get Info
 *     description: Get chain info.
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export default async function handler(req: NextRequest) {
  const headers = {
    'Cache-Control': 's-maxage=1, stale-while-revalidate=59',
    'Access-Control-Allow-Origin': '*'
  };
  const info = await core["eos"].v1.chain.get_info();
  return new Response(JSON.stringify(info.toJSON()), {headers});
}

export const config = {
  runtime: 'experimental-edge',
};