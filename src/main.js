const { app, BrowserWindow, ipcMain } = require('electron')
const pty = require('@lydell/node-pty');
const os = require("os");
var shell = os.platform() === "win32" ? "powershell.exe" : "bash";

let mainWindow = null;
let ptyProcess = null;
let currentCols = 80;
let currentRows = 30;

const createWindow = () => {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		}
	})
	mainWindow.loadFile('src/index.html')

	// Create pty process
	ptyProcess = pty.spawn(shell, [], {
		name: "xterm-color",
		cols: currentCols,
		rows: currentRows,
		cwd: process.env.HOME,
		env: process.env
	});

	ptyProcess.on('data', function(data) {
		if (mainWindow && !mainWindow.isDestroyed()) {
			mainWindow.webContents.send("terminal.incomingData", data);
		}
	});

	// Handle window resize - trigger renderer to recalculate
	mainWindow.on('resize', () => {
		if (mainWindow && !mainWindow.isDestroyed()) {
			mainWindow.webContents.send("terminal.forceResize");
		}
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
		if (ptyProcess) {
			ptyProcess.kill();
			ptyProcess = null;
		}
	});
}

// IPC handlers (registered once)
ipcMain.on("terminal.keystroke", (event, key) => {
	if (ptyProcess) {
		ptyProcess.write(key);
	}
});

ipcMain.on("terminal.resize", (event, size) => {
	if (ptyProcess && (size.cols !== currentCols || size.rows !== currentRows)) {
		currentCols = size.cols;
		currentRows = size.rows;
		ptyProcess.resize(size.cols, size.rows);
		console.log(`Terminal resized to ${size.cols}x${size.rows}`);
	}
});

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

ipcMain.handle('quit', () => {
	app.quit()
});
