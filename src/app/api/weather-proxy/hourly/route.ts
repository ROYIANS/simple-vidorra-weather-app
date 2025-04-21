import { NextResponse } from 'next/server';

// 配置为动态路由，使其在静态导出模式下可用
export const dynamic = 'force-dynamic';

// 从环境变量获取API密钥
const API_KEY = process.env.NEXT_PUBLIC_CAIYUN_API_KEY || 'TAkhjf8d1nlSlspN';
const BASE_URL = 'https://api.caiyunapp.com/v2.6';

/**
 * 小时级天气预报API代理处理函数
 */
export async function GET(request: Request) {
  try {
    // 获取URL和查询参数
    const { searchParams } = new URL(request.url);
    const longitude = searchParams.get('longitude');
    const latitude = searchParams.get('latitude');
    const hourlysteps = searchParams.get('hourlysteps') || '24';
    
    // 检查必要参数
    if (!longitude || !latitude) {
      return NextResponse.json(
        { error: '缺少必要的参数 (longitude, latitude)' },
        { status: 400 }
      );
    }
    
    // 构建彩云天气API的URL
    const coords = `${longitude},${latitude}`;
    const apiUrl = `${BASE_URL}/${API_KEY}/${coords}/hourly?hourlysteps=${hourlysteps}`;
    
    console.log(`代理请求 (小时级预报): ${apiUrl}`);
    
    // 发送请求到彩云天气API
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    // 检查响应状态
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`彩云天气API请求失败 (${response.status}): ${errorText}`);
    }
    
    // 获取API返回的数据
    const data = await response.json();
    
    // 返回代理结果
    return NextResponse.json(data);
  } catch (error) {
    console.error('小时级预报API代理错误:', error);
    return NextResponse.json(
      { error: '获取小时级预报数据时出错', message: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
} 