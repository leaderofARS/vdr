/**
 * @file proxy.js
 * @module /home/ars0x01/Documents/Github/solana-vdr/web/dashboard/src/proxy.js
 * @description Core component of the SipHeron VDR platform.
 * Part of the SipHeron VDR platform.
 * @author SipHeron Platform
 */

import { NextResponse } from 'next/server';

/**
 * Next.js proxy for HTTPS enforcement in production.
 * Redirects HTTP requests to HTTPS and adds security headers.
 */
export function proxy(request) {
    const response = NextResponse.next();

    // HTTPS redirect in production
    if (
        process.env.NODE_ENV === 'production' &&
        request.headers.get('x-forwarded-proto') === 'http'
    ) {
        const httpsUrl = new URL(request.url);
        httpsUrl.protocol = 'https:';
        return NextResponse.redirect(httpsUrl, 301);
    }

    // Security headers
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    
    // Allow embedding for verification pages to enable the Embedded Viewer feature
    if (request.nextUrl.pathname.startsWith('/verify')) {
        // We use Content-Security-Policy instead of X-Frame-Options for better control
        // For now, we just remove X-Frame-Options to allow embedding
        response.headers.delete('X-Frame-Options');
    } else {
        response.headers.set('X-Frame-Options', 'DENY');
    }

    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    return response;
}

export function middleware(request) {
    return proxy(request);
}

export const config = {
    matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
