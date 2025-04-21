'use client';

// 服务器端配置，防止客户端缓存
export const dynamic = 'force-dynamic';
// revalidate不能在客户端组件中使用
// export const revalidate = 0;

import React, { useEffect, useState } from 'react';
import { getCurrentLocation } from './utils/location';
import { 
  getRealTimeWeather, 
  getMinutelyWeather, 
  getHourlyWeather, 
  WeatherData, 
  HourlyData,
  skyconMap
} from './services/weatherService';
import { MinutelyData } from './services/weatherService';
import WeatherIcon from './components/WeatherIcon';
import WeatherDetails from './components/WeatherDetails';
import RainfallChart from './components/RainfallChart';
import IOSWeatherHeader from './components/IOSWeatherHeader';
import HourlyForecast from './components/HourlyForecast';
import AirQualityCard from './components/AirQualityCard';
import MinutelyRainForecast from './components/MinutelyRainForecast';
import { RiRefreshLine, RiMapPinLine, RiFileTextLine, RiDropLine, RiWindyLine, RiSunLine, RiTempColdLine, RiCloudyLine, RiRainyLine } from '@remixicon/react';
import { motion } from 'framer-motion';

// 获取城市信息
const fetchCityInfo = async (longitude: number, latitude: number) => {
  try {
    // 使用我们自己的API代理，直接fetch请求
    const response = await fetch(`/api/geo?coords=${longitude},${latitude}`);
    
    if (!response.ok) {
      console.error('获取城市信息失败，状态码:', response.status);
      return '当前位置';
    }
    
    const data = await response.json();
    
    // 返回城市名称
    if (data && data.city) {
      const cityName = data.region ? `${data.city} ${data.region}` : data.city;
      return cityName;
    } else {
      return '当前位置';
    }
  } catch (error) {
    console.error('获取城市信息失败:', error);
    return '当前位置';
  }
};

// 定义容器和子元素动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

