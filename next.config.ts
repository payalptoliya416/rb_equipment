/** @type {import('next').NextConfig} */


const isStaging = process.env.NEXT_PUBLIC_BASE_PATH === "staging";


const nextConfig = {
  output: "export",
  async rewrites() {
    return [
      {
        source: "/inventory/:category",
        destination: "/inventory",
      },
      {
        source: "/inventory/:path*",
        destination: "/inventory?category=:path*",
      },
      {
        source: "/inventory/:category/:make/:model/:auction_id",
        destination: "/inventory",
      },
      {
        source: "/checkout/:category/:make/:model/:auction_id",
        destination: "/checkout",
      },
      {
        source: "/confirmation/:category/:make/:model/:auction_id",
        destination: "/confirmation",
      },
      {
        source: "/sale-agreement/:category/:make/:model/:auction_id",
        destination: "/sale-agreement",
      },
    ];
  },

  trailingSlash: true,
  images: {
    unoptimized: true,
  },

    basePath: isStaging ? "/staging" : "",

  assetPrefix: isStaging ? "/staging/" : "",
};

export default nextConfig;
