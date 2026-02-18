const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Add features as needed
    ping: () => ipcRenderer.invoke('ping')
});
