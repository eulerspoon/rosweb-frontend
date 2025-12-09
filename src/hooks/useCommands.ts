import { useState, useEffect } from 'react';
import { Command } from '../types/api';
import { fetchCommands } from '../utils/api';

interface SearchParams {
  name?: string;
  ros_command?: string;
}

export const useCommands = (searchParams: SearchParams = {}) => {
  const [commands, setCommands] = useState<Command[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCommands = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchCommands(searchParams);
        setCommands(data);
      } catch (err: any) {
        console.error('Error loading commands:', err);
        setError(err.message || 'Ошибка загрузки команд');
      } finally {
        setLoading(false);
      }
    };

    loadCommands();
  }, [searchParams]);

  return { commands, loading, error };
};

export {};