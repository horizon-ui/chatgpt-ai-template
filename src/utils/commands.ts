export const commands = [
  {
    name: 'list',
    description: 'Lists all available commands',
  },
	{
    name: 'clearChat',
    description: 'Clears the chat history',
  },
];

export const handleCommands = (
  commandText: string,
  setLoading: (loading: boolean) => void,
  addBotMessageToChatHistory: (message: string) => void,
  clearChatHistory: () => void
) => {
  const commandName = commandText.split(' ')[1];

  switch (commandName) {
    case 'clearChat':
      clearChatHistory();
      break;
    case 'list':
      addBotMessageToChatHistory(
        commands.map((command) => `${command.name}: ${command.description}`).join('\n')
      );
      break;
    default:
      addBotMessageToChatHistory('Unknown command');
  }

  setLoading(false);
};