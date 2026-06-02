/** @type {import('next').NextConfig} */
const nextConfig = {
  // @react-pdf/renderer はサーバーサイドのみで使用するためWebpackバンドルから除外
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        path: false,
      }
    }
    return config
  },
}

export default nextConfig
