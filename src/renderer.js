const information = document.getElementById('info')
if (information) {
	information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`
}

document.addEventListener('DOMContentLoaded', () => {
	func();
	setupDynamicTextarea();
});

function setupDynamicTextarea() {
	const textarea = document.getElementById('command');
	if (!textarea) return;

	function adjustHeight() {
		textarea.style.height = 'auto';
		
		const minHeight = 24; // min-h-6 equivalent
		const maxHeight = 200; // Max height to prevent excessive growth
		const newHeight = Math.max(Math.min(textarea.scrollHeight, maxHeight), minHeight);
		
		textarea.style.height = newHeight + 'px';
	}

	textarea.addEventListener('input', adjustHeight);
	textarea.addEventListener('paste', () => {
		setTimeout(adjustHeight, 0);
	});

	adjustHeight();

	textarea.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			console.log('Command:', textarea.value);
			textarea.value = '';
			adjustHeight();
		}
	});
}
