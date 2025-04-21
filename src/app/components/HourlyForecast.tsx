'use client';

import React from 'react';
import WeatherIcon from './WeatherIcon';
import { HourlyWeatherItem } from '../services/weatherService';
import { motion } from 'framer-motion';

interface HourlyForecastProps {
  hourlyData: HourlyWeatherItem[];
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourlyData }) => {
  // 格式化时间函数
  const formatHour = (isoString: string) => {
    const date = new Date(isoString);
    const hours = date.getHours();
    return `${hours}时`;
  };
  
  // 确保有数据
  if (!hourlyData || hourlyData.length === 0) {
    return <div className="text-center py-4 text-white/80">暂无小时级天气预报数据</div>;
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-5 min-w-max">
        {hourlyData.map((item, index) => (
          <motion.div 
            key={index} 
            className="flex flex-col items-center text-white min-w-[60px]"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <div className="text-sm font-medium mb-2 text-white/90">
              {index === 0 ? '现在' : formatHour(item.datetime)}
            </div>
            <div className="my-1">
              <WeatherIcon skycon={item.skycon} size={30} />
            </div>
            <div className="text-xl font-medium mt-1">
              {Math.round(item.temperature)}°
            </div>
            {item.precipitation.probability > 0 && (
              <div className="text-xs mt-1 text-blue-200">
                {Math.round(item.precipitation.probability * 100)}%
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast; 