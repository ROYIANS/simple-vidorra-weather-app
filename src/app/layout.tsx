import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// 设置整个应用的重新验证策略
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "实时天气 - 降水预报",
  description: "获取实时天气和降水预报，随时了解您所在位置的天气情况",
  keywords: "天气预报, 降水预报, 天气应用, 彩云天气",
  applicationName: "天气预报H5应用",
  authors: [{ name: "Next.js 天气应用" }],
  other: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#4A90E2"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 从环境变量中获取统计ID和统计脚本URL
  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID;
  const analyticsScriptUrl = process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL;

  return (
    <html lang="zh-CN">
      <head>
      {/* 只有在设置了环境变量时才添加统计脚本 */}
      {analyticsId && analyticsScriptUrl && (
        <script
          defer
          src={analyticsScriptUrl}
          data-website-id={analyticsId}
        />
      )}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}