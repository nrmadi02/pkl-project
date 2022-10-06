// middleware.ts
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: 'super-secret' })
  console.log(session)
  if (!session) {
    if (req.nextUrl.pathname.startsWith('/bimbingan')) {

      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (req.nextUrl.pathname.startsWith('/pinjam')) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/bimbingan/:path*', '/pinjam/:path*'],
}