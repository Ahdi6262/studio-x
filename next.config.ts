import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // Or DENY if you don't want it iframed at all
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block', // Modern browsers might ignore this, CSP is preferred but more complex
          },
          // Optional: Permissions-Policy (replaces Feature-Policy)
          // Example: disable microphone and camera access by default
          // {
          //   key: 'Permissions-Policy',
          //   value: 'microphone=(), camera=()',
          // },
          // Optional: Referrer-Policy
          // {
          //   key: 'Referrer-Policy',
          //   value: 'strict-origin-when-cross-origin',
          // },
        ],
      },
    ];
  },
};

export default nextConfig;
