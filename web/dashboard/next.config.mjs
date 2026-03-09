/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',        // Required for Docker deployment
  poweredByHeader: false,      // Don't expose Next.js version
  compress: true,              // Enable gzip compression
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

