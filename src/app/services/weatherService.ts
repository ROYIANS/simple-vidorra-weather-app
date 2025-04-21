// 从环境变量中获取API密钥，如果没有则使用默认值
const API_KEY = process.env.NEXT_PUBLIC_CAIYUN_API_KEY || 'TAkhjf8d1nlSlspN';
const BASE_URL = 'https://api.caiyunapp.com/v2.6';
// 本地API代理地址，用于解决CORS问题
const API_PROXY_URL = '/api/weather-proxy';

export interface WeatherData {
  temperature: number;
  apparent_temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  skycon: string;
  precipitation: {
    local: {
      intensity: number;
    };
    nearest: {
      distance: number;
      intensity: number;
    };
  };
  airQuality: {
    pm25: number;
    aqi: {
      chn: number;
    };
    description: {
      chn: string;
    };
  };
  lifeIndex: {
    comfort: {
      desc: string;
    };
    ultraviolet: {
      desc: string;
    };
  };
}

export interface MinutelyData {
  description: string;
  precipitation_2h: number[];
  probability: number[];
}

export interface HourlyWeatherItem {
  datetime: string;
  temperature: number;
  skycon: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  precipitation: {
    value: number;
    probability: number;
  };
  airQuality: {
    aqi: number;
    pm25: number;
  };
}

export interface HourlyData {
  description: string;
  forecast_keypoint: string;
  hourly: HourlyWeatherItem[];
}

