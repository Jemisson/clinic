import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_PATHS = [
  '/login',
  '/signup',
  '/forgot-password',
  '/_next',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/assets',
  '/public',
]

const PUBLIC_FILE = /\.(.*)$/

function isPublic(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return true
  if (PUBLIC_FILE.test(pathname)) return true
  return false
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  if (isPublic(req)) return NextResponse.next()

  const token = req.cookies.get('clinic_token')?.value

  if (!token) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('from', pathname + search)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api/public).*)'],
}
