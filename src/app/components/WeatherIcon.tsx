'use client';

import React from 'react';
import ReactAnimatedWeather from 'react-animated-weather';

interface WeatherIconProps {
  skycon: string;
  size?: number;
}

// 天气类型映射到 react-animated-weather 图标
const skyconToIcon: Record<string, string> = {
  'CLEAR_DAY': 'CLEAR_DAY',
  'CLEAR_NIGHT': 'CLEAR_NIGHT',
  'PARTLY_CLOUDY_DAY': 'PARTLY_CLOUDY_DAY',
  'PARTLY_CLOUDY_NIGHT': 'PARTLY_CLOUDY_NIGHT',
  'CLOUDY': 'CLOUDY',
  'LIGHT_RAIN': 'RAIN',
  'MODERATE_RAIN': 'RAIN',
  'HEAVY_RAIN': 'RAIN',
  'STORM_RAIN': 'RAIN',
  'LIGHT_SNOW': 'SNOW',
  'MODERATE_SNOW': 'SNOW',
  'HEAVY_SNOW': 'SNOW',
  'STORM_SNOW': 'SNOW',
  'LIGHT_HAZE': 'FOG',
  'MODERATE_HAZE': 'FOG',
  'HEAVY_HAZE': 'FOG',
  'FOG': 'FOG',
  'DUST': 'FOG',
  'SAND': 'FOG',
  'WIND': 'WIND'
};

const WeatherIcon: React.FC<WeatherIconProps> = ({ skycon, size = 64 }) => {
  // 确保图标在任何设备上都正确显示
  const iconSize = size;
  
  // 获取映射的图标
  const getIcon = (skycon: string) => {
    return skyconToIcon[skycon] || 'CLOUDY';
  };
  
  // 根据天气和时间选择颜色
  const getColor = (skycon: string) => {
    if (skycon === 'CLEAR_DAY' || skycon === 'PARTLY_CLOUDY_DAY') {
      return '#FDB813'; // 黄色
    } else if (skycon === 'CLEAR_NIGHT' || skycon === 'PARTLY_CLOUDY_NIGHT') {
      return '#7C81AD'; // 深蓝色
    } else if (skycon.includes('RAIN')) {
      return '#61A3BA'; // 蓝色
    } else if (skycon.includes('SNOW')) {
      return '#A2D5F2'; // 浅蓝色
    } else if (skycon.includes('HAZE') || skycon === 'FOG' || skycon === 'DUST' || skycon === 'SAND') {
      return '#B4B4B8'; // 灰色
    }
    return '#FFFFFF'; // 默认白色
  };

  return (
    <div className="flex justify-center items-center">
      <ReactAnimatedWeather
        icon={getIcon(skycon)}
        color={getColor(skycon)}
        size={iconSize}
        animate={true}
      />
    </div>
  );
};

export default WeatherIcon; 