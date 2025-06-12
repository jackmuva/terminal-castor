const { spawn } = require("child_process");

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
				resolve(errorBuffer.toString());
				//reject(new Error(`Command failed with exit code ${code}\n${errorBuffer.toString()}`));
			}
		});
	});
}

module.exports = runCliCommand;
