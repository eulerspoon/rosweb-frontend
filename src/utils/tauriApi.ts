// Простая версия для mock режима
export async function getServerUrl(): Promise<string> {
  return 'mock';
}

export function isTauri(): boolean {
  return false; // Пока отключим Tauri функции
}

export async function shouldUseMock(): Promise<boolean> {
  return true; // Всегда используем mock для начала
}