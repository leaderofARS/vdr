/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',        // Required for Docker deployment
  poweredByHeader: false,      // Don't expose Next.js version
  compress: true,              // Enable gzip compression
};

export default nextConfig;

