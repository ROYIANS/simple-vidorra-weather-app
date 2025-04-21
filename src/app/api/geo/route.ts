import { NextResponse } from 'next/server';
import iconv from 'iconv-lite';

// 配置为动态路由，使其在静态导出模式下可用
export const dynamic = 'force-dynamic';

/**
 * 获取根据坐标查询地理位置信息的API
 */
export async function GET(request: Request) {
  try {
    // 获取URL和查询参数
    const { searchParams } = new URL(request.url);
    const coords = searchParams.get('coords');
    
    // 检查必要参数
    if (!coords) {
      return NextResponse.json(
        { error: '缺少必要的参数 (coords)' },
        { status: 400 }
      );
    }
    
    // 构建PC Online的API URL
    const apiUrl = `https://whois.pconline.com.cn/ipAreaCoordJson.jsp?coords=${coords}&json=true`;
    
    console.log(`地理位置API代理请求: ${apiUrl}`);
    
    // 发送请求到PC Online API - 获取二进制响应
    const response = await fetch(apiUrl);
    const buffer = await response.arrayBuffer();
    
    // 使用iconv-lite解码GBK编码的响应
    const text = iconv.decode(Buffer.from(buffer), 'gbk');
    console.log('解码后的文本:', text);
    
    // 对PC Online返回的数据进行解析
    try {
      // 1. 处理JSONP格式的响应
      let jsonText = text;
      const jsonpMatch = text.match(/\((.*)\)/);
      if (jsonpMatch && jsonpMatch[1]) {
        jsonText = jsonpMatch[1];
      }
      
      // 2. 解析JSON数据
      let data;
      try {
        data = JSON.parse(jsonText);
      } catch (err) {
        console.log('JSON解析失败，尝试手动提取字段');
        
        // 3. 如果JSON解析失败，尝试正则提取关键字段
        const cityMatch = text.match(/"city":"([^"]*)"/);
        const regionMatch = text.match(/"region":"([^"]*)"/);
        
        data = {
          city: cityMatch ? cityMatch[1] : '未知城市',
          region: regionMatch ? regionMatch[1] : '',
          parse_method: 'regex_extract'
        };
      }
      
      // 添加坐标信息
      const [longitude, latitude] = coords.split(',').map(Number);
      data.coords = { longitude, latitude };
      
      console.log('解析后的数据:', data);
      
      // 返回解析结果
      return NextResponse.json(data);
    } catch (error) {
      console.error('解析响应数据失败:', error);
      
      // 如果解析失败，返回错误信息和部分原始响应
      const [longitude, latitude] = coords.split(',').map(Number);
      return NextResponse.json({
        error: '无法解析API返回的数据',
        decoded_text: text.substring(0, 200),
        coords: { longitude, latitude }
      });
    }
  } catch (error) {
    console.error('地理位置API代理错误:', error);
    
    // 如果出错，返回错误信息
    return NextResponse.json(
      { error: "处理请求时出错", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 