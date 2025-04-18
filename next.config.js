/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['scanpro.cc'],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;