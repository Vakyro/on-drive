import type { NextConfig } from "next";
const withPWA = require("next-pwa");

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Aquí no debes cambiar nada si estás usando `next/image`
  },
  typescript: {
    ignoreBuildErrors: true, // Para evitar que TypeScript bloquee la compilación
  },
  ...withPWA({
    pwa: {
      dest: "public",
      register: true,
      skipWaiting: true,
      disable: process.env.NODE_ENV === "development",
    },
  }),
};

export default nextConfig;
