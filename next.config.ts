import type { NextConfig } from "next";

// cacheComponents désactivé volontairement : avec <Activity>, les pages quittées
// restent montées (cachées). Ici, chaque page porte un canvas WebGL ou des pins
// GSAP : on préfère qu'elles se démontent proprement à chaque navigation.
const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
    qualities: [75],
    remotePatterns: [new URL("https://alcompanyevents.fr/wp-content/uploads/**")],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
