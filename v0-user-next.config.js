/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["example.com"], // Add any domains you need for image hosting
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig

