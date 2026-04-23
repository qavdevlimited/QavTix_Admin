import type { Metadata, Viewport } from "next"

const SITE_NAME    = "QavTix Admin"
const SITE_URL     = process.env.NEXT_PUBLIC_APP_DOMAIN ?? "https://admin.qavtix.com"
const SITE_TAGLINE = "Platform Management Console"
const DESCRIPTION  = "QavTix Admin Dashboard — Manage events, users, hosts, financials, and platform configuration."
const OG_IMAGE     = `${SITE_URL}/images/og-admin.png`

// Base metadata applied to every admin page
export const siteMetadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default:  `${SITE_NAME} — ${SITE_TAGLINE}`,
        template: `%s | ${SITE_NAME}`,
    },

    description: DESCRIPTION,
    authors:     [{ name: "QavTix" }],
    creator:     "QavTix",
    publisher:   "QavTix",

    // Admin panel should never be indexed
    robots: {
        index:  false,
        follow: false,
        googleBot: {
            index:  false,
            follow: false,
        },
    },

    openGraph: {
        type:        "website",
        locale:      "en_NG",
        url:         SITE_URL,
        siteName:    SITE_NAME,
        title:       `${SITE_NAME} — ${SITE_TAGLINE}`,
        description: DESCRIPTION,
        images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${SITE_NAME}` }],
    },

    twitter: {
        card:        "summary",
        site:        "@qavtix",
        creator:     "@qavtix",
        title:       `${SITE_NAME} — ${SITE_TAGLINE}`,
        description: DESCRIPTION,
        images:      [OG_IMAGE],
    },

    manifest: "/site.webmanifest",

    alternates: {
        canonical: SITE_URL,
    },
}

export const siteViewport: Viewport = {
    themeColor:   "#0052CC",
    width:        "device-width",
    initialScale: 1,
    maximumScale: 5,
}

/** Per-page metadata helper — use in each dashboard page's generateMetadata */
export function buildPageMetadata(
    title:        string,
    description?: string,
    path?:        string,
): Metadata {
    const url  = path ? `${SITE_URL}${path}` : SITE_URL
    const desc = description ?? DESCRIPTION

    return {
        title,
        description: desc,
        alternates:  { canonical: url },
        openGraph: {
            title,
            description: desc,
            url,
            images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: title }],
        },
        twitter: {
            title,
            description: desc,
            images: [OG_IMAGE],
        },
    }
}
