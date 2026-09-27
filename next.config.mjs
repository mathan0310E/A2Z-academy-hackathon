/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "assets.acme.com"],
    unoptimized: false,
  },
  // firebase-admin must not be bundled by the server-component compiler.
  experimental: {
    serverComponentsExternalPackages: ["firebase-admin"],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-Type, authorization, X-A2Z-HMAC, X-Requested-With",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
