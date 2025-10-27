import { createMDX } from 'fumadocs-mdx/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@native-ui-org/primitives",
    "react-native",
    "react-native-web"
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "react-native$": "react-native-web",
    };
    config.resolve.extensions = [
      ".web.tsx",
      ".web.ts",
      ".web.jsx",
      ".web.js",
      ...config.resolve.extensions,
    ];
    return config;
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
