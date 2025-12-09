// Конфигурация приложения
export const config = {
  // Режим разработки
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // Использовать mock данные (если true, то не будет запросов к серверу)
  useMockData: false,
  
  // Базовый URL API
  apiBaseUrl: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8000/api'
    : '/api',
    
  // Задержка для имитации сети (мс)
  mockDelay: 300,
};

// Проверка доступности сервера
export const checkServerAvailability = async (): Promise<boolean> => {
  if (config.useMockData) {
    return false;
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch(`${config.apiBaseUrl}/commands/`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn('Server is not available, using mock data');
    return false;
  }
};