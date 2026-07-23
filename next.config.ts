import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
    // Next 16 requires local image query strings to be explicitly allowlisted
    // (breaking change, prevents enumeration attacks). coverImage() appends
    // ?v=<COVER_VERSION> to /covers/*.png as a cache-buster.
    localPatterns: [
      {
        pathname: "/covers/**",
        search: "?v=2",
      },
    ],
  },
};

export default nextConfig;
