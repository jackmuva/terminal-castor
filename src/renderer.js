document.addEventListener('DOMContentLoaded', () => {
	setupDynamicTextarea();
});

const inputStack = [];
let inputStackPtr = -1;
let pathPtr = "./";

/** @returns {void} */
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
			const commandResult = await handleCommand(textarea.value, 0, 2);
			setHistory(commandResult, false);
			adjustHeight();
			const terminalDiv = document.getElementById("terminal-div");
			terminalDiv.scrollTop = terminalDiv.scrollHeight;
			const aiDiv = document.getElementById("ai-div");
			aiDiv.scrollTop = aiDiv.scrollHeight;
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

/** @param {string} command */
/** @param {number} [curDepth = 0]*/
/** @param {string} [maxDepth = 1]*/
/** @returns {Promise<string>} */
async function handleCommand(command, curDepth = 0, maxDepth = 1) {
	const textarea = document.getElementById('command');
	textarea.value = '';

	if (curDepth > maxDepth) {
		return "AI is stuck";
	}

	const commandResult = await window.electronAPI.runCliCommand(`cd ${pathPtr} && ${command}`)

	const keyword = command.split(' ')[0];
	if (keyword === 'cd' && commandResult.slice(0, 7) !== "[ERROR]") {
		const path = command.split(' ')[1];
		if (path === "~") {
			pathPtr = "~/";
		} else {
			pathPtr += path + "/"
		}
	}

	if (commandResult.slice(0, 7) !== "[ERROR]") {
		return commandResult;
	} else {
		const aiResponse = await window.electronAPI.englishToCommand(command);
		console.log(aiResponse);
		let aiCommandResult = ""
		const aiExplanation = document.getElementById('ai-explanation');
		if (aiResponse.command) {
			aiCommandResult = await handleCommand(aiResponse.command, curDepth + 1, maxDepth);

			aiExplanation.innerHTML = aiExplanation.innerHTML + `<div class="flex space-x-2"><p>*</p><div class="resize-none w-full max-w-full wrap-break-word min-h-6 overflow-hidden border-none outline-none bg-transparent text-neutral-100 caret-zinc-900">${aiResponse.command}</div></div>`;
		}


		aiExplanation.innerHTML = aiExplanation.innerHTML + `<div class="flex space-x-2"><p>^</p><div class="resize-none w-full max-w-full wrap-break-word min-h-6 overflow-hidden border-none outline-none bg-transparent text-neutral-100 caret-zinc-900">${aiResponse.explanation}</div></div>`;

		return aiCommandResult;
	}
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


