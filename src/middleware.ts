import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const PROTECTED_ROUTES = ['/dashboard', '/admin']
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/verify-email']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  // Only invoke Supabase for routes that need auth
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next()
  }

  // Bail if Supabase isn't configured yet
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (isProtectedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  const { user, supabase, supabaseResponse } = await updateSession(request)

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Role-based dashboard routing
  if (user && pathname === '/dashboard') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const url = request.nextUrl.clone()
    if (profile?.role === 'admin') {
      url.pathname = '/admin'
    } else if (profile?.role === 'employer') {
      url.pathname = '/dashboard/employer'
    } else {
      url.pathname = '/dashboard/candidate'
    }
    return NextResponse.redirect(url)
  }

  // Admin route protection
  if (user && pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // Prevent role crossover on dashboard routes
  if (user && (pathname.startsWith('/dashboard/candidate') || pathname.startsWith('/dashboard/employer'))) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'employer' && pathname.startsWith('/dashboard/candidate')) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard/employer'
      return NextResponse.redirect(url)
    }
    if (profile?.role === 'candidate' && pathname.startsWith('/dashboard/employer')) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard/candidate'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
