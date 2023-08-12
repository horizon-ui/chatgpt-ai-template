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
      const apiKey = localStorage.getItem('apiKey');

      if (!apiKey) {
        addBotMessageToChatHistory('API key not found in localStorage');
        break;
      }

      fetchChatGPT(gptMessage, apiKey)
        .then((response) => {
          addBotMessageToChatHistory(response);
        })
        .catch((error) => {
          console.error(error.message);
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

async function fetchChatGPT(message: string, apiKey: string) {
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
    return data.completion;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching from chat GPT');
  }
}

