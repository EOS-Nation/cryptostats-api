import type { NextApiRequest, NextApiResponse } from 'next'
import { get_blockNum, get_genesis_date, get_core_asset, get_balance, get_balance_block_num, get_supply, get_staked } from "@utils/getters"
import { Asset } from "@greymass/eosio"
import { setCache } from "@utils/utils"

/**
 * @openapi
 * /api/{chain}/supply:
 *   get:
 *     tags:
 *       - Supply
 *     description: Returns one the amount of coins that are circulating in the market and are in public hands.
 *     parameters:
 *     - name: chain
 *       in: path
 *       required: true
 *       description: "Antelope chain selection"
 *       schema:
 *         type: string
 *         enum: [ eos ]
 *         default: eos
 *     - in: query
 *       name: date
 *       description: "Historical Date (format: YYYY-MM-DD)"
 *       required: false
 *       schema:
 *         type: string
 *         pattern: '^\d{4}-\d{2}-\d{2}$'
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: float
 *               description: circulating supply
 *               example: 1076221657.4181
 */
export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  setCache(res);

  // params
  let { chain, date } = req.query;
  chain = String(chain ?? "");
  date = String(date ?? "");

  try {
    // validation
    if ( !chain ) throw '[chain] query is required';
    if ( date ) {
      if ( !date.match(/\d{4}-\d{2}-\d{2}/) ) throw '[date] is invalid (ex: 2022-06-28)'
      if ( new Date(`${date}T00:00:00Z`) > new Date() ) throw '[date] must be in the past';
    }

    // get block from date
    const block_num = await get_blockNum(date ? `${date}T00:00:00Z` : new Date(), chain);

    if ( block_num < get_balance_block_num( chain ) ) {
      return res.status(200).json(0);
    }

    // catch errors
    if ( block_num < 3 ) throw '[date] first genesis indexed blocks start at ' + get_genesis_date(chain);

    // get data
    const b1 = (await get_balance("b1", "eosio.token", "EOS", block_num, chain)).units.value;
    const stake = (await get_staked("b1", block_num, chain)).units.value;
    const supply = Asset.from((await get_supply("eosio.token", "EOS", block_num, chain)).supply).units.value;
    const total = get_core_asset(chain, supply - b1 - stake).value.valueOf();
 
    // response
    return res.status(200).json(total);

    // error handling
  } catch (err: any) {
    const error = err.message || err;
    return res.status(400).json({ error })
  }
}
