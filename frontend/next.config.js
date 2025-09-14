/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    USERS_API: process.env.NEXT_PUBLIC_USERS_API,
    PRODUCTS_API: process.env.NEXT_PUBLIC_PRODUCTS_API,
    ORDERS_API: process.env.NEXT_PUBLIC_ORDERS_API,
  },
};

module.exports = nextConfig;
