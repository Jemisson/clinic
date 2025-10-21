import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.clinicageisagarcia.com.br",
        port: "",
        pathname: "/rails/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/rails/**",
      },
    ],
  },
};

export default nextConfig;
