/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['localhost', 'your-vercel-domain.vercel.app'],
    },
    // Add output: 'standalone' for better Vercel deployment
    output: 'standalone'
}

module.exports = nextConfig