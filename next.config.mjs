/** @type {import('next').NextConfig} */
const nextConfig = {
    poweredByHeader: false, // output: standalone dihapus, tidak perlu di Vercel

    async headers() {
        return [
            // 🔒 Security headers untuk SEMUA halaman
            {
                source: '/(.*)', // ← fix utama, cover semua route
                headers: [
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=31536000; includeSubDomains; preload',
                    },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-XSS-Protection', value: '1; mode=block' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), payment=()',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
                            "style-src 'self' 'unsafe-inline'",
                            "img-src 'self' data: blob: https:",
                            "font-src 'self'",
                            "connect-src 'self'",
                            "frame-ancestors 'none'",
                        ].join('; '),
                    },
                ],
            },

            // 📦 Cache untuk static assets
            {
                source: '/_next/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                    { key: 'X-Robots-Tag', value: 'noindex' },
                ],
            },
        ];
    },
};

export default nextConfig;