// Utility function to add a message to the database
export const createMessage = async (type: 'user' | 'bot', messageContent: string) => {
    const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message: messageContent })
    });

    const data = await response.json();
    return data;
};

export const createUserMessage = async (messageContent: string) => {
    return await createMessage('user', messageContent);
};

export const createBotMessage = async (messageContent: string) => {
    return await createMessage('bot', messageContent);
};


export const getAllMessages = async () => {
    const response = await fetch('/api/messages', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch messages.');
    }

    const data = await response.json();
    return data;
};


export const updateMessage = async (id: string, updatedContent: string) => {
    const response = await fetch('/api/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, message: updatedContent })
    });

    const data = await response.json();
    return data;
};

export const deleteMessage = async (id: string) => {
    const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE'
    });

    const data = await response.json();
    return data;
};
