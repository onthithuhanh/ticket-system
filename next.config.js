/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Thêm cấu hình để bỏ qua các thuộc tính không khớp trong quá trình hydration
  experimental: {
    // Bỏ qua các thuộc tính không khớp trong quá trình hydration
    skipTrailingSlashRedirect: true,
    skipMiddlewareUrlNormalize: true,
  },
  // Cấu hình để xử lý các thuộc tính không khớp
  compiler: {
    // Bỏ qua các thuộc tính không khớp trong quá trình hydration
    styledComponents: true,
  },
}

module.exports = nextConfig 