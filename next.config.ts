import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    compress: true,

    experimental: {
        optimizePackageImports: ["@iconify/react", "framer-motion", "date-fns", "lucide-react"],
    },

    images: {
        formats: ["image/avif", "image/webp"],
        minimumCacheTTL: 60 * 60 * 24 * 7,
        remotePatterns: [
            { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
            { protocol: "https", hostname: "example.com", pathname: "/**" },
            { protocol: "https", hostname: "www.google.com", pathname: "/**" },
            { protocol: "https", hostname: "logo.clearbit.com", pathname: "/**" },
        ],
    },

    // Named cache-life profiles for use with 'use cache' / cacheLife()
    cacheLife: {
        max: {
            stale: 300,
            revalidate: 86400,
            expire: 86400,
        },
        settings: {
            stale: 60,
            revalidate: 3600,
            expire: 3600,
        },
        frequent: {
            stale: 30,
            revalidate: 300,
            expire: 600,
        },
    },
}

export default nextConfig;
