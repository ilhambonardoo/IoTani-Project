import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "urrwaycwwgdaihnpyocz.supabase.co",
      },
    ],
  },
  // Exclude ml-service directory and Python files from build
  webpack: (config, { isServer }) => {
    // Ignore Python files
    config.module.rules.push({
      test: /\.py$/,
      use: 'ignore-loader',
    });
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  // Only process TypeScript and JavaScript files
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  // Optimize build output
  output: 'standalone',
  // Exclude ml-service from build
  distDir: '.next',
};

export default nextConfig;
