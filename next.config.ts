import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // https://nextjs.org/docs/messages/next-image-unconfigured-host#possible-ways-to-fix-it
    images: {
        remotePatterns: [
            new URL('http://172.31.34.168:4000/static/videos/**'),
            new URL('http://localhost:4000/static/videos/**'),
            new URL('http://192.168.0.65:4000/static/videos/**')
        ],
    }
};

export default nextConfig;
