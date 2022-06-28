import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log({geo: request.geo, ip: request.ip, ua: request.ua});

  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/api/fees/eos', request.url));
  }
}