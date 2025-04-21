/** @type {import('next').NextConfig} */
const nextConfig = {
  // 使用标准SSR模式
  // output: 'export', // 移除静态导出配置
  // distDir: 'dist',  // 使用默认的.next目录
  eslint: {
    // 忽略ESLint错误，允许构建继续
    ignoreDuringBuilds: true
  }
};

export default nextConfig; 