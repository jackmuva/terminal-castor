const { spawn } = require("child_process");
require('dotenv').config();

/** @param {string} english */
/** @returns {Promise<Object>} */
function englishToCommand(english) {
	return new Promise((resolve, reject) => {
		fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${process.env.GEMINI_API_KEY}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				system_instruction: {
					parts: [{
						text: `You are an assistant that teaches user how to use macOS terminal commands. 
						You have 3 rules:
						1) If the user is trying to perform an action, responses must be in a stringified json format: {command: <macOS terminal command>, 
						explanation: <explanation for how the macOS terminal command works>}
						so it can be easily parsed with JSON.parse()
						2) If the user is asking a question, responses must be in a stringified json format:{ 
						explanation: <answer to the question>}
						3) Do not delete files or directories, or use any rm command`
					}]
				},
				contents: [{
					parts: [{
						text: english
					}]
				}]
			})
		})
			.then(request => request.json())
			.then(response => {
				const text = response.candidates[0].content.parts[0].text.replaceAll("`", "").replace("json", "");
				console.log(JSON.parse(text));
				const aiResponse = JSON.parse(text);
				resolve(aiResponse);
			})
			.catch(err => reject(err));
	});
}

/**
* @param {string} command
* @returns {Promise<string>} Promise that resolves with the command output as string
*/
function runCliCommand(command) {
	return new Promise((resolve, reject) => {
		const cliCommand = spawn(command, { shell: true });

		let outputBuffers = [];
		let errorBuffers = [];

		cliCommand.stdout.on("data", data => {
			console.log(`stdout: ${data.toString()}`);
			outputBuffers.push(data);
		});

		cliCommand.stderr.on("data", data => {
			console.log(`stderr: ${data.toString()}`);
			errorBuffers.push(data);
		});

		cliCommand.on('error', (error) => {
			console.log(`error: ${error.message}`);
			//reject(error);
		});

		cliCommand.on("close", code => {
			console.log(`child process exited with code ${code}`);
			if (code === 0) {
				resolve(Buffer.concat(outputBuffers).toString());
			} else {
				const errorBuffer = Buffer.concat(errorBuffers);
				resolve("[ERROR]" + errorBuffer.toString());
				//reject(new Error(`Command failed with exit code ${code}\n${errorBuffer.toString()}`));
			}
		});
	});
}

module.exports = {
	runCliCommand: runCliCommand,
	englishToCommand: englishToCommand
};
