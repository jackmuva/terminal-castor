const { Terminal } = require('@xterm/xterm');
const { FitAddon } = require('@xterm/addon-fit');
const ipc = require("electron").ipcRenderer;
const {
	currentTheme,
	draculaTheme,
	monokaiTheme,
	solarizedDarkTheme,
	oneDarkTheme,
	nordTheme,
	gruvboxDarkTheme,
	themes
} = require('./styles/terminal-theme.js');

// 🎨 Choose your theme here! 
// Available themes: currentTheme, draculaTheme, monokaiTheme, solarizedDarkTheme, oneDarkTheme, nordTheme, gruvboxDarkTheme
const selectedTheme = draculaTheme;

const term = new Terminal({
	theme: selectedTheme
});

const fitAddon = new FitAddon();
term.loadAddon(fitAddon);

term.open(document.getElementById('terminal'));

// Function to fit terminal and update pty size
const fitAndResize = () => {
	fitAddon.fit();
	const dims = fitAddon.proposeDimensions();
	if (dims) {
		// Send the actual dimensions to the main process
		ipc.send("terminal.resize", { cols: dims.cols, rows: dims.rows });
	}
};

// Fit terminal to container initially
setTimeout(() => {
	fitAndResize();
}, 100);

ipc.on("terminal.incomingData", (event, data) => {
	term.write(data);
});

term.onData(e => {
	ipc.send("terminal.keystroke", e);
});

// Handle window resize events
window.addEventListener('resize', () => {
	setTimeout(() => {
		fitAndResize();
	}, 100);
});

// Handle explicit resize requests from main process
ipc.on("terminal.forceResize", () => {
	setTimeout(() => {
		fitAndResize();
	}, 10);
});
