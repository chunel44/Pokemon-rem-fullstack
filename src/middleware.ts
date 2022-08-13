
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET


export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });

  if (!token) return NextResponse.redirect(new URL('/auth/login', req.url))

  // If user is authenticated, continue.
  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
}