import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Forsiden er landingssiden (public/index.html). Appen ligger på /k, /admin og /superadmin.
  async rewrites() {
    return { beforeFiles: [{ source: "/", destination: "/index.html" }] };
  },
};

export default nextConfig;
