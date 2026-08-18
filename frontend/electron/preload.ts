import { contextBridge } from 'electron'

// API mínima e somente leitura. Nenhum canal de IPC é exposto ao renderer.
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: {
    electron: process.versions.electron,
    node: process.versions.node,
  },
})