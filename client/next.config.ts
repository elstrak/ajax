import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/analyze",
        destination: "http://localhost:8000/api/analyze",
      },
      {
        source: "/api/analysis/:scanId",
        destination: "http://localhost:8000/api/analysis/:scanId",
      },
    ];
  },
};

export default nextConfig;
