import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Template image uploads (resized in the browser to well under this).
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
