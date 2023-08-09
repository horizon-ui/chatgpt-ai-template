'use client';
/*eslint-disable*/

import Link from '@/components/link/Link';
import MessageBoxChat from '@/components/MessageBox';
import ModelChange from '@/components/chat/ModelChange';
import ChatInput from '@/components/chat/ChatInput';
import ChatHistory from '@/components/chat/ChatHistory';
import { ChatBody, OpenAIModel } from '@/types/types';
import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Button,
	Flex,
	Icon,
	Image,
	Img,
	Input,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdAutoAwesome, MdBolt, MdEdit, MdPerson, MdContentCopy, MdFileCopy } from 'react-icons/md'; 
import Bg from '../public/img/chat/bg-image.png';
import ReactMarkdown from 'react-markdown'
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, makeStyles } from '@material-ui/core';

export default function Chat(props: { apiKeyApp: string }) {
	const { apiKeyApp } = props;
	const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'bot', message: string}>>([]);
	const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
	const [inputCode, setInputCode] = useState<string>('');
	const [outputCode, setOutputCode] = useState<string>('');
	const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo');
	const [loading, setLoading] = useState<boolean>(false);
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
	const inputColor = useColorModeValue('navy.700', 'white');
	const iconColor = useColorModeValue('brand.500', 'white');
	const bgIcon = useColorModeValue(
		'linear-gradient(180deg, #FBFBFF 0%, #CACAFF 100%)',
		'whiteAlpha.200',
	);
	const brandColor = useColorModeValue('brand.500', 'white');
	const buttonBg = useColorModeValue('white', 'whiteAlpha.100');
	const gray = useColorModeValue('gray.500', 'white');
	const buttonShadow = useColorModeValue(
		'14px 27px 45px rgba(112, 144, 176, 0.2)',
		'none',
	);
	const textColor = useColorModeValue('navy.700', 'white');
	const placeholderColor = useColorModeValue(
		{ color: 'gray.500' },
		{ color: 'whiteAlpha.600' },
	);

	useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedChatHistory = localStorage.getItem('chatHistory');
        if (savedChatHistory) {
            setChatHistory(JSON.parse(savedChatHistory));
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
	

	const handleCopy = (text) => {
			navigator.clipboard.writeText(text)
					.then(() => {
							alert('Text copied to clipboard!');
					})
					.catch(err => {
							alert('Failed to copy text. Try manually.');
							console.error('Failed to copy text: ', err);
					});
	};


	const handleTranslate = async () => {
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

			setChatHistory([...chatHistory, { type: 'user', message: inputCode }]);
			setLoading(true);
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
			setChatHistory(prev => [...prev, tmpBotMessage]);

			while (true) {
					const { value, done } = await reader.read();
					if (done) break;

					const chunkValue = decoder.decode(value);
					fullResponse += chunkValue;

					// Update the temporary bot message in real-time
					tmpBotMessage.message = fullResponse;
					setChatHistory(prev => [...prev.slice(0, -1), tmpBotMessage]); // overwrite last message
			}

			setLoading(false);
			setInputCode('');  // Clear the input value
	};



	// @ts-ignore
		return (
		<Flex
			w="100%"
			pt={{ base: '70px', md: '0px' }}
			direction="column"
			position="relative"
		>
			<Img
				src={Bg.src}
				position={'absolute'}
				w="350px"
				left="50%"
				top="50%"
				transform={'translate(-50%, -50%)'}
			/>
			<Flex
				direction="column"
				mx="auto"
				w={{ base: '100%', md: '100%', xl: '100%' }}
				minH={{ base: '75vh', '2xl': '85vh' }}
				maxW="1000px"
			>
				
				<ModelChange model={model} setModel={setModel} outputCode={outputCode} />
				<ChatHistory chatHistory={chatHistory} handleCopy={handleCopy} />
				<ChatInput
					inputCode={inputCode}
					setInputCode={setInputCode}
					handleTranslate={handleTranslate}
					loading={loading}
				/>

				<Flex
					justify="center"
					mt="20px"
					direction={{ base: 'column', md: 'row' }}
					alignItems="center"
				>
					<Text fontSize="xs" textAlign="center" color={gray}>
						Free Research Preview. ChatGPT may produce inaccurate information
						about people, places, or facts.
					</Text>
					<Link href="https://help.openai.com/en/articles/6825453-chatgpt-release-notes">
						<Text
							fontSize="xs"
							color={textColor}
							fontWeight="500"
							textDecoration="underline"
						>
							ChatGPT May 12 Version
						</Text>
					</Link>
				</Flex>
			</Flex>
		</Flex>
	);
}
