document.addEventListener('DOMContentLoaded', () => {
	setupDynamicTextarea();
});

const inputStack = [];
let inputStackPtr = -1;

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

	textarea.addEventListener('keydown', async (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			inputStackPtr = inputStack.length - 1;
			setHistory(textarea.value);
			const commandResult = await window.electronAPI.runCliCommand(textarea.value);
			setHistory(commandResult, false);
			textarea.value = '';
			adjustHeight();
			window.scrollTo(0, document.body.scrollHeight);
		} else if (e.key === 'ArrowUp') {
			console.log(inputStack, inputStackPtr);
			e.preventDefault();
			textarea.value = inputStack[inputStackPtr]
			inputStackPtr === 0 ? inputStackPtr = 0 : inputStackPtr -= 1;
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			textarea.value = inputStack[inputStackPtr + 1] ?? ""
			inputStackPtr === (inputStack.length - 1) ? inputStackPtr = inputStackPtr : inputStackPtr += 1;
		} else if (e.metaKey && e.key === 'c') {
			//TODO: Need to pass this in to the runCliCommand
		}

	});
}

/**
* @param {string} command
* @param {boolean} [input=true]
* @returns {void}
*/
function setHistory(command, input = true) {
	const historyDiv = document.getElementById('history');

	if (input) {
		inputStack.push(command);
		inputStackPtr += 1;
	}

	historyDiv.innerHTML = historyDiv.innerHTML + `<div class="flex space-x-2"><p>${input ? '$' : '>'}</p><div class="resize-none w-full max-w-full wrap-break-word min-h-6 overflow-hidden border-none outline-none bg-transparent text-neutral-100 caret-zinc-900">${command}</div></div>`;
}


