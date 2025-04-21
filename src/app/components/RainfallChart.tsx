'use client';

import React from 'react';

interface RainfallChartProps {
  precipitation: number[];
  probability: number[];
}

const RainfallChart: React.FC<RainfallChartProps> = ({ precipitation, probability }) => {
  // 计算最大降水强度，用于缩放图表
  const maxPrecipitation = Math.max(...precipitation, 0.3); // 设置最小为0.3，以便在无雨时也有一定高度

  // 获取降水强度等级描述
  const getPrecipitationLevel = (intensity: number) => {
    if (intensity < 0.031) return '无雨';
    if (intensity < 0.25) return '小雨';
    if (intensity < 0.35) return '中雨';
    if (intensity < 0.48) return '大雨';
    return '暴雨';
  };

  // 获取柱状图的颜色
  const getBarColor = (intensity: number) => {
    if (intensity < 0.031) return 'bg-gray-200';
    if (intensity < 0.25) return 'bg-blue-300';
    if (intensity < 0.35) return 'bg-blue-500';
    if (intensity < 0.48) return 'bg-blue-700';
    return 'bg-purple-700';
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">未来2小时降水预报</h3>
      
      <div className="flex items-end h-32 gap-1 mb-2 overflow-x-auto">
        {precipitation.slice(0, 120).map((intensity, index) => {
          // 每5分钟显示一个柱状图（否则太多了）
          if (index % 5 !== 0) return null;
          
          const normalizedHeight = (intensity / maxPrecipitation) * 100;
          const height = Math.max(normalizedHeight, 4); // 设置最小高度
          
          return (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={`w-3 ${getBarColor(intensity)}`} 
                style={{ height: `${height}%` }}
                title={`${index}分钟后: ${getPrecipitationLevel(intensity)}`}
              />
              {index % 15 === 0 && (
                <span className="text-xs mt-1">{index/60|0}:{(index%60).toString().padStart(2, '0')}</span>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between mt-4">
        {probability.map((prob, index) => (
          <div key={index} className="text-center">
            <div className="text-sm font-medium">
              {index * 30}-{(index + 1) * 30}分钟
            </div>
            <div className="text-xs text-gray-600">
              降水概率: {Math.round(prob * 100)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RainfallChart; 