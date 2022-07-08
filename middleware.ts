import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log({geo: request.geo, ip: request.ip});
  if ( request.geo?.country == "CA") return NextResponse.json({country: "Canada 🇨🇦"});

  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/docs', request.url));
  }
}