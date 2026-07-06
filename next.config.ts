import type { NextConfig } from "next";

// Sur GitHub Pages, le site vit sous /Marque-s — le workflow CI définit NEXT_PUBLIC_BASE_PATH.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
