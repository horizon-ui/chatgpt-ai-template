import { ChatBody, OpenAIModel } from '@/types/types';

type BotMessage = { type: 'bot', message: string };

export const chatGPT = async (
    inputCode: string,
    model: OpenAIModel, 
    apiKey: string,
    setLoading: (loading: boolean) => void,
    addBotMessageToChatHistory: (message: string) => void,
    setChatHistory: (callback: (prev: BotMessage[]) => BotMessage[]) => void
) => {
    const controller = new AbortController();
    const body: ChatBody = {
        inputCode,
        model,
        apiKey,
    };

    const serializedBody = JSON.stringify(body);

    const response = await fetch('/api/chatAPI', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: serializedBody,
    });

    if (!response.ok) {
        setLoading(false);
        alert('Something went wrong when fetching from the API. Make sure to use a valid API key.');
        return;
    }

    const data = response.body;

    if (!data) {
        setLoading(false);
        alert('Something went wrong');
        return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();

    let fullResponse = "";

    // Add a temporary bot message that we'll update in real-time
    const tmpBotMessage: BotMessage = { type: 'bot', message: '' };
    addBotMessageToChatHistory(tmpBotMessage.message);

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunkValue = decoder.decode(value);
        fullResponse += chunkValue;

        // Update the temporary bot message in real-time
        tmpBotMessage.message = fullResponse;
        setChatHistory(prev => [...prev.slice(0, -1), tmpBotMessage]);
    }

    setLoading(false);
}
