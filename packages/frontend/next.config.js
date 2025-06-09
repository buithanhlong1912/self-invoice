/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is enabled by default in Next.js 13+
  output: process.env.NODE_ENV === "production" ? "export" : undefined,
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "production"
            ? `${process.env.NEXT_PUBLIC_API_URL}/:path*`
            : "http://localhost:5002/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
