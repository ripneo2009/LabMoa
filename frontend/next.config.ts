import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Next.js from treating a lockfile in a parent directory as this app's root.
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
