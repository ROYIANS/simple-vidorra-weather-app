import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 这个中间件会在每个请求时执行
export function middleware(request: NextRequest) {
  // 克隆响应以添加头信息
  const response = NextResponse.next();

  // 添加缓存控制头，确保内容不被缓存
  response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
}

// 配置要应用中间件的路径
export const config = {
  matcher: [
    /*
     * 匹配所有路径除了：
     * 1. /api/weather-proxy 开头的请求 (这些可能需要单独处理)
     * 2. 公共资源文件 (如 图片、字体等)
     */
    '/((?!api/weather-proxy|_next/static|_next/image|favicon.ico).*)',
  ],
}; 