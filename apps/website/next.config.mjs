import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ['@native-ui-org/primitives'],
  turbopack: {
    root: '.',
  },
};

export default withMDX(config);
