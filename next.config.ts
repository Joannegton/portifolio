import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["media.licdn.com"],
  },
  serverExternalPackages: ["typeorm", "pg"],
};

export default nextConfig;
