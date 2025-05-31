import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/login",
        destination: "https://back-end-milktea.onrender.com/Login",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      enable: true,
    },
  },
};

export default nextConfig;
