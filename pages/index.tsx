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
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, makeStyles } from '@mui/material'; // Updated to MUI
import { useChat } from '@/utils/useChat';
import { handleCopy } from '@/utils/copy';

export default function Chat(props: { apiKeyApp: string }) {
	const { 
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
        handleChat 
    } = useChat(props.apiKeyApp);

	const { apiKeyApp } = props;
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
					handleChat={handleChat}
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
