import NextCors from "nextjs-cors"
import type { NextApiRequest, NextApiResponse } from 'next'
import { CryptoStatsSDK } from "@cryptostats/sdk"
import { get_blockNum, get_rexpool_delta } from "@utils/getters"
import { Asset } from "@greymass/eosio"
import { errorWrapper } from '@utils/error-wrapper'

const sdk = new CryptoStatsSDK();

export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59');
  // await NextCors(req, res);
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

  res.status(200).json({ date, start_block_num, end_block_num, fees, price, oneDayTotalFees });
}
