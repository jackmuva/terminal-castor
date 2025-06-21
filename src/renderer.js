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

//NOTE: startup ops
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

//NOTE: DOM hooks
window.addEventListener('resize', () => {
	setTimeout(() => {
		fitAndResize();
	}, 100);
});



//NOTE: terminal hooks
//TODO: KEEP WORKING ON THE UP AND DOWN FUNCTRIONALITY
term.onData(key => {
	ipcRenderer.send("terminal.keystroke", key);
});

term.onData(key => {
	if (key === '\u001b[A') { // up arrow
		setTimeout(() => {
			const line = term.buffer.active.getLine(term.buffer.active.cursorY).translateToString();
			console.log(line);
			ipcRenderer.send("terminal.arrowKeys", line);
		}, 50);
	}
});



//NOTE: renderer hooks
ipcRenderer.on("terminal.incomingData", (event, data) => {
	term.write(data);
	const terminalDiv = document.getElementById("terminal");
	terminalDiv.scrollTop = terminalDiv.scrollHeight;
});

ipcRenderer.on("terminal.forceResize", () => {
	setTimeout(() => {
		fitAndResize();
	}, 10);
});

ipcRenderer.on("ai.incomingData", (event, data) => {
	const aiExplanation = document.getElementById('ai-explanation');
	if (data.command) {
		aiExplanation.innerHTML = aiExplanation.innerHTML + `<div class="flex space-x-2"><p>*</p><div class="resize-none w-full max-w-full wrap-break-word min-h-6 overflow-hidden border-none outline-none bg-transparent text-neutral-100 caret-zinc-900">${data.command}</div></div>`;
	}
	aiExplanation.innerHTML = aiExplanation.innerHTML + `<div class="flex space-x-2"><p>^</p><div class="resize-none w-full max-w-full wrap-break-word min-h-6 overflow-hidden border-none outline-none bg-transparent text-neutral-100 caret-zinc-900">${data.explanation}</div></div>`;

	const aiDiv = document.getElementById("ai-div");
	aiDiv.scrollTop = aiDiv.scrollHeight;
});
