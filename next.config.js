const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'pub-b61214a02a114edfae2b2923884088f7.r2.dev', // Saleor R2 存储
      'images.unsplash.com', // Unsplash 图片
    ],
  },
}

module.exports = withPWA(nextConfig) 