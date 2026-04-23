import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: '/**'
            },
            {
                protocol: "https",
                hostname: "example.com",
                pathname: '/**'
            },
            {
                protocol: "https",
                hostname: "www.google.com",
                pathname: '/**'
            },
            {
                protocol: "https",
                hostname: "logo.clearbit.com",
                pathname: '/**'
            },
        ],
    },
    // Define named cache-life profiles for use with 'use cache' / cacheLife()
    cacheLife: {
        // "max" profile: long-lived cache, revalidate every 24h, never expires
        max: {
            stale: 300,          // 5 min client-side stale
            revalidate: 86400,   // 24 h server-side revalidation window
            expire: 86400,       // max 24 h before forced expire
        },
        // "settings" profile: moderate — settings can change but rarely
        settings: {
            stale: 60,           // 1 min client-side stale
            revalidate: 3600,    // 1 h server revalidation
            expire: 3600,
        },
        // "frequent" profile: data that changes more often (cards, lists)
        frequent: {
            stale: 30,           // 30 s client-side stale
            revalidate: 300,     // 5 min server revalidation
            expire: 600,
        },
    },
}

export default nextConfig;
