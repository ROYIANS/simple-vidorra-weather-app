'use client';

import { useState, useEffect } from 'react';

// 预设几个常用城市的坐标点
const PRESET_LOCATIONS = [
  { name: '北京', coords: '116.4074,39.9042' },
  { name: '上海', coords: '121.4737,31.2304' },
  { name: '广州', coords: '113.2644,23.1291' },
  { name: '深圳', coords: '114.0579,22.5431' },
  { name: '太原', coords: '112.549,37.857' },
  { name: '杭州', coords: '120.1551,30.2741' }
];

export default function GeoTest() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<string>('116.4074,39.9042'); // 默认北京坐标
  const [currentLocation, setCurrentLocation] = useState<string>('未知');

  // 测试地理位置API
  const testGeoApi = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 调用API
      const response = await fetch(`/api/geo?coords=${coords}`);
      const data = await response.json();
      
      // 设置结果
      setResults(data);
    } catch (err) {
      console.error('API调用失败:', err);
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  };

  // 获取当前位置
  const getCurrentLocation = () => {
    setCurrentLocation('获取中...');
    
    if (!navigator.geolocation) {
      setCurrentLocation('浏览器不支持地理定位');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCurrentLocation(`${lng.toFixed(6)},${lat.toFixed(6)}`);
        setCoords(`${lng.toFixed(6)},${lat.toFixed(6)}`);
      },
      (error) => {
        console.error('获取位置失败:', error);
        setCurrentLocation('获取位置失败');
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">地理位置API测试</h1>
      
      <div className="mb-4">
        <label className="block mb-2">坐标 (经度,纬度):</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={coords}
            onChange={(e) => setCoords(e.target.value)}
            className="border p-2 flex-grow text-black"
            placeholder="116.4074,39.9042"
          />
          <button
            onClick={getCurrentLocation}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          >
            定位
          </button>
        </div>
        {currentLocation !== '未知' && (
          <div className="mt-2 text-sm text-gray-600">
            当前位置: {currentLocation}
          </div>
        )}
      </div>
      
      {/* 预设位置快速选择 */}
      <div className="mb-6">
        <label className="block mb-2">快速选择城市:</label>
        <div className="flex flex-wrap gap-2">
          {PRESET_LOCATIONS.map((location) => (
            <button
              key={location.name}
              onClick={() => setCoords(location.coords)}
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-1 px-3 rounded text-sm"
            >
              {location.name}
            </button>
          ))}
        </div>
      </div>
      
      <button 
        onClick={testGeoApi}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? '测试中...' : '测试API'}
      </button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
          <strong>错误:</strong> {error}
        </div>
      )}
      
      {results && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">API响应结果:</h2>
          <div className="bg-gray-100 p-4 rounded text-gray-800">
            <pre className="whitespace-pre-wrap">{JSON.stringify(results, null, 2)}</pre>
          </div>
          
          {results.city && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
              <strong>解析的城市:</strong> {results.region ? `${results.city} ${results.region}` : results.city}
              {results.source && (
                <div className="mt-2 text-xs text-gray-600">
                  数据来源: {results.source === 'coordinate_inference' ? '坐标推断' : '直接API返回'}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="mt-8 text-sm text-gray-500">
        <p>调试说明:</p>
        <ul className="list-disc pl-5 mt-2">
          <li>查看浏览器控制台以获取详细日志</li>
          <li>查看服务器控制台以获取API响应的原始文本</li>
          <li>我们目前基于坐标范围推断城市，因为原API返回的中文编码有问题</li>
        </ul>
      </div>
    </div>
  );
} 