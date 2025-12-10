export {};

declare global {
  interface Window {
    __TAURI__?: {
      invoke: (command: string, args?: any) => Promise<any>;
      [key: string]: any;
    };
    __TAURI_INTERNALS__?: {
      [key: string]: any;
    };
  }
}