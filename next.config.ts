import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/paperclip-storefront",
  images: { unoptimized: true },
  outputFileTracingRoot: require("path").join(__dirname),
};

export default nextConfig;
