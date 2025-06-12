const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	runCliCommand: (command) => ipcRenderer.invoke('run-cli-command', command),
	quit: () => ipcRenderer.invoke('quit'),
})
