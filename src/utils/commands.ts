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

let apiKey: string | null = localStorage.getItem('apiKey');

export const setApiKey = (key: string) => {
  apiKey = key;
  localStorage.setItem('apiKey', key);
};

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
    case '/chatGPT':
      const gptMessage = args.join(' ');
      fetchAndAddGPTResponse(gptMessage, addBotMessageToChatHistory);
      break;
		case '/commit':
				const commitMessage = "Generate a short commit message with one emoji at the beginning for the following changes " + args.join(' ');
				fetchAndAddGPTResponse(commitMessage, addBotMessageToChatHistory);
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

export async function fetchAndAddGPTResponse(
  message: string,
  addBotMessageToChatHistory: (message: string) => void
) {
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
    addBotMessageToChatHistory(completion);
  } catch (error) {
    console.error(error);
    addBotMessageToChatHistory('Error fetching from chat GPT');
  }
}
