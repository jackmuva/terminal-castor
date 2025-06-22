const { spawn } = require("child_process");
require('dotenv').config();

/**
 * @typedef {Object} AiResponse
 * @propery {string} explanation
 * @propery {string} [command]
 */

/** @param {string} english */
/** @returns {Promise<AiResponse>} */
function englishToCommand(english) {
	return new Promise((resolve, reject) => {
		fetch(process.env.CF_API + "/api/chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				system_instruction: {
					parts: [{
						text: `You are an assistant that teaches user how to use macOS terminal commands. 
						You have 5 rules:
						1) If the user is trying to perform an action, responses must be in a stringified json format: {command: <macOS terminal command>, explanation: <explanation for how the macOS terminal command works>} so it can be easily parsed with JSON.parse()
						2) If the user is asking a question, responses must be in a stringified json format:{explanation: <answer to the question>}
						3) If the user is trying to perform an action or asking a question with a specific CLI tool (i.e. git, vercel, tmux) and you need more information on that CLI tool, return a response with the stringified json: {cli_tool: <cli tool name>}
						4) All responses must either be in the json format from rule 1 or rule 2
						5) Do not delete files or directories, or use any rm command; you can tell a user how to delete, but only explain`
					}]
				},
				contents: [{
					parts: [{
						text: english
					}]
				}]
			})
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
				}
				return response.json();
			})
			.then(responseData => {
				if (!responseData?.candidates?.[0]?.content?.parts?.[0]?.text) {
					throw new Error('Invalid API response structure');
				}

				const text = responseData.candidates[0].content.parts[0].text.replaceAll("`", "").replace("json", "");

				let aiResponse;
				try {
					aiResponse = JSON.parse(text);
				} catch (parseError) {
					throw new Error(`Failed to parse AI response as JSON: ${parseError.message}. Response text: ${text}`);
				}

				// If CLI tool is needed, get additional context
				if (aiResponse.cli_tool) {
					console.log("using tool on", aiResponse.cli_tool);
					listCommandToolCall(english, aiResponse.cli_tool)
						.then(ragResponse => {
							resolve(ragResponse);
						})
						.catch(err => {
							reject(new Error(`listCommandToolCall failed: ${err.message}`));
						});
				} else {
					resolve(aiResponse);
				}
			})
			.catch(err => {
				reject(new Error(`englishToCommand failed: ${err.message}`));
			});
	});
}

/** 
* @param {string} cliToolName 
* @returns {Promise<string>}
*/
async function listHelp(cliToolName) {
	return new Promise((resolve, reject) => {
		const helpCommand = spawn(cliToolName, ["-h"], {
			shell: true
		});
		let output = '';

		helpCommand.stdout.on("data", (data) => {
			output += data.toString();
		});

		helpCommand.stderr.on("data", (data) => {
			resolve(data);
		});

		helpCommand.on("exit", (code) => {
			resolve(output);
		});

		helpCommand.on("error", (error) => {
			reject(error);
		});

	});
}


/** 
* @param {string} english 
* @param {string} cliToolName 
* @returns {Promise<AiResponse>}
*/
async function listCommandToolCall(english, cliToolName) {
	return listHelp(cliToolName)
		.then((cliToolContext) => {
			return new Promise((resolve, reject) => {
				fetch(process.env.CF_API + "/api/chat", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						system_instruction: {
							parts: [{
								text: `You are an assistant that teaches user how to use macOS terminal commands. 
						You have 4 rules:
						1) If the user is trying to perform an action, responses must be in a stringified json format: {command: <macOS terminal command>, explanation: <explanation for how the macOS terminal command works>} so it can be easily parsed with JSON.parse()
						2) If the user is asking a question, responses must be in a stringified json format:{explanation: <answer to the question>}
						3) All responses must either be in the json format from rule 1 or rule 2
						4) Do not delete files or directories, or use any rm command; you can tell a user how to delete, but only explain`
							}]
						},
						contents: [
							{
								role: "model",
								parts: [{
									text: `${cliToolContext}\nUse this information about ${cliToolName} to perform an action or answer a question`
								}]
							},
							{
								role: "user",
								parts: [{
									text: english
								}]
							}
						]
					})
				})
					.then(response => {
						if (!response.ok) {
							reject(new Error(`API request failed with status ${response.status}: ${response.statusText}`));
						} else {
							return response.json();
						}
					})
					.then(responseData => {
						if (!responseData?.candidates?.[0]?.content?.parts?.[0]?.text) {
							reject(new Error('Invalid API response structure'));
						}

						const text = responseData.candidates[0].content.parts[0].text.replaceAll("`", "").replace("json", "");

						try {
							const aiResponse = JSON.parse(text);
							resolve(aiResponse);
						} catch (parseError) {
							reject(new Error(`Failed to parse AI response as JSON: ${parseError.message}. Response text: ${text}`));
						}
					})
					.catch(err => {
						console.error("Error in listCommandToolCall:", err);
						reject(new Error(`listCommandToolCall failed: ${err.message}`));
					});
			});
		})
		.catch(err => {
			console.error("Error in listCommandToolCall:", err);
			reject(new Error(`listCommandToolCall failed: ${err.message}`));
		});;
}

module.exports = {
	englishToCommand: englishToCommand
};
