import {
	Box,
	Flex,
	Icon,
	Text,
	useColorModeValue,
	Table,
	Td,
	Th,
	Tr
  } from '@chakra-ui/react';
  import {
	MdAutoAwesome,
	MdBolt,
	MdEdit,
	MdPerson,
	MdContentCopy,
	MdFileCopy
  } from 'react-icons/md';
  import ReactMarkdown from "react-markdown";
  import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
  import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
  
  type ChatType = {
	type: 'user' | 'bot';
	message: string;
  };
  
  type CodeComponentProps = {
	inline?: boolean;
	children: React.ReactNode;
  };
  
  const ChatHistory = ({ chatHistory, handleCopy }: any) => {
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
	const brandColor = useColorModeValue('brand.500', 'white');
	const gray = useColorModeValue('gray.500', 'white');
	const textColor = useColorModeValue('navy.700', 'white');
  
	const MarkdownComponents = {
	  h1: (props: any) => <Text as="h1" fontSize="2xl" fontWeight="bold" my={3} {...props} />,
	  h2: (props: any) => <Text as="h2" fontSize="xl" fontWeight="bold" my={2} {...props} />,
	  h3: (props: any) => <Text as="h3" fontSize="lg" fontWeight="bold" my={2} {...props} />,
	  p: (props: any) => <Text my={2} {...props} />,
	  table: Table,
	  th: Th,
	  td: Td,
	  tr: Tr,
	  code: ({ inline, children, ...props }: CodeComponentProps) => {
		if (!children || (typeof children === 'string' && !children.trim())) {
		  return null;
		}
  
		if (inline) {
		  return <Text as="code" px={1} bgColor="gray.200" borderRadius="md" {...props}>{children}</Text>;
		}
  
		const content = typeof children === 'string' ? children : '...';
  
		return (
		  <Box position="relative" my={4} {...props}>
			<Flex justifyContent="space-between" alignItems="center" borderBottom="1px solid" borderColor="gray.300" pb={1}>
			  <Icon as={MdFileCopy} onClick={() => handleCopy(content)} cursor="pointer" />
			</Flex>
			<SyntaxHighlighter style={dracula} language="php">
			  {content}
			</SyntaxHighlighter>
		  </Box>
		);
	  }
	};
  
	return (
	  <>
		{chatHistory.map((chat: ChatType, index: number) => (
		  <Flex key={index} w="100%" align="center" mb="10px">
			<Flex borderRadius="full" justify="center" align="center" bg={chat.type === 'user' ? 'transparent' : 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'} me="20px" h="40px" minH="40px" minW="40px">
			  <Icon as={chat.type === 'user' ? MdPerson : MdAutoAwesome} w="20px" h="20px" color={chat.type === 'user' ? brandColor : 'white'} />
			</Flex>
			<Flex p="22px" border="1px solid" borderColor={borderColor} borderRadius="14px" w="100%" zIndex={2}>
			  <Text color={textColor} fontWeight="600" fontSize={{ base: 'sm', md: 'md' }} lineHeight={{ base: '24px', md: '26px' }}>
				<ReactMarkdown components={MarkdownComponents}>{chat.message}</ReactMarkdown>
			  </Text>
			  <Flex ms="auto" alignItems="center">
				{chat.type === 'user' && (
				  <Icon cursor="pointer" as={MdEdit} w="20px" h="20px" color={gray} ml={3} />
				)}
				{chat.type === 'bot' && (
				  <Icon cursor="pointer" as={MdContentCopy} w="20px" h="20px" color={gray} ml={3} onClick={() => handleCopy(chat.message)} />
				)}
			  </Flex>
			</Flex>
		  </Flex>
		))}
	  </>
	);
  };
  
  export default ChatHistory;
  