import { useState, useEffect } from 'react';
import { ChatBody, OpenAIModel } from '@/types/types';
import { handleCommands } from '@/utils/commands';
import { createUserMessage, createBotMessage, getAllMessages, updateMessage } from './messages';
import { v4 as uuidv4 } from 'uuid';

export const useChat = (apiKeyApp: string) => {
    const [chatHistory, setChatHistory] = useState<Array<{ id: string; type: 'user' | 'bot'; message: string }>>([]);
    const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
    const [inputCode, setInputCode] = useState<string>('');
    const [outputCode, setOutputCode] = useState<string>('');
    const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchChatHistory = async () => {
                try {
                    const messages = await getAllMessages();
                    console.log(messages)
                    if (Array.isArray(messages)) {
                        setChatHistory(messages);
                    } else {
                        setChatHistory([]);
                    }
                } catch (error) {
                    console.error("Failed to fetch chat history from API:", error);
                    setChatHistory([]); // Default to empty array in case of error
                }
            };
    
        fetchChatHistory();
    }, []);
    

    useEffect(() => {
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }, [chatHistory]);

    const clearChatHistory = async () => {
        try {
            const response = await fetch('/api/messages?truncate=true', {
                method: 'DELETE'
            });
    
            if (!response.ok) {
                throw new Error('Failed to truncate chat history.');
            }
            
            setChatHistory([]);
        } catch (error) {
            console.error("Error clearing chat history:", error);
            // Here, you can handle any additional error logging or UI feedback.
        }
    };
    

    const addMessageToChatHistory = (type: 'user' | 'bot', message: string) => {
        const id = uuidv4(); 
        const newMessage = { id, type, message };
        setChatHistory(prev => [...prev, newMessage]);
        return id; 
    };
    

    const updateMessageById = (id: string, updatedMessage: string) => {
        setChatHistory(prev =>
            prev.map(message => (message.id === id ? { ...message, message: updatedMessage } : message))
        );
    };
    

    const addUserMessageToChatHistory = async (message: string) => {
        try {
            const savedMessage = await createUserMessage(message);
            // assuming your API returns the saved message with its ID and content
            const newMessage = {
                id: savedMessage.id, 
                type: 'user', 
                message: savedMessage.message
            };
            setChatHistory(prev => [...prev, newMessage]);
            return savedMessage.id;
        } catch (error) {
            console.error("Error adding user message:", error);
        }
    };
    
    const addBotMessageToChatHistory = async (message: string) => {
        try {
            const savedMessage = await createBotMessage(message);
            const newMessage = {
                id: savedMessage.id, 
                type: 'bot', 
                message: savedMessage.message
            };
            setChatHistory(prev => [...prev, newMessage]);
            return savedMessage.id;
        } catch (error) {
            console.error("Error adding bot message:", error);
        }
    };
    

    const handleChat = async () => {
        setInputOnSubmit(inputCode);
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


        setLoading(true);
        await addUserMessageToChatHistory(inputCode); 

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

        const id = await addBotMessageToChatHistory('<Loading>')
    
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
    
            const chunkValue = await decoder.decode(value);
            fullResponse += chunkValue;
            updateMessageById(id, fullResponse);
        }
        updateMessageById(id, fullResponse);
        await updateMessage(id, fullResponse);

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
