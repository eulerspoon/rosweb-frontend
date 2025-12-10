// utils/tauriApi.ts

// Определяем, находимся ли мы в окружении Tauri
export function isTauri(): boolean {
  // Проверяем несколько способов
  const tauriWindow = window as any;
  
  // Способ 1: Проверка глобального объекта
  if (typeof tauriWindow.__TAURI__ !== 'undefined') {
    return true;
  }
  
  // Способ 2: Проверка наличия Tauri API (для версии 2.x)
  if (typeof tauriWindow.__TAURI_INTERNALS__ !== 'undefined') {
    return true;
  }
  
  // Способ 3: Проверка userAgent (запасной вариант)
  if (typeof navigator !== 'undefined' && navigator.userAgent.includes('Tauri')) {
    return true;
  }
  
  return false;
}

export async function getServerUrl(): Promise<string> {
  // Для Ubuntu/localhost
  return 'http://localhost:8000';
}

export async function shouldUseMock(): Promise<boolean> {
  // Используем моки только в браузере (не в Tauri)
  return !isTauri();
}

// Дополнительная функция для использования Tauri API если доступен
export async function invokeTauriCommand<T>(command: string, args?: any): Promise<T> {
  if (isTauri()) {
    // Динамический импорт, чтобы не было ошибок в браузере
    const { invoke } = await import('@tauri-apps/api/core');
    return await invoke(command, args);
  }
  throw new Error('Tauri API not available in browser');
}