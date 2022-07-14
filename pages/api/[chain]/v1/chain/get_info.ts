// import NextCors from "nextjs-cors"
import { NextRequest, NextResponse } from 'next/server';
import { core } from "@utils/config"

export default async (req: NextRequest) => {
  const headers = {
    'Cache-Control': 's-maxage=1, stale-while-revalidate=59',
    'Access-Control-Allow-Origin': '*'
  };
  const info = await core["eos"].v1.chain.get_info();
  return NextResponse.json(info, {headers});
}

// export const config = {
//   runtime: 'experimental-edge',
// };