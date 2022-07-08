import type { NextApiRequest, NextApiResponse } from 'next'
import { core } from "@utils/config"

export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  console.time("get_info");
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59');
  const info = await core["eos"].v1.chain.get_info();
  res.status(200).json(info.toJSON())
  console.timeEnd("get_info");
}
