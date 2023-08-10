import { useState, useEffect } from 'react';
import { ChatBody, OpenAIModel } from '@/types/types';

export const chatGPT = async (inputCode: string, model: string,apiKey: string, setLoading : Function, addBotMessageToChatHistory : Function, setChatHistory : Function) => {
    const controller = new AbortController();
    let body: ChatBody = {
        inputCode,
        model,
        apiKey,
    };

    body = JSON.stringify(body);
    console.log(body);



    const response = await fetch('/api/chatAPI', {
        method: 'POST',
        headers: {
                'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: body,
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
}