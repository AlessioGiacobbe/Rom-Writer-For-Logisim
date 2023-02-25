import nextTranslate from "next-translate-plugin"

/** @type {import('next').NextConfig} */
export default nextTranslate({
  reactStrictMode: true,
  experimental: {
    fontLoaders: [
      {
        loader: "@next/font/google",
        options: { subsets: ["latin"] },
      },
    ],
  },
})
