/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH,
  
  // Ignorar errores de ESLint durante la compilación en Docker
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Ignorar errores de TypeScript durante la compilación en Docker
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    domains: [
      'images.unsplash.com',
      'i.ibb.co',
      'scontent.fotp8-1.fna.fbcdn.net',
    ],
    unoptimized: true,
  },
};

module.exports = nextConfig;