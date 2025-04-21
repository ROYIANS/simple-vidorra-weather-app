'use client';

import React from 'react';
import { WeatherData } from '../services/weatherService';
import WeatherIcon from './WeatherIcon';

interface IOSWeatherHeaderProps {
  locationName: string;
  weather: WeatherData;
  description: string;
}

const IOSWeatherHeader: React.FC<IOSWeatherHeaderProps> = ({ 
  locationName, 
  weather, 
  description 
}) => {
  // 获取最高和最低温度（此处模拟，实际应从API获取）
  const highTemp = Math.round(weather.temperature + 3);
  const lowTemp = Math.round(weather.temperature - 5);

  return (
    <div className="flex flex-col items-center text-white pt-16 pb-10 relative">
      {/* 城市名称 */}
      <h1 className="text-3xl font-light mb-3">{locationName}</h1>
      
      {/* 当前温度和天气图标 */}
      <div className="flex flex-col items-center">
        <div className="mb-2">
          <WeatherIcon skycon={weather.skycon} size={100} />
        </div>
        <div className="text-[8rem] font-thin leading-none">
          {Math.round(weather.temperature)}°
        </div>
      </div>
      
      {/* 天气描述 */}
      <div className="text-2xl font-light mb-2">
        {description}
      </div>
      
      {/* 最高最低温度 */}
      <div className="text-xl">
        最高{highTemp}° 最低{lowTemp}°
      </div>
    </div>
  );
};

export default IOSWeatherHeader; 