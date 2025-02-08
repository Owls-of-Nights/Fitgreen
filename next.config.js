/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['fit-green.vercel.app'],
    },
    output: 'standalone'
}

module.exports = nextConfig