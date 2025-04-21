export interface LocationData {
  latitude: number;
  longitude: number;
  error?: string;
}

export function getCurrentLocation(): Promise<LocationData> {
  return new Promise((resolve) => {
    // 设置超时处理
    const timeoutId = setTimeout(() => {
      console.log('获取位置超时，使用默认位置');
      resolve({
        latitude: 39.9042,  // 默认北京位置
        longitude: 116.4074,
        error: '获取位置超时，使用默认位置'
      });
    }, 5000);

    // 如果浏览器不支持地理位置
    if (!navigator.geolocation) {
      clearTimeout(timeoutId);
      console.log('浏览器不支持地理位置API，使用默认位置');
      resolve({
        latitude: 39.9042,  // 默认北京位置
        longitude: 116.4074,
        error: '您的浏览器不支持地理位置获取'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        console.log('成功获取位置:', position.coords);
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        clearTimeout(timeoutId);
        console.error('获取地理位置失败:', error);
        
        // 失败时使用默认坐标（北京）
        resolve({
          latitude: 39.9042,  // 默认北京位置
          longitude: 116.4074,
          error: getLocationErrorMessage(error.code)
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 4000,
        maximumAge: 0
      }
    );
  });
}

function getLocationErrorMessage(errorCode: number): string {
  switch (errorCode) {
    case 1:
      return '您拒绝了位置访问权限请求';
    case 2:
      return '无法获取您的位置信息';
    case 3:
      return '获取位置信息超时';
    default:
      return '未知错误';
  }
} 