// useChat.ts

import { useState, useEffect } from 'react';
import { ChatBody, OpenAIModel } from '@/types/types';
import { handleCommands } from '@/utils/commands';

export const useChat = (apiKeyApp: string) => {
    const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'bot', message: string}>>([]);
    const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
    const [inputCode, setInputCode] = useState<string>('');
    const [outputCode, setOutputCode] = useState<string>('');
    const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo');
    const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const savedChatHistory = localStorage.getItem('chatHistory');
			if (savedChatHistory) {
				try {
					setChatHistory(JSON.parse(savedChatHistory));
				} catch (error) {
					console.error("Failed to parse chat history:", error);
				}
			}
		}
	}, []); 

    useEffect(() => {
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }, [chatHistory]);

    const clearChatHistory = () => {
        localStorage.removeItem('chatHistory');
        setChatHistory([]);
    }

    const addUserMessageToChatHistory = (message: string) => {
        setChatHistory(prev => [...prev, { type: 'user', message }]);
    };
    
    const addBotMessageToChatHistory = (message: string) => {
        setChatHistory(prev => [...prev, { type: 'bot', message }]);
    };    

    const handleChat = async () => {
        const apiKey = apiKeyApp;
        setInputOnSubmit(inputCode);

        const maxCodeLength = model === 'gpt-3.5-turbo' ? 60000 : 60000;

        if (!apiKeyApp?.includes('sk-') && !apiKey?.includes('sk-')) {
                alert('Please enter an API key.');
                return;
        }

        if (!inputCode) {
                alert('Please enter your message.');
                return;
        }

        if (inputCode.length > maxCodeLength) {
                alert(
                        `Please enter code less than ${maxCodeLength} characters. You are currently at ${inputCode.length} characters.`,
                );
                return;
        }

        addUserMessageToChatHistory(inputCode);
        setLoading(true);


        if (inputCode.startsWith('/')) {
            handleCommands(inputCode, setLoading, addBotMessageToChatHistory, clearChatHistory);
            setInputCode('');
            return; 
        }

        const controller = new AbortController();
        const body: ChatBody = {
                inputCode,
                model,
                apiKey,
        };

        const response = await fetch('/api/chatAPI', {
                method: 'POST',
                headers: {
                        'Content-Type': 'application/json',
                },
                signal: controller.signal,
                body: JSON.stringify(body),
        });

        if (!response.ok) {
                setLoading(false);
                alert(
                        'Something went wrong went fetching from the API. Make sure to use a valid API key.',
                );
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
        const tmpBotMessage = { type: 'bot', message: '' };
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
        setInputCode('');
    };

    return {
        chatHistory, 
        setChatHistory,
        inputOnSubmit, 
        setInputOnSubmit, 
        inputCode, 
        setInputCode, 
        outputCode, 
        setOutputCode, 
        model, 
        setModel, 
        loading, 
        setLoading, 
        clearChatHistory, 
        handleChat,
        addUserMessageToChatHistory,
        addBotMessageToChatHistory,
    };
}
