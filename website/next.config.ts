import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
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
  async redirects() {
    // Old static-site URLs that may be indexed or bookmarked.
    return [
      { source: "/src/index.html", destination: "/", permanent: true },
      { source: "/src/about.html", destination: "/about", permanent: true },
      { source: "/src/contact.html", destination: "/contact", permanent: true },
      { source: "/src/faq.html", destination: "/faq", permanent: true },
      { source: "/src/how-it-works.html", destination: "/how-it-works", permanent: true },
      { source: "/src/loan-calculator.html", destination: "/apply", permanent: true },
      { source: "/src/apply-for-loan.html", destination: "/apply", permanent: true },
      { source: "/src/apply-now.html", destination: "/apply", permanent: true },
      { source: "/src/news.html", destination: "/blog", permanent: true },
      { source: "/src/blog/:slug.html", destination: "/blog/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
