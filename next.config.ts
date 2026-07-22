import type { NextConfig } from "next";

const ApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

const nextConfig: NextConfig = {
    // https://nextjs.org/docs/messages/next-image-unconfigured-host#possible-ways-to-fix-it
    images: {
        remotePatterns: [
            new URL(`${ApiUrl}/static/**`)
        ],
    },
    output: 'standalone',
};

export default nextConfig;
