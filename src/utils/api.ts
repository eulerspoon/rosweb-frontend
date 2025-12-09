import axios, { AxiosInstance } from 'axios';
import { Command } from '../types/api';
import { mockCommands } from '../mock/data';

// Базовый URL API
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8000/api' 
  : '/api';

  // Проверяем доступность сервера
let isServerAvailable = false;

// Функция для проверки доступности сервера
const checkServerAvailability = async () => {
  try {
    // Проверяем доступность API с токеном (если есть)
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Token ${token}` } : {};
    
    await axios.get('http://localhost:8000/api/commands/', { 
      timeout: 2000,
      headers 
    });
    isServerAvailable = true;
    console.log('Django server is available');
  } catch (error) {
    console.warn('Django server is not available, using mock data');
    isServerAvailable = false;
  }
};

// Проверим при инициализации
checkServerAvailability();

// Создаем экземпляр Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // Таймаут 5 секунд
});

// Интерцептор для добавления токена
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Функция для получения команд (с поддержкой mock)
export const fetchCommands = async (params?: { name?: string; ros_command?: string }) => {
  if (!isServerAvailable) {
    // Используем mock данные
    console.log('Using mock data for commands');
    await new Promise(resolve => setTimeout(resolve, 300)); // Имитация задержки
    
    let filteredCommands = [...mockCommands];
    
    if (params?.name) {
      filteredCommands = filteredCommands.filter(cmd => 
        cmd.name.toLowerCase().includes(params.name!.toLowerCase())
      );
    }
    
    if (params?.ros_command) {
      filteredCommands = filteredCommands.filter(cmd => 
        cmd.ros_command.toLowerCase().includes(params.ros_command!.toLowerCase())
      );
    }
    
    return filteredCommands;
  }
  
  // Используем реальный API
  try {
    const response = await apiClient.get('/commands/', { params });
    return response.data;
  } catch (error) {
    console.error('API request failed, falling back to mock data:', error);
    
    // Fallback to mock data
    let filteredCommands = [...mockCommands];
    
    if (params?.name) {
      filteredCommands = filteredCommands.filter(cmd => 
        cmd.name.toLowerCase().includes(params.name!.toLowerCase())
      );
    }
    
    if (params?.ros_command) {
      filteredCommands = filteredCommands.filter(cmd => 
        cmd.ros_command.toLowerCase().includes(params.ros_command!.toLowerCase())
      );
    }
    
    return filteredCommands;
  }
};

// API функции для auth (только с реальным сервером)
export const authAPI = {
  login: async (username: string, password: string) => {
    if (!isServerAvailable) {
      throw new Error('Сервер недоступен. Пожалуйста, запустите Django сервер.');
    }
    const response = await apiClient.post('/users/login/', { username, password });
    
    // Сохраняем токен
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response;
  },
  
  register: async (userData: any) => {
    if (!isServerAvailable) {
      throw new Error('Сервер недоступен. Пожалуйста, запустите Django сервер.');
    }
    return apiClient.post('/users/register/', userData);
  },
  
  logout: async () => {
    if (!isServerAvailable) {
      // Для mock режима просто очищаем localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { data: { status: 'logout successful' } };
    }
    return apiClient.post('/users/logout/');
  },
  
  getProfile: async () => {
    if (!isServerAvailable) {
      const user = localStorage.getItem('user');
      return { data: user ? JSON.parse(user) : null };
    }
    return apiClient.get('/users/profile/');
  },
  
  updateProfile: async (userData: any) => {
    if (!isServerAvailable) {
      throw new Error('Сервер недоступен. Пожалуйста, запустите Django сервер.');
    }
    return apiClient.put('/users/update_profile/', userData);
  },
};

export const commandsAPI = {
  getCommands: fetchCommands,
  
  getCommand: (id: number) => {
    if (!isServerAvailable) {
      const command = mockCommands.find(cmd => cmd.id === id);
      return Promise.resolve({ 
        data: command || mockCommands[0] 
      });
    }
    return apiClient.get(`/commands/${id}/`);
  },
  
  addToRoute: (commandId: number) => {
    if (!isServerAvailable) {
      console.log(`Mock: Adding command ${commandId} to route`);
      return Promise.resolve({ 
        data: { status: 'added to route', route_id: 1, command_name: 'Mock Command' } 
      });
    }
    return apiClient.post(`/commands/${commandId}/add_to_route/`);
  },
};

export const routesAPI = {
  getRoutes: () => {
    if (!isServerAvailable) {
      return Promise.resolve({ data: [] });
    }
    return apiClient.get('/routes/');
  },
  
  getRoute: (id: number) => {
    if (!isServerAvailable) {
      return Promise.resolve({ 
        data: { 
          id, 
          status: 'draft',
          creator: 1,
          creator_name: 'mock_user',
          created_at: new Date().toISOString(),
          formed_at: null,
          approved_at: null,
          ended_at: null,
          comment: null,
          area: null,
          result: null,
          route_commands: []
        } 
      });
    }
    return apiClient.get(`/routes/${id}/`);
  },
  
  createRoute: () => {
    if (!isServerAvailable) {
      return Promise.resolve({ 
        data: { 
          id: 1,
          status: 'draft',
          creator: 1
        } 
      });
    }
    return apiClient.post('/routes/');
  },
  
  updateRoute: (id: number, data: any) => {
    if (!isServerAvailable) {
      return Promise.resolve({ data: { ...data, id } });
    }
    return apiClient.put(`/routes/${id}/`, data);
  },
  
  deleteRoute: (id: number) => {
    if (!isServerAvailable) {
      return Promise.resolve({ data: { status: 'deleted' } });
    }
    return apiClient.delete(`/routes/${id}/`);
  },
  
  formRoute: (id: number) => {
    if (!isServerAvailable) {
      return Promise.resolve({ 
        data: { 
          status: 'route formed', 
          formed_at: new Date().toISOString() 
        } 
      });
    }
    return apiClient.put(`/routes/${id}/form_route/`);
  },
  
  getCartIcon: () => {
    if (!isServerAvailable) {
      const routeId = localStorage.getItem('current_route_id');
      const itemsCount = parseInt(localStorage.getItem('cart_items_count') || '0');
      
      return Promise.resolve({ 
        data: { 
          route_id: routeId ? parseInt(routeId) : null,
          items_count: itemsCount,
          status: itemsCount > 0 ? 'draft' : 'no_draft'
        } 
      });
    }
    return apiClient.get('/routes/cart_icon/');
  },
  
  addToRoute: (commandId: number) => {
    if (!isServerAvailable) {
      // Обновляем счетчик в localStorage для mock режима
      const currentCount = parseInt(localStorage.getItem('cart_items_count') || '0');
      localStorage.setItem('cart_items_count', (currentCount + 1).toString());
      
      return Promise.resolve({ 
        data: { 
          status: 'added to route', 
          route_id: 1, 
          command_name: 'Mock Command' 
        } 
      });
    }
    return apiClient.post(`/commands/${commandId}/add_to_route/`);
  },

  getCurrentDraft: () => {
    console.log('getCurrentDraft called, isServerAvailable:', isServerAvailable);
    if (!isServerAvailable) {
      console.log('Using MOCK data for getCurrentDraft');
      // Mock данные для черновика
      return Promise.resolve({ 
        data: { 
          id: 1,
          status: 'draft',
          creator: 1,
          creator_name: 'mock_user_new',
          created_at: new Date().toISOString(),
          formed_at: null,
          approved_at: null,
          ended_at: null,
          comment: null,
          area: null,
          result: null,
          route_commands: []
        } 
      });
    }
    console.log('Using REAL API for getCurrentDraft');
    return apiClient.get('/routes/current_draft/');
  },
};

export const routeCommandsAPI = {
  updateRouteCommand: (id: number, data: any) => {
    if (!isServerAvailable) {
      return Promise.resolve({ data: { ...data, id } });
    }
    return apiClient.put(`/route-commands/${id}/`, data);
  },
  
  deleteRouteCommand: (id: number) => {
    if (!isServerAvailable) {
      const currentCount = parseInt(localStorage.getItem('cart_items_count') || '0');
      if (currentCount > 0) {
        localStorage.setItem('cart_items_count', (currentCount - 1).toString());
      }
      return Promise.resolve({ data: { status: 'removed from route' } });
    }
    return apiClient.delete(`/route-commands/${id}/`);
  },
};

export default apiClient;