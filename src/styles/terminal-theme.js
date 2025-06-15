// Terminal Color Themes
// Each theme contains all the color properties for xterm.js terminal

// Current: Dark theme matching your UI
const currentTheme = {
	background: '#18181b',        // Background color
	foreground: '#ffffff',        // Default text color
	cursor: '#ffffff',            // Cursor color
	cursorAccent: '#000000',      // Color of text under cursor
	selection: '#3e4451',         // Selection background
	selectionForeground: '#ffffff', // Selection text color (optional)
	black: '#000000',
	red: '#cd3131',
	green: '#0dbc79',
	yellow: '#e5e510',
	blue: '#2472c8',
	magenta: '#bc3fbc',
	cyan: '#11a8cd',
	white: '#e5e5e5',
	brightBlack: '#666666',
	brightRed: '#f14c4c',
	brightGreen: '#23d18b',
	brightYellow: '#f5f543',
	brightBlue: '#3b8eea',
	brightMagenta: '#d670d6',
	brightCyan: '#29b8db',
	brightWhite: '#ffffff',
};

// Dracula theme - Popular purple/pink theme
const draculaTheme = {
	background: '#282a36',
	foreground: '#f8f8f2',
	cursor: '#f8f8f0',
	selection: '#44475a',
	black: '#000000',
	red: '#ff5555',
	green: '#50fa7b',
	yellow: '#f1fa8c',
	blue: '#bd93f9',
	magenta: '#ff79c6',
	cyan: '#8be9fd',
	white: '#bfbfbf',
	brightBlack: '#4d4d4d',
	brightRed: '#ff6e67',
	brightGreen: '#5af78e',
	brightYellow: '#f4f99d',
	brightBlue: '#caa9fa',
	brightMagenta: '#ff92d0',
	brightCyan: '#9aedfe',
	brightWhite: '#e6e6e6',
};

// Monokai theme - Classic green/yellow coding theme
const monokaiTheme = {
	background: '#272822',
	foreground: '#f8f8f2',
	cursor: '#f8f8f0',
	selection: '#49483e',
	black: '#272822',
	red: '#f92672',
	green: '#a6e22e',
	yellow: '#f4bf75',
	blue: '#66d9ef',
	magenta: '#ae81ff',
	cyan: '#a1efe4',
	white: '#f8f8f2',
	brightBlack: '#75715e',
	brightRed: '#f92672',
	brightGreen: '#a6e22e',
	brightYellow: '#f4bf75',
	brightBlue: '#66d9ef',
	brightMagenta: '#ae81ff',
	brightCyan: '#a1efe4',
	brightWhite: '#f9f8f5',
};

// Solarized Dark theme - Professional blue-tinted theme
const solarizedDarkTheme = {
	background: '#002b36',
	foreground: '#839496',
	cursor: '#93a1a1',
	selection: '#073642',
	black: '#073642',
	red: '#dc322f',
	green: '#859900',
	yellow: '#b58900',
	blue: '#268bd2',
	magenta: '#d33682',
	cyan: '#2aa198',
	white: '#eee8d5',
	brightBlack: '#002b36',
	brightRed: '#cb4b16',
	brightGreen: '#586e75',
	brightYellow: '#657b83',
	brightBlue: '#839496',
	brightMagenta: '#6c71c4',
	brightCyan: '#93a1a1',
	brightWhite: '#fdf6e3',
};

// One Dark theme - VS Code's default dark theme
const oneDarkTheme = {
	background: '#1e2127',
	foreground: '#abb2bf',
	cursor: '#528bff',
	selection: '#3e4451',
	black: '#1e2127',
	red: '#e06c75',
	green: '#98c379',
	yellow: '#d19a66',
	blue: '#61afef',
	magenta: '#c678dd',
	cyan: '#56b6c2',
	white: '#abb2bf',
	brightBlack: '#5c6370',
	brightRed: '#e06c75',
	brightGreen: '#98c379',
	brightYellow: '#d19a66',
	brightBlue: '#61afef',
	brightMagenta: '#c678dd',
	brightCyan: '#56b6c2',
	brightWhite: '#ffffff',
};

// Nord theme - Cool blue/gray theme
const nordTheme = {
	background: '#2e3440',
	foreground: '#d8dee9',
	cursor: '#d8dee9',
	selection: '#4c566a',
	black: '#3b4252',
	red: '#bf616a',
	green: '#a3be8c',
	yellow: '#ebcb8b',
	blue: '#81a1c1',
	magenta: '#b48ead',
	cyan: '#88c0d0',
	white: '#e5e9f0',
	brightBlack: '#4c566a',
	brightRed: '#bf616a',
	brightGreen: '#a3be8c',
	brightYellow: '#ebcb8b',
	brightBlue: '#81a1c1',
	brightMagenta: '#b48ead',
	brightCyan: '#8fbcbb',
	brightWhite: '#eceff4',
};

// Gruvbox Dark theme - Retro warm colors
const gruvboxDarkTheme = {
	background: '#282828',
	foreground: '#ebdbb2',
	cursor: '#ebdbb2',
	selection: '#504945',
	black: '#282828',
	red: '#cc241d',
	green: '#98971a',
	yellow: '#d79921',
	blue: '#458588',
	magenta: '#b16286',
	cyan: '#689d6a',
	white: '#a89984',
	brightBlack: '#928374',
	brightRed: '#fb4934',
	brightGreen: '#b8bb26',
	brightYellow: '#fabd2f',
	brightBlue: '#83a598',
	brightMagenta: '#d3869b',
	brightCyan: '#8ec07c',
	brightWhite: '#ebdbb2',
};

// Export all themes
module.exports = {
	currentTheme,
	draculaTheme,
	monokaiTheme,
	solarizedDarkTheme,
	oneDarkTheme,
	nordTheme,
	gruvboxDarkTheme,

	// Export a themes object for easy iteration
	themes: {
		current: currentTheme,
		dracula: draculaTheme,
		monokai: monokaiTheme,
		solarizedDark: solarizedDarkTheme,
		oneDark: oneDarkTheme,
		nord: nordTheme,
		gruvboxDark: gruvboxDarkTheme,
	}
};
