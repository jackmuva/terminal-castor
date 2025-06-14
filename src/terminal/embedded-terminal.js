const { Terminal } = require("@xterm/xterm");

function spinUpTerminal() {
	return new Terminal();
}

class EmbeddedTerminal {
	/**
	* @protected
	* @type {Terminal}
	*/
	_terminal;

	constructor() {
		this._terminal = new Terminal();
	}

	open(element) {
		this._terminal.open(element);
	}

	write() {
		this._terminal.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
	}

}

module.exports = { spinUpTerminal: spinUpTerminal };
