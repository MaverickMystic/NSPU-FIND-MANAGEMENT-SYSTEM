// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// src/preload.ts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('env', {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_API_KEY
})
console.log("✅ Preload script loaded");

contextBridge.exposeInMainWorld("electronAPI", {
  openFile:()=>ipcRenderer.invoke("dialog:openFile"),
 readfile: (path: string) => ipcRenderer.invoke("readfile", path),
   notify: (title: string, body: string) => {
    ipcRenderer.send("show-notification", { title, body });
  },
})

