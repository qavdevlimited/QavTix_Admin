export const COOKIE_KEYS = {
    USER_CURRENCY: "user_currency",
    USER_REGION: "region",
} as const;


const isProd = process.env.NODE_ENV === 'production'

export const accessCookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 10,
    ...(isProd && { domain: '.qavtix.com' }),
}

export const refreshCookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict' as const,
    path: '/api/auth',
    maxAge: 60 * 60 * 24 * 3,
    ...(isProd && { domain: '.qavtix.com' }),
}