// 获取实时天气数据
export async function getRealTimeWeather(longitude: number, latitude: number): Promise<WeatherData> {
  try {
    // 使用本地API代理
    const apiUrl = `${API_PROXY_URL}/realtime?longitude=${longitude}&latitude=${latitude}`;
    console.log(`正在请求天气数据: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`请求失败 (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    
    // 检查返回的数据结构
    if (!data.result) {
      console.error('API返回数据缺少result字段:', data);
      throw new Error('API返回数据格式错误: ' + JSON.stringify(data));
    }
    
    if (!data.result.realtime) {
      console.error('API返回数据缺少realtime字段:', data.result);
      throw new Error('API返回数据格式错误: ' + JSON.stringify(data));
    }
    
    const realtime = data.result.realtime;
    
    // 确保所有必要的字段都存在，如果不存在使用默认值
    return {
      temperature: realtime.temperature ?? 0,
      apparent_temperature: realtime.apparent_temperature ?? 0,
      humidity: realtime.humidity ?? 0,
      windSpeed: realtime.wind?.speed ?? 0,
      windDirection: realtime.wind?.direction ?? 0,
      skycon: realtime.skycon ?? 'CLEAR_DAY',
      precipitation: {
        local: {
          intensity: realtime.precipitation?.local?.intensity ?? 0
        },
        nearest: {
          distance: realtime.precipitation?.nearest?.distance ?? 100000,
          intensity: realtime.precipitation?.nearest?.intensity ?? 0
        }
      },
      airQuality: {
        pm25: realtime.air_quality?.pm25 ?? 0,
        aqi: {
          chn: realtime.air_quality?.aqi?.chn ?? 0
        },
        description: {
          chn: realtime.air_quality?.description?.chn ?? '未知'
        }
      },
      lifeIndex: {
        comfort: {
          desc: realtime.life_index?.comfort?.desc ?? '未知'
        },
        ultraviolet: {
          desc: realtime.life_index?.ultraviolet?.desc ?? '未知'
        }
      }
    };
  } catch (error) {
    console.error('获取天气数据失败:', error);
    throw error;
  }
}

// 获取分钟级降水预报
export async function getMinutelyWeather(longitude: number, latitude: number): Promise<MinutelyData> {
  try {
    // 使用本地API代理
    const apiUrl = `${API_PROXY_URL}/minutely?longitude=${longitude}&latitude=${latitude}`;
    console.log(`正在请求降水预报数据: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`请求失败 (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    
    // 彩云天气有时会返回不包含minutely字段的数据，此时我们创建默认数据
    if (!data.result || !data.result.minutely) {
      console.log('API返回数据缺少minutely字段，创建默认数据');
      
      // 尝试再次请求，显式指定详细参数
      try {
        const retryUrl = `${API_PROXY_URL}/minutely?longitude=${longitude}&latitude=${latitude}&alert=true&unit=metric:v2`;
        console.log(`尝试使用备用API获取降水预报: ${retryUrl}`);
        
        const retryResponse = await fetch(retryUrl, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        if (retryResponse.ok) {
          const retryData = await retryResponse.json();
          if (retryData.result && retryData.result.minutely) {
            return {
              description: retryData.result.minutely.description,
              precipitation_2h: retryData.result.minutely.precipitation_2h,
              probability: retryData.result.minutely.probability
            };
          }
        }
      } catch (retryError) {
        console.warn('备用API请求失败:', retryError);
      }
      
      // 如果重试失败，返回默认数据
      return {
        description: '未来两小时无降水',
        precipitation_2h: Array(120).fill(0),
        probability: [0, 0, 0, 0]
      };
    }
    
    const minutely = data.result.minutely;
    
    return {
      description: minutely.description ?? '未来两小时无降水',
      precipitation_2h: minutely.precipitation_2h ?? Array(120).fill(0),
      probability: minutely.probability ?? [0, 0, 0, 0]
    };
  } catch (error) {
    console.error('获取分钟降水预报失败:', error);
    
    // 返回默认数据，不要抛出错误
    return {
      description: '未来两小时无降水',
      precipitation_2h: Array(120).fill(0),
      probability: [0, 0, 0, 0]
    };
  }
}

// 获取小时级天气预报
export async function getHourlyWeather(longitude: number, latitude: number): Promise<HourlyData> {
  try {
    // 使用本地API代理
    const apiUrl = `${API_PROXY_URL}/hourly?longitude=${longitude}&latitude=${latitude}&hourlysteps=24`;
    console.log(`正在请求小时级天气预报: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`请求失败 (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    
    // 检查返回的数据结构
    if (!data.result) {
      console.error('API返回数据缺少result字段:', data);
      throw new Error('API返回数据格式错误: ' + JSON.stringify(data));
    }
    
    if (!data.result.hourly) {
      console.error('API返回数据缺少hourly字段:', data.result);
      throw new Error('API返回数据格式错误: ' + JSON.stringify(data));
    }
    
    const hourly = data.result.hourly;
    const hourlyItems: HourlyWeatherItem[] = [];
    
    // 处理小时级数据
    const length = Math.min(
      hourly.temperature?.length || 0,
      hourly.skycon?.length || 0,
      hourly.wind?.length || 0,
      24 // 限制最多24小时
    );
    
    for (let i = 0; i < length; i++) {
      const datetime = hourly.temperature[i]?.datetime || new Date().toISOString();
      hourlyItems.push({
        datetime,
        temperature: hourly.temperature[i]?.value || 0,
        skycon: hourly.skycon[i]?.value || 'CLEAR_DAY',
        humidity: hourly.humidity[i]?.value || 0,
        windSpeed: hourly.wind[i]?.speed || 0,
        windDirection: hourly.wind[i]?.direction || 0,
        precipitation: {
          value: hourly.precipitation[i]?.value || 0,
          probability: hourly.precipitation[i]?.probability || 0
        },
        airQuality: {
          aqi: hourly.air_quality?.aqi[i]?.value?.chn || 0,
          pm25: hourly.air_quality?.pm25[i]?.value || 0
        }
      });
    }
    
    return {
      description: hourly.description || '未来24小时天气',
      forecast_keypoint: data.result.forecast_keypoint || '',
      hourly: hourlyItems
    };
  } catch (error) {
    console.error('获取小时级天气预报失败:', error);
    throw error;
  }
}

// 天气现象代码到中文描述的映射
export const skyconMap: Record<string, string> = {
  'CLEAR_DAY': '晴（白天）',
  'CLEAR_NIGHT': '晴（夜间）',
  'PARTLY_CLOUDY_DAY': '多云（白天）',
  'PARTLY_CLOUDY_NIGHT': '多云（夜间）',
  'CLOUDY': '阴',
  'LIGHT_HAZE': '轻度雾霾',
  'MODERATE_HAZE': '中度雾霾',
  'HEAVY_HAZE': '重度雾霾',
  'LIGHT_RAIN': '小雨',
  'MODERATE_RAIN': '中雨',
  'HEAVY_RAIN': '大雨',
  'STORM_RAIN': '暴雨',
  'FOG': '雾',
  'LIGHT_SNOW': '小雪',
  'MODERATE_SNOW': '中雪',
  'HEAVY_SNOW': '大雪',
  'STORM_SNOW': '暴雪',
  'DUST': '浮尘',
  'SAND': '沙尘',
  'WIND': '大风'
}; 