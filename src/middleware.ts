// middleware.ts
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/bimbingan')) {
    const session = await getToken({ req, secret: 'super-secret' })
    if (!session) {
      return NextResponse.redirect(new URL('/login?referer=bimbingan', req.url))
    }
    return NextResponse.next()
  }
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const session = await getToken({ req, secret: 'super-secret' })
    if (!session) {
      return NextResponse.redirect(new URL('/login?referer=admin', req.url))
    }
    return NextResponse.next()
  }
  if (req.nextUrl.pathname.startsWith('/pinjam')) {
    const session = await getToken({ req, secret: 'super-secret' })
    if (!session) {
      return NextResponse.redirect(new URL('/login?referer=pinjam', req.url))
    }
    return NextResponse.next()
  }
  if (req.nextUrl.pathname.startsWith('/login')) {
    const session = await getToken({ req, secret: 'super-secret' })
    if (session) {
      return NextResponse.redirect(new URL('/', req.url))
    }
    return NextResponse.next()
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/login', '/bimbingan/:path*', '/pinjam/:path*', '/admin/:path*'],
}