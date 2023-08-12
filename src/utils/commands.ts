export const commands = [
  {
    name: 'help',
    description: 'Lists all available commands',
  },
  {
    name: 'clearChat',
    description: 'Clears the chat history',
  },
  {
    name: 'chatGPT',
    description: 'Fetches a response from chat GPT',
  },
	{
    name: 'commit',
    description: 'Generates a commit message',
  },
];

let apiKey: string | null = getApiKeyFromLocalStorage();

export const setApiKey = (key: string) => {
  apiKey = key;
  saveApiKeyToLocalStorage(key);
};

function getApiKeyFromLocalStorage(): string | null {
  try {
    return localStorage.getItem('apiKey');
  } catch (error) {
    // Handle error or fallback behavior if localStorage is not available
    return null;
  }
}

function saveApiKeyToLocalStorage(key: string) {
  try {
    localStorage.setItem('apiKey', key);
  } catch (error) {
    // Handle error or fallback behavior if localStorage is not available
  }
}

export const handleCommands = (
	commandText: string,
	setLoading: (loading: boolean) => void,
	addBotMessageToChatHistory: (message: string) => void,
	clearChatHistory: () => void
) => {
	const [commandName, ...args] = commandText.split(' ');

	if (apiKey === null) {
			addBotMessageToChatHistory('API key not found');
			setLoading(false);
			return;
	}

	switch (commandName) {
			case '/clearChat':
					clearChatHistory();
					break;
			case '/commit':
					handleCommitCommand(args, addBotMessageToChatHistory);
					break;
			case '/help':
					addBotMessageToChatHistory(
							commands.map((command) => `${command.name}: ${command.description}`).join('\n')
					);
					break;
			default:
					addBotMessageToChatHistory('Unknown command');
	}

	setLoading(false);
};


export function handleCommitCommand(args: string[], addBotMessageToChatHistory: (message: string) => void) {
	let commitMessage = "Generate a short commit message with one emoji at the beginning for the following changes " + args.join(' ');

	handleChatGPTCommand(commitMessage, apiKey)
			.then(completion => {
					addBotMessageToChatHistory("Here's your commit command with the personalized commit message : \n\n```sh \n\n" + 'git commit -m "' + completion + '"\n\n ```');
			})
			.catch(error => {
					console.error(error);
					addBotMessageToChatHistory('Error generating commit message');
			});
}




export async function handleChatGPTCommand(message: string, apiKey: string | null) {
	try {
			const response = await fetch('/api/completionAPI', {
					method: 'POST',
					headers: {
							'Content-Type': 'application/json',
					},
					body: JSON.stringify({ prompt: message, apiKey }), // Include the message and apiKey in the request body
			});

			if (!response.ok) {
					throw new Error('Failed to fetch chat GPT');
			}

			const data = await response.json();
			const completion = data.completion;
			return completion
	} catch (error) {
			console.error(error);
			return 'Error fetching from chat GPT'
	}
}
