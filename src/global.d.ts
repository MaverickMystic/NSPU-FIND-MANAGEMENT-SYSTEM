// src/types/global.d.ts
export {}

declare global {
  const blob = new globalThis.Blob([buffer]);

  interface Window {
  
    electronAPI: {
      openFile: () => Promise<string | null>;
      readfile: (filepath:string) => Promise<Buffer | null>
      notify: (title: string, body: string) => void;
    };
  }
}
