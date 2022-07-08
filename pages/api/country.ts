import { NextRequest, NextResponse } from 'next/server';

export default async (req: NextRequest ) => {
  const headers = {'Cache-Control': 's-maxage=1, stale-while-revalidate=59'};
  return NextResponse.json(req.geo, {headers});
}

export const config = {
  runtime: 'experimental-edge',
};