const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path');
const runCliCommand = require('./ai-cli-runner.js');

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	})

	win.loadFile('src/index.html')
}

app.whenReady().then(() => {
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

// Handle CLI command execution
ipcMain.handle('run-cli-command', async (event, command) => {
	console.log(event);
	return await runCliCommand(command);
});

ipcMain.handle('quit', () => {
	app.quit()
});
