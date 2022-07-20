import type { NextApiRequest, NextApiResponse } from 'next'
import { get_blockNum, get_rexpool, get_rexpool_delta, get_genesis_date, get_rex_date, is_rexpool } from "@utils/getters"
import { Asset } from "@greymass/eosio"
import { setCache } from "@utils/utils"

/**
 * @openapi
 * /api/{chain}/fees:
 *   get:
 *     tags:
 *       - Fees
 *     description: Returns one day total fees for the EOS Network using daily average of REX revenue earned.
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
 *                 start_block_num:
 *                   type: integer
 *                   description: start block number
 *                   example: 254236584
 *                 end_block_num:
 *                   type: integer
 *                   description: end block number
 *                   example: 254409384
 *                 fees:
 *                   type: string
 *                   description: fees paid in EOS
 *                   example: "365.4881 EOS"
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
    if ( !date.match(/\d{4}-\d{2}-\d{2}/) ) throw '[date] is invalid (ex: 2022-06-28)'
    if ( new Date(`${date}T00:00:00Z`) > new Date() ) throw '[date] must be in the past';

    // get data
    const end_block_num = await get_blockNum(`${date}T00:00:00Z`, chain);
    const start_block_num = end_block_num - 86400 * 2;
    if ( start_block_num < 3 ) throw '[date] first genesis indexed blocks start at ' + get_genesis_date(chain);
    if ( !(await is_rexpool( start_block_num, chain ))) throw '[date] REX fees only start at ' + get_rex_date(chain);

    const start = await get_rexpool( start_block_num, chain );
    const end = await get_rexpool( end_block_num, chain);
    const delta = get_rexpool_delta(start, end);
    const fees = Asset.fromFloat(delta, Asset.Symbol.from("4,EOS"));

    // response
    return res.status(200).json({ start_block_num, end_block_num, fees })

    // error handling
  } catch (err: any) {
    const error = err.message || err;
    return res.status(400).json({ error })
  }
}
