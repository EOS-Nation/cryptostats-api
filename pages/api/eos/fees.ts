import type { NextRequest } from 'next/server';
import { get_blockNum, get_rexpool, get_rexpool_delta } from "@utils/getters"
import { Asset } from "@greymass/eosio"

/**
 * @swagger
 * /api/eos/fees:
 *   get:
 *     tags:
 *       - Fees
 *     description: Returns one day total fees for the EOS Network using daily average of REX revenue earned.
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
 *
 */
export default async (req: NextRequest ) => {
  const headers = {
    'Cache-Control': 's-maxage=1, stale-while-revalidate=59',
    'Access-Control-Allow-Origin': '*'
  };
  // params
  const chain = "eos";
  const { searchParams } = new URL(req.url || "", "https://crypostats.pinax.network")
  const date = searchParams.get('date')

  try {
    // validation
    if ( !date ) throw '[date] query is required';
    if ( !date.match(/\d{4}-\d{2}-\d{2}/) ) throw '[date] is invalid (ex: 2022-06-28)'

    // get data
    const end_block_num = await get_blockNum(`${date}T00:00:00Z`, chain);
    const start_block_num = end_block_num - 86400 * 2;
    const start = await get_rexpool( start_block_num, chain );
    const end = await get_rexpool( end_block_num, chain);
    const delta = get_rexpool_delta(start, end);
    const fees = Asset.fromFloat(delta, Asset.Symbol.from("4,EOS"));

    // respones
    return new Response(JSON.stringify({ start_block_num, end_block_num, fees }), {headers});

    // error handling
  } catch (err: any) {
    const error = err.message || err;
    return new Response(JSON.stringify({ error }), { headers, status: 400 });
  }
}

export const config = {
  runtime: 'experimental-edge',
};