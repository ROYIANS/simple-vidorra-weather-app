'use client';

import React from 'react';
import { RiLeafLine } from '@remixicon/react';

interface AirQualityCardProps {
  aqi: number;
  pm25: number;
  description?: string; // 设为可选参数
}

const AirQualityCard: React.FC<AirQualityCardProps> = ({ 
  aqi, 
  pm25, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  description 
}) => {
  // 获取AQI级别和对应的样式
  const getAqiLevel = (aqi: number) => {
    if (aqi <= 50) return { level: '优', color: 'bg-green-500' };
    if (aqi <= 100) return { level: '良', color: 'bg-yellow-400' };
    if (aqi <= 150) return { level: '轻度污染', color: 'bg-orange-400' };
    if (aqi <= 200) return { level: '中度污染', color: 'bg-red-500' };
    if (aqi <= 300) return { level: '重度污染', color: 'bg-purple-600' };
    return { level: '严重污染', color: 'bg-red-900' };
  };

  const { level, color } = getAqiLevel(aqi);
  
  // 计算进度条宽度（最大300）
  const progressWidth = Math.min(100, (aqi / 300) * 100);

  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <RiLeafLine className="w-5 h-5 text-green-300" />
        <h3 className="text-lg font-medium">空气质量</h3>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl font-thin">
          {aqi} - {level}
        </div>
        <div className="text-sm opacity-80">
          PM2.5: {pm25}
        </div>
      </div>
      
      {/* 进度条 */}
      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color}`} 
          style={{ width: `${progressWidth}%` }}
        ></div>
      </div>
    </>
  );
};

export default AirQualityCard; 