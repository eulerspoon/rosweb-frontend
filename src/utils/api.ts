import { Command } from '../types/api';
// import { mockCommands } from '../mock/data';

// const API_BASE = '/api';

// // Функция для проверки доступности бэкенда
// const isBackendAvailable = async (): Promise<boolean> => {
//   try {
//     const response = await fetch(`${API_BASE}/commands/`, {
//       method: 'GET',
//       headers: { 'Content-Type': 'application/json' },
//     });
//     return response.ok;
//   } catch {
//     return false;
//   }
// };

// // Получение команд с fallback на mock данные
// export const fetchCommands = async (searchParams: {name?: string; ros_command?: string} = {}): Promise<Command[]> => {
//   const isAvailable = await isBackendAvailable();
  
//   if (isAvailable) {
//     try {
//       // Собираем query параметры
//       const params = new URLSearchParams();
//       if (searchParams.name) params.append('name', searchParams.name);
//       if (searchParams.ros_command) params.append('ros_command', searchParams.ros_command);
      
//       const queryString = params.toString();
//       const url = queryString ? `${API_BASE}/commands/?${queryString}` : `${API_BASE}/commands/`;
      
//       const response = await fetch(url);
//       if (!response.ok) throw new Error('API error');
//       return await response.json();
//     } catch (error) {
//       console.warn('Using mock data for commands');
//     }
//   }
  
//   // Фильтрация mock данных по поисковым параметрам
//   return mockCommands.filter(command => {
//     const nameMatch = searchParams.name 
//       ? command.name.toLowerCase().includes(searchParams.name.toLowerCase())
//       : true;
    
//     const rosCommandMatch = searchParams.ros_command
//       ? command.ros_command.toLowerCase().includes(searchParams.ros_command.toLowerCase())
//       : true;
    
//     return nameMatch && rosCommandMatch;
//   });
// };

// export {};
import { getServerUrl, shouldUseMock } from './tauriApi';
import { mockCommands } from '../mock/data';
// import { Command } from '../types/api';

interface SearchParams {
  name?: string;
  ros_command?: string;
}

export const fetchCommands = async (searchParams: SearchParams = {}): Promise<Command[]> => {
  const useMock = await shouldUseMock();
  
  if (useMock) {
    // Mock режим - используем локальные данные
    console.log('Using mock data for commands');
    let filteredCommands = [...mockCommands];
    
    if (searchParams.name) {
      filteredCommands = filteredCommands.filter(cmd => 
        cmd.name.toLowerCase().includes(searchParams.name!.toLowerCase())
      );
    }
    
    if (searchParams.ros_command) {
      filteredCommands = filteredCommands.filter(cmd => 
        cmd.ros_command.toLowerCase().includes(searchParams.ros_command!.toLowerCase())
      );
    }
    
    // Имитируем задержку сети
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return filteredCommands;
  }
  
  // Реальный API режим
  try {
    const baseUrl = await getServerUrl();
    
    const params = new URLSearchParams();
    if (searchParams.name) params.append('name', searchParams.name);
    if (searchParams.ros_command) params.append('ros_command', searchParams.ros_command);
    
    const queryString = params.toString();
    const url = `${baseUrl}/api/commands${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};