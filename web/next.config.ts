import type { NextConfig } from "next"
import { createMDX } from 'fumadocs-mdx/next';

const nextConfig: NextConfig = {
	cacheComponents: true,
	allowedDevOrigins: ["192.168.100.202"]
}

const withMDX = createMDX();
export default withMDX(nextConfig);