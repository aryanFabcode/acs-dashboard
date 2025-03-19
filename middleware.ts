// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/signin', '/signup'];
const PROTECTED_ROUTES = ['/', '/dashboard', '/clients', '/bookings'];

export function middleware(request: NextRequest) {
    const token = request.cookies.get('authToken')?.value;
    const isPublicRoute = PUBLIC_ROUTES.includes(request.nextUrl.pathname);
    const isProtectedRoute = PROTECTED_ROUTES.some(route =>
        request.nextUrl.pathname.startsWith(route)
    );

    // Redirect authenticated users from public routes
    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Redirect unauthenticated users from protected routes
    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    return NextResponse.next();
}