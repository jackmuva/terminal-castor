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
				const aiResponse = JSON.parse(text);
				resolve(aiResponse);
			})
			.catch(err => reject(err));
	});
}
module.exports = {
	englishToCommand: englishToCommand
};
