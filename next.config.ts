import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["ik.imagekit.io"],
  },

  // ✅ Ignore ESLint warnings and TypeScript build errors during deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
