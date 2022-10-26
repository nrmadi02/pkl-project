// middleware.ts
// import { getCookie } from 'cookies-next'
// import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  const isDevelopment = process.env.NODE_ENV == "development"

  if (req.nextUrl.pathname.startsWith('/bimbingan')) {
    const session = req.cookies.get(isDevelopment ? 'next-auth.session-token' : '__Secure-next-auth.session-token')
    if (!session) {
      return NextResponse.redirect(new URL('/login?referer=bimbingan', req.url))
    }
    return NextResponse.next()
  }
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const session = req.cookies.get(isDevelopment ? 'next-auth.session-token' : '__Secure-next-auth.session-token')
    if (!session) {
      return NextResponse.redirect(new URL('/login?referer=admin', req.url))
    }
    return NextResponse.next()
  }
  if (req.nextUrl.pathname.startsWith('/pinjam')) {
    const session = req.cookies.get(isDevelopment ? 'next-auth.session-token' : '__Secure-next-auth.session-token')
    if (!session) {
      return NextResponse.redirect(new URL('/login?referer=pinjam', req.url))
    }
    return NextResponse.next()
  }
  if (req.nextUrl.pathname.startsWith('/login')) {
    const session = req.cookies.get(isDevelopment ? 'next-auth.session-token' : '__Secure-next-auth.session-token')
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