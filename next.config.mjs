/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/greek_word_explorer',
  assetPrefix: '/greek_word_explorer/',
  images: { unoptimized: true },
  trailingSlash: true,
  typescript: { ignoreBuildErrors: false },
  env: {
    NEXT_PUBLIC_BASE_PATH: '/greek_word_explorer',
  },
  webpack: (config) => {
    // sql.js tries to require 'fs' in some build paths; ensure no polyfill is attempted client-side
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      path: false,
    };
    return config;
  },
};

export default nextConfig;


