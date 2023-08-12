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
];


export const handleCommands = (
  commandText: string,
  setLoading: (loading: boolean) => void,
  addBotMessageToChatHistory: (message: string) => void,
  clearChatHistory: () => void
) => {
  const [commandName, ...args] = commandText.split(' ');

  switch (commandName) {
    case '/clearChat':
      clearChatHistory();
      break;
		case '/chatGPT':
			const gptMessage = args.join(' ');
			fetchChatGPT(gptMessage).then(response => {
				addBotMessageToChatHistory(response);
			}).catch(error => {
				console.error(error.message)
				addBotMessageToChatHistory('Error fetching from chat GPT');
			});
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

async function fetchChatGPT(message: string) {
  const response = await fetch('/api/completionAPI', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch chat GPT');
  }

  const data = await response.json();
  return data.response; 
}