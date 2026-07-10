import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "perfectpearlsandpigments.co.uk",
      },
      {
        protocol: "https",
        hostname: "**.perfectpearlsandpigments.co.uk",
      },
    ],
  },
};

export default nextConfig;
