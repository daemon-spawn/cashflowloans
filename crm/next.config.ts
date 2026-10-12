import type { NextConfig } from "next";

// The CRM is fully behind authentication, so nothing is prerendered and
// Cache Components stays off. The public website (../website) enables it.
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        // Tailwind processes global stylesheets only; CSS Modules keep their scoping.
        condition: { not: { path: /\.module\.css$/ } },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
