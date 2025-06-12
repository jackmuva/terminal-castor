function setHistory(command) {
	const historyDiv = document.getElementById('history');

	historyDiv.innerHTML = historyDiv.innerHTML + `<div class="flex space-x-2"><p>$</p><div class="resize-none w-full max-w-full wrap-break-word min-h-6 overflow-hidden border-none outline-none bg-transparent text-neutral-100 caret-zinc-900">${command}</div></div>`;
}

document.addEventListener('DOMContentLoaded', () => {
	setupDynamicTextarea();
});

function setupDynamicTextarea() {
	const textarea = document.getElementById('command');
	if (!textarea) return;

	function adjustHeight() {
		textarea.style.height = 'auto';

		const minHeight = 24; // min-h-6 equivalent (1.5rem)
		const maxHeight = 200; // Max height to prevent excessive growth
		const newHeight = Math.max(Math.min(textarea.scrollHeight, maxHeight), minHeight);

		textarea.style.height = newHeight + 'px';

		if (textarea.scrollHeight > maxHeight) {
			textarea.style.overflowY = 'auto';
		} else {
			textarea.style.overflowY = 'hidden';
		}
	}

	textarea.addEventListener('input', adjustHeight);
	textarea.addEventListener('paste', () => {
		setTimeout(adjustHeight, 0);
	});

	adjustHeight();

	textarea.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			setHistory(textarea.value);
			textarea.value = '';
			adjustHeight();
		}
	});
}
