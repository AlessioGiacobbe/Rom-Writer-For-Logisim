/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  assetPrefix: './',
  experimental: {
    fontLoaders: [
      {
        loader: "@next/font/google",
        options: { subsets: ["latin"] },
      },
    ],
  },
}
