import type { NextApiRequest, NextApiResponse } from 'next'
import { get_blockNum, get_inflation, get_supply, get_genesis_date } from "@utils/getters"
import { setCache } from "@utils/utils"

/**
 * @openapi
 * /api/{chain}/issuance:
 *   get:
 *     tags:
 *       - Issuance
 *     description: The amount of tokens issued in the past day.
 *     parameters:
 *     - name: chain
 *       in: path
 *       required: true
 *       description: "EOSIO chain selection"
 *       schema:
 *         type: string
 *         enum: [ eos ]
 *         default: eos
 *     - in: query
 *       name: date
 *       description: "Historical Date (format: YYYY-MM-DD)"
 *       example: 2022-06-28
 *       required: true
 *       schema:
 *         type: string
 *         pattern: '^\d{4}-\d{2}-\d{2}$'
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
  setCache(res);

  // params
  let { chain, date } = req.query;
  chain = String(chain);
  date = String(date);

  try {
    // validation
    if ( !chain ) throw '[chain] query is required';
    if ( !date ) throw '[date] query is required';
    if ( !date.match(/\d{4}-\d{2}-\d{2}/) ) throw '[date] is invalid (ex: 2022-06-28)';
    if ( new Date(`${date}T00:00:00Z`) > new Date() ) throw '[date] must be in the past';

    // get data
    const block_num = await get_blockNum(`${date}T00:00:00Z`, chain);
    if ( block_num < 3 ) throw '[date] first genesis indexed blocks start at ' + get_genesis_date(chain);
    const { supply } = await get_supply("eosio.token", "EOS", block_num, chain);
    const { continuous_rate } = await get_inflation(block_num, chain);

    // respones
    return res.status(200).json({ block_num, supply, continuous_rate })

    // error handling
  } catch (err: any) {
    const error = err.message || err;
    return res.status(400).json({ error })
  }
}
