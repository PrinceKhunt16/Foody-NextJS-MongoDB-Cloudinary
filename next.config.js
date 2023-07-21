/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    API_BASE_URL: process.env.API_BASE_URL,
    APP_BASE_URL: process.env.APP_BASE_URL,
    TOKEN_NAME: process.env.TOKEN_NAME,
    OBJECTID_SLACE_REPLACE: process.env.OBJECTID_SLACE_REPLACE,
    CRYPTO_SECRET: process.env.CRYPTO_SECRET,
    SMPT_SERVICE: process.env.SMPT_SERVICE,
    SMPT_MAIL: process.env.SMPT_MAIL,
    SMPT_PASS: process.env.SMPT_PASS,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  },
}

module.exports = nextConfig
