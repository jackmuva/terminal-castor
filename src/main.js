const { app, BrowserWindow, ipcMain } = require('electron')
const pty = require('@lydell/node-pty');
const os = require("os");
const { englishToCommand } = require('./ai/ai-cli-module.js');
var shell = os.platform() === "win32" ? "powershell.exe" : "bash";

/** @type {BrowserWindow} */
let mainWindow = null;
/** @type {import('@lydell/node-pty').IPty} */
let ptyProcess = null;
/** @type {number} */
let currentCols = 80;
/** @type {number} */
let currentRows = 30;
/** @type {string} */
let prevCommand = "";
/** @type {string} */
let curInput

//NOTE: IPC handlers
ipcMain.on("terminal.keystroke", (event, key) => {
	if (!ptyProcess) {
		return;
	} else if (key === '\r') {
		prevCommand = curInput.trim();
		curInput = '';
	} else if (key === '\u007F') {//backspace
		curInput = curInput.slice(0, -1);
	} else {
		curInput += key;
	}

	ptyProcess.write(key);

});

ipcMain.on("terminal.resize", (event, size) => {
	if (ptyProcess && (size.cols !== currentCols || size.rows !== currentRows)) {
		currentCols = size.cols;
		currentRows = size.rows;
		ptyProcess.resize(size.cols, size.rows);
	}
});

//NOTE: App handlers
app.whenReady().then(() => {
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	})

	setTimeout(() => {
		const startupMessage = {
			explanation: `try issuing a command like open x application, list files, go to a directory, or run x cli command)`
		};
		mainWindow.webContents.send("ai.incomingData", startupMessage);

		const secondMessage = {
			explanation: `or try asking a question on how to use the terminal`
		};
		mainWindow.webContents.send("ai.incomingData", secondMessage);
	}, 100);
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

//NOTE: Utility functions

/**
 * @param {string} line
 * @returns {boolean}
 */
const isBashError = (line) => {
	const errorPatterns = [
		/[^:]+: command not found/,
		/[^:]+: unknown command/,
		/.*: No such file or directory/,
		/.*: does not exist/,
		/.*: syntax error.*/i,
		/.*: invalid option -- .*/i,
		/.*: too many arguments/i,
		/.*: missing operand/i,
		/.*(failed|error|not found|not exist|unknown).*/i,
	];


	return errorPatterns.some((pattern) => pattern.test(line));
}

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

	ptyProcess = pty.spawn(shell, [], {
		name: "xterm-color",
		cols: currentCols,
		rows: currentRows,
		cwd: process.env.HOME,
		env: process.env
	});

	ptyProcess.onData((data) => {
		if (mainWindow && !mainWindow.isDestroyed()) {

			if (isBashError(data)) {
				ptyProcess.pause();
				englishToCommand(prevCommand).then((res) => {
					ptyProcess.resume();
					if (res.command) {
						ptyProcess.write(res.command)
					}
					mainWindow.webContents.send("ai.incomingData", res);
				});
			} else {
				mainWindow.webContents.send("terminal.incomingData", data);
			}
		}

	});

	ptyProcess.onExit(() => {
		app.quit();
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


