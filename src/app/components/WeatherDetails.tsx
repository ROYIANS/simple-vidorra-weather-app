'use client';

import React from 'react';
import { WeatherData } from '../services/weatherService';
import { skyconMap } from '../services/weatherService';
import {
  RiDropFill,
  RiWindyFill,
  RiLeafFill,
  RiTempColdFill,
  RiSunFill
} from '@remixicon/react';

interface WeatherDetailsProps {
  weather: WeatherData;
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ weather }) => {
  // 处理风向展示
  const getWindDirection = (direction: number) => {
    const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北', '北'];
    const index = Math.round(direction / 45) % 8;
    return directions[index];
  };

  // 获取风力描述
  const getWindDescription = (speed: number) => {
    if (speed < 1) return '无风';
    if (speed < 5) return '微风徐徐';
    if (speed < 11) return '清风';
    if (speed < 19) return '树叶摇摆';
    if (speed < 28) return '树枝摇动';
    if (speed < 38) return '风力强劲';
    if (speed < 49) return '风力强劲';
    if (speed < 61) return '风力超强';
    if (speed < 74) return '狂风大作';
    if (speed < 88) return '狂风呼啸';
    if (speed < 102) return '暴风毁树';
    if (speed < 117) return '暴风毁树';
    return '飓风';
  };

  // 获取降水情况描述
  const getPrecipitationDescription = () => {
    const { local, nearest } = weather.precipitation;
    
    if (local.intensity > 0.03) {
      let level = '小雨';
      if (local.intensity > 0.25) level = '中雨';
      if (local.intensity > 0.35) level = '大雨';
      if (local.intensity > 0.48) level = '暴雨';
      return `当前正在下${level}`;
    } else if (nearest.distance < 10000) {
      return `距离您约${(nearest.distance/1000).toFixed(1)}公里处有降水`;
    } else {
      return '附近无降水';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <div className="mb-4">
        <div className="text-3xl font-bold">{Math.round(weather.temperature)}°C</div>
        <div className="text-gray-600">体感温度 {Math.round(weather.apparent_temperature)}°C</div>
      </div>

      <div className="mb-4">
        <div className="text-lg font-medium">{skyconMap[weather.skycon] || weather.skycon}</div>
        <div className="text-gray-600">{getPrecipitationDescription()}</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <RiDropFill className="text-blue-400" />
            湿度
          </div>
          <div className="font-medium">{Math.round(weather.humidity * 100)}%</div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <RiWindyFill className="text-gray-400" />
            风力
          </div>
          <div className="font-medium">
            {getWindDirection(weather.windDirection)} {weather.windSpeed.toFixed(1)}km/h
          </div>
          <div className="text-xs text-gray-400">{getWindDescription(weather.windSpeed)}</div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <RiLeafFill className="text-green-400" />
            空气质量
          </div>
          <div className="font-medium">
            AQI {weather.airQuality.aqi.chn} ({weather.airQuality.description.chn})
          </div>
          <div className="text-xs text-gray-400">PM2.5: {weather.airQuality.pm25}</div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <RiSunFill className="text-yellow-400" />
            生活指数
          </div>
          <div className="font-medium">
            <div className="flex items-center gap-1">
              <RiTempColdFill className="text-blue-300 w-3 h-3" />
              舒适度: {weather.lifeIndex.comfort.desc}
            </div>
            <div className="flex items-center gap-1">
              <RiSunFill className="text-yellow-300 w-3 h-3" />
              紫外线: {weather.lifeIndex.ultraviolet.desc}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails; 