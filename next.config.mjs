/** @type {import('next').NextConfig} */
const backendUrl = (process.env.BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');

const nextConfig = {
  outputFileTracingRoot: import.meta.dirname,
  async rewrites() {
    // Dev/local: browser calls /api/* → proxied to Express backend
    return [
      { source: '/api/:path*', destination: `${backendUrl}/api/:path*` },
    ];
  },
};

export default nextConfig;
