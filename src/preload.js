const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	runCliCommand: (command) => ipcRenderer.invoke('run-cli-command', command),
	englishToCommand: (english) => ipcRenderer.invoke('english-to-command', english),
	quit: () => ipcRenderer.invoke('quit'),
})
