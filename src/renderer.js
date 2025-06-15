const { Terminal } = require('@xterm/xterm');
const { FitAddon } = require('@xterm/addon-fit');
const ipcRenderer = require("electron").ipcRenderer;
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

const selectedTheme = draculaTheme;
const term = new Terminal({
	theme: selectedTheme
});
const fitAddon = new FitAddon();
term.loadAddon(fitAddon);

term.open(document.getElementById('terminal'));

const fitAndResize = () => {
	fitAddon.fit();
	const dims = fitAddon.proposeDimensions();
	if (dims) {
		// Send the actual dimensions to the main process
		ipcRenderer.send("terminal.resize", { cols: dims.cols, rows: dims.rows });
	}
};

setTimeout(() => {
	fitAndResize();
}, 100);

ipcRenderer.on("terminal.incomingData", (event, data) => {
	term.write(data);
});

term.onData(e => {
	ipcRenderer.send("terminal.keystroke", e);
});

window.addEventListener('resize', () => {
	setTimeout(() => {
		fitAndResize();
	}, 100);
});

ipcRenderer.on("terminal.forceResize", () => {
	setTimeout(() => {
		fitAndResize();
	}, 10);
});
