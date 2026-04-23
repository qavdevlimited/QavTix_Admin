import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_SETTINGS_SUB_LINKS, AUTH_LINKS, DASHBOARD_NAVIGATION_LINKS } from './enums/navigation'
import { COOKIE_KEYS, accessCookieOptions } from './components-data/cookie-keys'
import { DEFAULT_LOCATION, REGION_CURRENCY_MAP } from './components-data/settings-data-options'
import { REFRESH_TOKEN_ENDPOINT, TOKEN_VERIFY_ENDPOINT } from './endpoints'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL


const SIGNIN_PATH = AUTH_LINKS.SIGN_IN.href;

const PUBLIC_PATHS = [
    SIGNIN_PATH,
    AUTH_LINKS.FORGOT_PASSWORD.href,
    AUTH_LINKS.RESET_PASSWORD.href,
]

const SKIP_PATHS = ['/api', '/_next', '/favicon.ico']

const isSkippedPath = (p: string) => SKIP_PATHS.some(s => p.startsWith(s))
const isPublicPath = (p: string) => PUBLIC_PATHS.some(s => p.startsWith(s))

function redirectToSignin(request: NextRequest) {
    const signinUrl = new URL(SIGNIN_PATH, request.url)
    signinUrl.searchParams.set('returnTo', request.nextUrl.pathname)
    const res = NextResponse.redirect(signinUrl)
    res.cookies.delete('admin_access_token')
    res.cookies.delete('admin_refresh_token')
    return res
}

async function verifyToken(token: string): Promise<"valid" | "invalid" | "network_error"> {
    try {
        const res = await fetch(`${API_BASE_URL}/${TOKEN_VERIFY_ENDPOINT}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        })
        return res.ok ? "valid" : "invalid"
    } catch {
        return "network_error"
    }
}

async function refreshAccessToken(
    refreshToken: string,
): Promise<{ success: true; accessToken: string } | { success: false; networkError: boolean }> {
    try {
        const res = await fetch(`${API_BASE_URL}/${REFRESH_TOKEN_ENDPOINT}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
        })
        if (res.ok) {
            const { data } = await res.json()
            return { success: true, accessToken: data.access }
        }
        return { success: false, networkError: false }
    } catch {
        return { success: false, networkError: true }
    }
}


export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Always skip static/api paths
    if (isSkippedPath(pathname)) return NextResponse.next()


    // Redirect root to dashboard
    if (pathname === '/') {
        return NextResponse.redirect(new URL(DASHBOARD_NAVIGATION_LINKS.DASHBOARD.href, request.url))
    }

    // Redirect /settings to /settings/general
    if (
        pathname === DASHBOARD_NAVIGATION_LINKS.SYSTEM_CONFIGURATION.href ||
        pathname === `${DASHBOARD_NAVIGATION_LINKS.SYSTEM_CONFIGURATION.href}/`
    ) {
        const generalSettings =
            ADMIN_SETTINGS_SUB_LINKS.find(v => v.href.includes('general'))?.href ??
            '/dashboard/settings/general'
        return NextResponse.redirect(new URL(generalSettings, request.url))
    }


    if (!isPublicPath(pathname)) {
        const accessToken = request.cookies.get('admin_access_token')?.value
        const refreshToken = request.cookies.get('admin_refresh_token')?.value

        // No tokens at all — send to signin
        if (!accessToken && !refreshToken) {
            return redirectToSignin(request)
        }

        if (accessToken) {
            const status = await verifyToken(accessToken)

            if (status === 'valid') { /* fall through to response */ }
            else if (status === 'network_error') { /* let it through — don't log out on network blip */ }
            else {
                // Access token invalid — try refresh
                if (refreshToken) {
                    const result = await refreshAccessToken(refreshToken)

                    if (result.success) {
                        const response = NextResponse.next()
                        response.cookies.set('admin_access_token', result.accessToken, accessCookieOptions)
                        return withLocationCookies(request, response)
                    }

                    if (result.networkError) { /* let through on network error */ }
                    else return redirectToSignin(request)  // refresh token expired
                } else {
                    return redirectToSignin(request)
                }
            }
        } else if (refreshToken) {
            // No access token but have refresh — attempt refresh immediately
            const result = await refreshAccessToken(refreshToken)

            if (result.success) {
                const response = NextResponse.next()
                response.cookies.set('admin_access_token', result.accessToken, accessCookieOptions)
                return withLocationCookies(request, response)
            }

            if (!result.networkError) return redirectToSignin(request)
        }
    }


    return withLocationCookies(request, NextResponse.next())
}


const withLocationCookies = (request: NextRequest, response: NextResponse): NextResponse => {
    const hasRegion = request.cookies.has(COOKIE_KEYS.USER_REGION)
    const hasCurrency = request.cookies.has(COOKIE_KEYS.USER_CURRENCY)

    if (!hasRegion || !hasCurrency) {
        const country = request.headers.get('x-vercel-ip-country') ??
            request.headers.get('cf-ipcountry') ?? 'NG'
        const detected = REGION_CURRENCY_MAP[country] ?? DEFAULT_LOCATION

        const cookieOptions = {
            path: '/',
            maxAge: 365 * 24 * 60 * 60,
            sameSite: 'lax' as const,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        }

        if (!hasRegion) response.cookies.set(COOKIE_KEYS.USER_REGION, JSON.stringify(detected.region), cookieOptions)
        if (!hasCurrency) response.cookies.set(COOKIE_KEYS.USER_CURRENCY, JSON.stringify(detected.currency), cookieOptions)
    }

    return response
}


export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}