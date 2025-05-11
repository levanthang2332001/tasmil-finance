/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "ui.aceternity.com", "tokens.1inch.io", "api.dicebear.com"],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
