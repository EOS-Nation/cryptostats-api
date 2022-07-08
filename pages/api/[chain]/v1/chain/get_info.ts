import { NextRequest, NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from 'next'
import { core } from "@utils/config"

export default async (req: NextRequest, res: NextApiResponse<any> ) => {
// export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  console.time("get_info");
  const headers = {'Cache-Control': 's-maxage=1, stale-while-revalidate=59'};
  // const { chain } = req.query;
  const chain = "eos";
  if ( chain != "eos" ) throw "[chain] must be 'eos'";
  // res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59');
  const info = await core[chain].v1.chain.get_info();
  console.timeEnd("get_info");
  return NextResponse.json(info, {headers});
  // res.status(200).json(info.toJSON())
}




// export default (req: NextRequest) => {
//   return NextResponse.json({
//     name: `Hello, from ${req.url} I'm now an Edge Function!`,
//   });
// };

export const config = {
  runtime: 'experimental-edge',
};