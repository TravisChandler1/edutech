/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,
  
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // For Google profile pictures
      },
      // Add other domains as needed
    ],
  },
  
  // Environment variables that should be available on the client side
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    // Add other public environment variables here
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    
    // Handle handlebars template files
    config.module.rules.push({
      test: /\.hbs$/,
      use: 'raw-loader',
    });
    
    return config;
  },
  
  // Enable experimental features
  experimental: {
    // Server Actions are enabled by default in Next.js 14+
    webpackBuildWorker: true, // Enable webpack build worker
    serverComponentsExternalPackages: ['nodemailer', 'handlebars'],
  },
  
  // Configure page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // Configure headers
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;