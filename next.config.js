const UnoCSS = require('@unocss/webpack').default

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.cache = false
    config.plugins.push(UnoCSS())
    return config
  },
  images: {
    // Use direct image URLs instead of `/_next/image` proxying.
    // This avoids server-side fetch timeouts for Firebase Storage URLs.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
