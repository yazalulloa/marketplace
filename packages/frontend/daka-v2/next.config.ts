import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  /* config options here */

};

export default nextConfig;

module.exports = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Works in DEV but not in production
  // images: {
  //   remotePatterns: [new URL('https://tiendasdaka.com/**')],
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}