import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-6e4c4b7de2a64b20a6f4ed43bc11a71e.r2.dev",
      },
    ],
  },
};

export default nextConfig;
