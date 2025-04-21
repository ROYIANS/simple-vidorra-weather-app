'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MinutelyRainForecastProps {
  minutely?: {
    precipitation_2h: number[];
    probability: number[];
    description: string;
  };
}

const MinutelyRainForecast: React.FC<MinutelyRainForecastProps> = ({ minutely }) => {
  // 如果没有分钟级数据，显示默认信息
  if (!minutely || !minutely.precipitation_2h || minutely.precipitation_2h.length === 0) {
    return <p className="text-sm text-white/80">暂无分钟级降水数据</p>;
  }

  // 找出最大降水量，用于归一化图表高度
  const maxPrecipitation = Math.max(...minutely.precipitation_2h.slice(0, 60)) || 1;
  
  // 计算降水等级
  const getRainLevel = (value: number) => {
    if (value === 0) return 'bg-transparent';
    if (value < 0.031) return 'bg-blue-300';
    if (value < 0.25) return 'bg-blue-400';
    if (value < 0.35) return 'bg-blue-500';
    if (value < 0.48) return 'bg-blue-600';
    if (value < 0.75) return 'bg-blue-700';
    return 'bg-blue-800';
  };

  return (
    <>
      <p className="text-sm text-white/80 mb-4">{minutely.description}</p>
      
      <div className="flex items-end w-full h-36 space-x-1">
        {minutely.precipitation_2h.slice(0, 60).map((value, index) => {
          // 只展示未来60分钟的数据
          const height = (value / maxPrecipitation) * 100;
          const displayHeight = height > 0 ? Math.max(4, height) : 0; // 最小高度为4px
          
          return (
            <motion.div 
              key={index} 
              className="flex-1 flex flex-col items-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.01, duration: 0.3 }}
            >
              <div 
                className={`w-full rounded-t ${getRainLevel(value)}`} 
                style={{ height: `${displayHeight}%` }}
              ></div>
              {index % 10 === 0 && (
                <span className="text-xs mt-1 text-white/80">{index}分</span>
              )}
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-3 flex justify-between text-xs text-white/70">
        <span>当前</span>
        <span>30分钟</span>
        <span>60分钟</span>
      </div>
    </>
  );
};

export default MinutelyRainForecast; 