import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_SETTINGS_SUB_LINKS, DASHBOARD_NAVIGATION_LINKS } from './enums/navigation'
import { COOKIE_KEYS } from './components-data/cookie-keys'
import { DEFAULT_LOCATION, REGION_CURRENCY_MAP } from './components-data/settings-data-options'

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // --- PROXY & REDIRECT LOGIC ---
    
    // Redirect root to dashboard
    if (pathname === '/') {
        return NextResponse.redirect(new URL(DASHBOARD_NAVIGATION_LINKS.DASHBOARD.href, request.url))
    }

    // Redirect /settings to /settings/general
    if (pathname === DASHBOARD_NAVIGATION_LINKS.SYSTEM_CONFIGURATION.href || pathname === `${DASHBOARD_NAVIGATION_LINKS.SYSTEM_CONFIGURATION.href}/`) {
        const generalSettings = ADMIN_SETTINGS_SUB_LINKS.find(v => v.href.includes("general"))?.href 
            || "/dashboard/settings/general"
        return NextResponse.redirect(new URL(generalSettings, request.url))
    }


    // --- LOCATION & COOKIE LOGIC ---

    const response = NextResponse.next()

    const hasRegion = request.cookies.has(COOKIE_KEYS.USER_REGION)
    const hasCurrency = request.cookies.has(COOKIE_KEYS.USER_CURRENCY)

    if (!hasRegion || !hasCurrency) {
        // Detect country from Vercel or Cloudflare headers
        const country = request.headers.get('x-vercel-ip-country') || 
                        request.headers.get('cf-ipcountry') || 
                        'NG'

        const detected = REGION_CURRENCY_MAP[country] || DEFAULT_LOCATION

        const cookieOptions = {
            path: '/',
            maxAge: 365 * 24 * 60 * 60, // 1 year
            sameSite: 'lax' as const,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        }

        if (!hasRegion) {
            response.cookies.set(COOKIE_KEYS.USER_REGION, JSON.stringify(detected.region), cookieOptions)
        }
        if (!hasCurrency) {
            response.cookies.set(COOKIE_KEYS.USER_CURRENCY, JSON.stringify(detected.currency), cookieOptions)
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - api routes
         * - static files (_next/static, _next/image)
         * - common assets (favicon, svg, png, etc.)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}