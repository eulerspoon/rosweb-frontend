import { Command } from '../types/api';
import { mockCommands } from '../mock/data';

const API_BASE = '/api';

// Функция для проверки доступности бэкенда
const isBackendAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/commands/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch {
    return false;
  }
};

// Получение команд с fallback на mock данные
export const fetchCommands = async (searchParams: {name?: string; ros_command?: string} = {}): Promise<Command[]> => {
  const isAvailable = await isBackendAvailable();
  
  if (isAvailable) {
    try {
      // Собираем query параметры
      const params = new URLSearchParams();
      if (searchParams.name) params.append('name', searchParams.name);
      if (searchParams.ros_command) params.append('ros_command', searchParams.ros_command);
      
      const queryString = params.toString();
      const url = queryString ? `${API_BASE}/commands/?${queryString}` : `${API_BASE}/commands/`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('API error');
      return await response.json();
    } catch (error) {
      console.warn('Using mock data for commands');
    }
  }
  
  // Фильтрация mock данных по поисковым параметрам
  return mockCommands.filter(command => {
    const nameMatch = searchParams.name 
      ? command.name.toLowerCase().includes(searchParams.name.toLowerCase())
      : true;
    
    const rosCommandMatch = searchParams.ros_command
      ? command.ros_command.toLowerCase().includes(searchParams.ros_command.toLowerCase())
      : true;
    
    return nameMatch && rosCommandMatch;
  });
};

export {};