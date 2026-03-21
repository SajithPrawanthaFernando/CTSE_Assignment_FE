import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/**",
      },
      // Allow all https image domains (for product images from any source)
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "/**",
      },
      // Allow http too (for local/dev image URLs)
      {
        protocol: "http",
        hostname: "**",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination:
            "https://quickbite-api-gateway.wonderfulcoast-2cb5966f.eastasia.azurecontainerapps.io/:path*",
        },
      ],
    };
  },
};

export default nextConfig;
