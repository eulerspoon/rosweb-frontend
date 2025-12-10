// utils/api.ts
import { Command } from '../types/api';
import { getServerUrl, shouldUseMock, isTauri } from './tauriApi';
import { mockCommands } from '../mock/data';

interface SearchParams {
  name?: string;
  ros_command?: string;
}

export const fetchCommands = async (searchParams: SearchParams = {}): Promise<Command[]> => {
  const useMock = await shouldUseMock();
  
  if (useMock) {
    // Mock режим - только для веб-разработки
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
  
  // Реальный API режим - для Tauri
  try {
    const baseUrl = await getServerUrl();
    
    const params = new URLSearchParams();
    if (searchParams.name) params.append('name', searchParams.name);
    if (searchParams.ros_command) params.append('ros_command', searchParams.ros_command);
    
    const queryString = params.toString();
    const url = `${baseUrl}/api/commands${queryString ? `?${queryString}` : ''}`;
    
    console.log('Fetching from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // В Tauri не нужны credentials, так как это отдельное приложение
      credentials: isTauri() ? 'omit' : 'include'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    // В случае ошибки возвращаем пустой массив или можем показать сообщение
    return [];
  }
};

// Добавим функцию для проверки доступности бэкенда
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const baseUrl = await getServerUrl();
    const response = await fetch(`${baseUrl}/api/commands/`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    return response.ok;
  } catch {
    return false;
  }
};