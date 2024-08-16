/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH,
  reactStrictMode: false, // changed this to false
  images: {
    domains: [
      'images.unsplash.com',
      'i.ibb.co',
      'scontent.fotp8-1.fna.fbcdn.net',
    ],
    // Make ENV
    unoptimized: true,
  },
  env: {
    APP_VERSION: process.env.npm_package_version,
    API_DOMAIN:  process.env.REACT_APP_API_DOMAIN,
    SSO_URL:     process.env.SSO_URL,
  },
  output: 'standalone'
};

module.exports = nextConfig;
