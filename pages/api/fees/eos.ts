import NextCors from "nextjs-cors"
import type { NextApiRequest, NextApiResponse } from 'next'
import { CryptoStatsSDK } from "@cryptostats/sdk"
import { get_blockNum, get_rexpool_delta } from "@utils/getters"
import { Asset } from "@greymass/eosio"
import { errorWrapper } from '@utils/error-wrapper'

const sdk = new CryptoStatsSDK();

/**
 * @swagger
 * /api/fees/eos:
 *   get:
 *     description: Returns one day total fees for the EOS Network using daily average of REX revenue earned.
 *     parameters:
 *     - in: query
 *       name: date
 *       description: Historical date query
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
 *                 price:
 *                   type: number
 *                   description: CoinGekco historical EOS price
 *                   example: 0.9871577911162366
 *                 oneDayTotalFees:
 *                   type: number
 *                   description: CryptoStats one day total fees (in USD)
 *                   example: 360.7944203816406
 *
 */
export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59');
  await NextCors(req, res);
  return errorWrapper( endpoint, req, res, __filename );
}

async function endpoint( req: NextApiRequest, res: NextApiResponse<any> ) {
  const date = String(req.query.date);
  if ( !date ) throw '[date] query is required';
  if ( !date.match(/\d{4}-\d{2}-\d{2}/) ) throw '[date] is invalid (ex: 2022-06-28)'
  const end_block_num = await get_blockNum(`${date}T00:00:00Z`);
  const start_block_num = end_block_num - 86400 * 2;
  const delta = await get_rexpool_delta( start_block_num, end_block_num );
  const price = await sdk.coinGecko.getHistoricalPrice("eos", date);
  const fees = Asset.fromFloat(delta, Asset.Symbol.from("4,EOS"));
  const oneDayTotalFees = price * delta;

  res.status(200).json({ start_block_num, end_block_num, fees, price, oneDayTotalFees });
}
