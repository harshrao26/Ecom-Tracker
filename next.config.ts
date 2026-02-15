import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Limit pages kept in memory
  onDemandEntries: {
    maxInactiveAge: 25 * 1000, // 25 seconds
    pagesBufferLength: 2, // Only 2 pages in memory
  },

  // Reduce image optimization cache
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Disable source maps in production
  productionBrowserSourceMaps: false,
};

export default nextConfig;
