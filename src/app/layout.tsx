import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "实时天气 - 降水预报",
  description: "获取实时天气和降水预报，随时了解您所在位置的天气情况",
  keywords: "天气预报, 降水预报, 天气应用, 彩云天气",
  applicationName: "天气预报H5应用",
  authors: [{ name: "Next.js 天气应用" }],
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
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
