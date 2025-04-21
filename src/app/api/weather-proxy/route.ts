import { NextResponse } from 'next/server';

// 配置为动态路由，使其在静态导出模式下可用
export const dynamic = 'force-dynamic';

// 从环境变量获取API密钥
const API_KEY = process.env.NEXT_PUBLIC_CAIYUN_API_KEY || 'TAkhjf8d1nlSlspN';
const BASE_URL = 'https://api.caiyunapp.com/v2.6';

/**
 * 天气API代理处理函数
 */
export async function GET(request: Request) {
  try {
    // 获取URL和查询参数
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || searchParams.get('pathname') || '';
    const longitude = searchParams.get('longitude');
    const latitude = searchParams.get('latitude');
    
    // 检查必要参数
    if (!longitude || !latitude) {
      return NextResponse.json(
        { error: '缺少必要的参数 (longitude, latitude)' },
        { status: 400 }
      );
    }
    
    // 根据路径构建彩云天气API的URL
    let apiUrl = '';
    const coords = `${longitude},${latitude}`;
    
    if (request.url.includes('/realtime')) {
      apiUrl = `${BASE_URL}/${API_KEY}/${coords}/realtime`;
    } else if (request.url.includes('/minutely')) {
      apiUrl = `${BASE_URL}/${API_KEY}/${coords}/minutely`;
      
      // 添加可选参数
      if (searchParams.get('alert')) {
        apiUrl += `?alert=${searchParams.get('alert')}`;
      }
      if (searchParams.get('unit')) {
        apiUrl += apiUrl.includes('?') ? `&unit=${searchParams.get('unit')}` : `?unit=${searchParams.get('unit')}`;
      }
    } else if (request.url.includes('/hourly')) {
      apiUrl = `${BASE_URL}/${API_KEY}/${coords}/hourly`;
      
      // 添加可选参数
      if (searchParams.get('hourlysteps')) {
        apiUrl += `?hourlysteps=${searchParams.get('hourlysteps')}`;
      }
    } else {
      return NextResponse.json(
        { error: '无效的端点' },
        { status: 400 }
      );
    }
    
    console.log(`代理请求: ${apiUrl}`);
    
    // 发送请求到彩云天气API
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    // 获取API返回的数据
    const data = await response.json();
    
    // 返回代理结果
    return NextResponse.json(data);
  } catch (error) {
    console.error('天气API代理错误:', error);
    return NextResponse.json(
      { error: '处理请求时出错' },
      { status: 500 }
    );
  }
} 