/** @type {import('next').NextConfig} */
const nextConfig = {
  // 使用标准SSR模式
  // output: 'export', // 移除静态导出配置
  // distDir: 'dist',  // 使用默认的.next目录
  eslint: {
    // 忽略ESLint错误，允许构建继续
    ignoreDuringBuilds: true
  },
  // 添加缓存控制配置
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0, must-revalidate'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          },
          {
            key: 'Expires',
            value: '0'
          }
        ]
      }
    ];
  },
  // 确保所有页面都是动态的，不会被静态生成
  onDemandEntries: {
    // 服务器只保存页面的时间（毫秒）
    maxInactiveAge: 10 * 1000,
    // 同时保存在内存中的页面数
    pagesBufferLength: 1,
  }
};

export default nextConfig; 