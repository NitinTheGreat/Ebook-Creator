import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["puppeteer-core"],
  turbopack: {},
};

export default nextConfig;