const fadeInUp = {
  hidden: { y: 40, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [minutely, setMinutely] = useState<MinutelyData | null>(null);
  const [hourly, setHourly] = useState<HourlyData | null>(null);
  const [locationName, setLocationName] = useState<string>("获取中...");
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 获取用户位置
      console.log('正在获取用户位置...');
      const location = await getCurrentLocation();
      console.log('获取到位置:', location);
      
      if (location.error) {
        console.warn(`位置获取警告: ${location.error}, 使用默认位置继续`);
        setLocationName("默认位置：北京"); 
      } else {
        // 获取城市信息
        const cityName = await fetchCityInfo(location.longitude, location.latitude);
        setLocationName(cityName);
      }
      
      let weatherData = null;
      let minutelyData = null;
      let hourlyData = null;
      
      // 获取实时天气数据
      console.log('正在获取天气数据...');
      try {
        weatherData = await getRealTimeWeather(location.longitude, location.latitude);
        setWeather(weatherData);
        console.log('天气数据获取成功');
      } catch (weatherError) {
        console.error('天气数据获取失败:', weatherError);
      }
      
      // 获取分钟级预报
      console.log('正在获取降水预报...');
      try {
        minutelyData = await getMinutelyWeather(location.longitude, location.latitude);
        setMinutely(minutelyData);
        console.log('降水预报获取成功');
      } catch (minutelyError) {
        console.error('降水预报获取失败:', minutelyError);
        minutelyData = {
          description: '暂无降水预报数据',
          precipitation_2h: Array(120).fill(0),
          probability: [0, 0, 0, 0]
        };
        setMinutely(minutelyData);
      }
      
      // 获取小时级天气预报
      console.log('正在获取小时级天气预报...');
      try {
        hourlyData = await getHourlyWeather(location.longitude, location.latitude);
        setHourly(hourlyData);
        console.log('小时级天气预报获取成功');
      } catch (hourlyError) {
        console.error('小时级天气预报获取失败:', hourlyError);
        hourlyData = {
          description: '暂无小时级天气预报',
          forecast_keypoint: '',
          hourly: []
        };
        setHourly(hourlyData);
      }
      
      // 如果所有主要数据都获取失败，则抛出错误
      if (!weatherData && !minutelyData && !hourlyData) {
        throw new Error('无法获取任何天气数据');
      }

    } catch (err) {
      console.error("获取数据失败", err);
      setError(err instanceof Error ? err.message : "获取天气数据失败，请检查网络连接或稍后重试");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    
    // 每5分钟刷新一次数据
    const intervalId = setInterval(fetchWeatherData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // 刷新数据
  const handleRefresh = () => {
    setRefreshing(true);
    fetchWeatherData();
  };

  // 根据当前时间确定背景
  const getBackgroundClass = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 8) return 'from-blue-600 via-orange-300 to-blue-300'; // 日出
    if (hour >= 8 && hour < 17) return 'from-blue-500 via-blue-400 to-blue-300'; // 白天
    if (hour >= 17 && hour < 20) return 'from-orange-500 via-purple-400 to-blue-900'; // 日落
    return 'from-blue-900 via-indigo-800 to-blue-800'; // 夜晚
  };

  if (loading && !refreshing) {
    return (
      <main className={`min-h-screen bg-gradient-to-b ${getBackgroundClass()} p-0 text-white`}>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="rounded-full h-16 w-16 border-t-4 border-b-4 border-r-2 border-white"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-white text-lg"
          >
            正在获取天气数据...
          </motion.p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={`min-h-screen bg-gradient-to-b ${getBackgroundClass()} p-5 text-white`}>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }}
            className="bg-white/20 backdrop-blur-md rounded-2xl p-6 max-w-md w-full shadow-xl border border-white/10"
          >
            <h2 className="text-2xl font-bold text-red-300 mb-4">出错了</h2>
            <p className="text-white mb-5">{error}</p>
            <button 
              onClick={handleRefresh}
              className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <RiRefreshLine className="w-5 h-5" />
              重试
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  if (!weather || !minutely || !hourly) {
    return (
      <main className={`min-h-screen bg-gradient-to-b ${getBackgroundClass()} p-5 text-white`}>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }}
            className="bg-white/20 backdrop-blur-md rounded-2xl p-6 max-w-md w-full shadow-xl border border-white/10"
          >
            <h2 className="text-2xl font-bold text-yellow-300 mb-4">无数据</h2>
            <p className="text-white mb-5">未能获取到天气数据</p>
            <button 
              onClick={handleRefresh}
              className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <RiRefreshLine className="w-5 h-5" />
              重试
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen bg-gradient-to-b ${getBackgroundClass()} p-0 pb-20 overflow-x-hidden`}>
      {/* 刷新指示器 */}
      {refreshing && (
        <div className="fixed top-0 inset-x-0 bg-white/10 backdrop-blur-sm z-50 flex justify-center py-1">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-5 h-5 flex items-center justify-center"
          >
            <RiRefreshLine className="w-5 h-5 text-white" />
          </motion.div>
        </div>
      )}

      <div className="max-w-md mx-auto px-5 md:max-w-2xl lg:max-w-4xl relative">
        {/* 下拉刷新指示器 */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1 bg-white/30 rounded-full"></div>
        </div>

        {/* 位置信息 */}
        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-center gap-2 mb-6 mt-3"
        >
          <RiMapPinLine className="w-5 h-5 text-white" />
          <h1 className="text-2xl font-light text-white">{locationName}</h1>
          <button 
            onClick={handleRefresh} 
            className="ml-2 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <RiRefreshLine className="w-5 h-5 text-white" />
          </button>
        </motion.div>
        
        {/* 主要天气信息 */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible" 
          className="flex flex-col items-center mb-10"
        >
          <div className="mb-2">
            <WeatherIcon skycon={weather.skycon} size={120} />
          </div>
          <div className="text-[8rem] font-thin leading-none text-white text-center">
            {Math.round(weather.temperature)}°
          </div>
          <div className="text-2xl font-light mb-2 text-white">
            {hourly.description || skyconMap[weather.skycon] || ''}
          </div>
          <div className="text-xl text-white">
            {hourly.hourly.length > 0 && 
              `最高${Math.round(Math.max(...hourly.hourly.slice(0, 24).map(item => item.temperature)))}° 最低${Math.round(Math.min(...hourly.hourly.slice(0, 24).map(item => item.temperature)))}°`
            }
          </div>
        </motion.div>
        
        {/* 卡片容器 */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {/* 小时级预报卡片 */}
          <motion.div variants={itemVariants} className="overflow-visible">
            <motion.div 
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white/5"
            >
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <RiCloudyLine className="w-5 h-5 text-yellow-300" />
                24小时预报
              </h3>
              <HourlyForecast hourlyData={hourly.hourly} />
            </motion.div>
          </motion.div>
          
          {/* 分钟级降水预报卡片 */}
          <motion.div variants={itemVariants} className="overflow-visible">
            <motion.div 
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white/5"
            >
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <RiRainyLine className="w-5 h-5 text-blue-300" />
                降水预报
              </h3>
              <MinutelyRainForecast minutely={minutely} />
            </motion.div>
          </motion.div>
          
          {/* 天气详情卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div variants={itemVariants} className="overflow-visible">
              <motion.div 
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white/5 h-full"
              >
                <AirQualityCard 
                  aqi={weather.airQuality.aqi.chn} 
                  description={weather.airQuality.description.chn}
                  pm25={weather.airQuality.pm25}  
                />
              </motion.div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="overflow-visible">
              <motion.div 
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white/5 text-white h-full"
              >
                <div className="flex items-center gap-2 mb-3">
                  <RiFileTextLine className="w-5 h-5 text-white" />
                  <h3 className="text-lg font-medium">今日天气</h3>
                </div>
                
                <p className="text-sm opacity-80 mb-5">
                  {hourly.forecast_keypoint || `今天天气${skyconMap[weather.skycon]}`}
                </p>
                
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-1">
                    <div className="text-sm opacity-70 mb-1">湿度</div>
                    <div className="text-lg flex items-center gap-1">
                      <RiDropLine className="w-4 h-4 text-blue-300" />
                      {Math.round(weather.humidity * 100)}%
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <div className="text-sm opacity-70 mb-1">风速</div>
                    <div className="text-lg flex items-center gap-1">
                      <RiWindyLine className="w-4 h-4 text-gray-200" />
                      {weather.windSpeed.toFixed(1)} km/h
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <div className="text-sm opacity-70 mb-1">紫外线</div>
                    <div className="text-lg flex items-center gap-1">
                      <RiSunLine className="w-4 h-4 text-yellow-300" />
                      {weather.lifeIndex.ultraviolet.desc}
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <div className="text-sm opacity-70 mb-1">体感温度</div>
                    <div className="text-lg flex items-center gap-1">
                      <RiTempColdLine className="w-4 h-4 text-blue-300" />
                      {Math.round(weather.apparent_temperature)}°
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-xs text-white/60 mt-8"
        >
          <p>数据来源于彩云天气</p>
          <p className="mt-1">© {new Date().getFullYear()} <a href="https://weather.vidorra.life" className="hover:text-white transition-colors">weather.vidorra.life</a> - 小梦岛工作室</p>
        </motion.footer>
      </div>

      {/* GitHub链接 */}
      <a 
        href="https://github.com/ROYIANS/simple-vidorra-weather-app" 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute top-0 right-0 z-20"
        aria-label="Fork me on GitHub"
      >
        <svg width="80" height="80" viewBox="0 0 250 250" className="absolute top-0 right-0 border-0" aria-hidden="true">
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" fill="rgba(255,255,255,0.1)"></path>
          <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="rgba(255,255,255,0.2)" className="octo-arm" style={{transformOrigin: "130px 106px"}}></path>
          <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="rgba(255,255,255,0.2)" className="octo-body"></path>
        </svg>
      </a>
    </main>
  );
}
