import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "urrwaycwwgdaihnpyocz.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    unoptimized: false,
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.py$/,
      use: "ignore-loader",
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
  pageExtensions: ["ts", "tsx", "js", "jsx"],
  output: "standalone",
  distDir: ".next",
};

export default nextConfig;
