// import type { NextRequest } from 'next/server';
import type { NextApiRequest, NextApiResponse } from 'next'
import { get_blockNum, get_inflation, get_supply } from "@utils/getters"

/**
 * @openapi
 * /api/eos/issuance:
 *   get:
 *     tags:
 *       - Issuance
 *     description: The amount of tokens issued in the past day.
 *     parameters:
 *     - in: query
 *       name: date
 *       description: Historical Date
 *       example: 2022-06-28
 *       schema:
 *         type: string
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 block_num:
 *                   type: integer
 *                   description: block number
 *                   example: 254236584
 *                 supply:
 *                   type: string
 *                   description: circulating supply in EOS
 *                   example: "1058472770.9490 EOS"
 *                 continuous_rate:
 *                   type: number
 *                   description: yearly continuous rate of inflation
 *                   example: 0.0295588022415444
 */
export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  const headers = {
    'Cache-Control': 's-maxage=1, stale-while-revalidate=59',
    'Access-Control-Allow-Origin': '*'
  };
  // params
  const chain = "eos";
  const { searchParams } = new URL(req.url || "", "https://crypostats.pinax.network")
  const date = searchParams.get('date')
0
  try {
    // validation
    if ( !date ) throw '[date] query is required';
    if ( !date.match(/\d{4}-\d{2}-\d{2}/) ) throw '[date] is invalid (ex: 2022-06-28)'

    // get data
    const block_num = await get_blockNum(`${date}T00:00:00Z`, chain);
    const { continuous_rate } = await get_inflation(block_num, chain);
    const { supply } = await get_supply("eosio.token", "EOS", block_num, chain);

    // respones
    return res.status(200).json({ block_num, supply, continuous_rate })
    // return new Response(JSON.stringify({ block_num, supply, continuous_rate }), {headers});

    // error handling
  } catch (err: any) {
    const error = err.message || err;
    return res.status(400).json({ error })
    // return new Response(JSON.stringify({ error }), { headers, status: 400 });
  }
}

// export const config = {
//   runtime: 'experimental-edge',
// };