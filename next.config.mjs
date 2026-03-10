/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    poweredByHeader: false,
    async headers() {
        return [
            {
                source: '/_next/:path*',
                headers: [
                    { key: 'X-Robots-Tag', value: 'noindex' }, // Sembunyikan dari search engine
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-XSS-Protection', value: '1; mode=block' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                ],
            },
        ]
    },
};

export default nextConfig;
