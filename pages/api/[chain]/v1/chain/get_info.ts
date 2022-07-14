import type { NextApiRequest, NextApiResponse } from 'next'
import { core } from "@utils/config"

export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  const headers = {
    'Cache-Control': 's-maxage=1, stale-while-revalidate=59',
    'Access-Control-Allow-Origin': '*'
  };
  const info = await core["eos"].v1.chain.get_info();
  res.status(200).json(info.toJSON())
}

// export const config = {
//   runtime: 'experimental-edge',
// };