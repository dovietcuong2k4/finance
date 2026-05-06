import { NextResponse, type NextRequest } from 'next/server'
import { verifyToken } from '@/utils/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  let user = null

  if (token) {
    user = await verifyToken(token)
  }

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/signup') ||
                     request.nextUrl.pathname.startsWith('/auth')

  // 1. Nếu đã đăng nhập mà cố vào trang login/signup -> Chuyển về trang chủ
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 2. Nếu chưa đăng nhập mà vào bất kỳ trang nào khác (ngoại trừ login/signup) -> Chuyển về login
  if (!user && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
