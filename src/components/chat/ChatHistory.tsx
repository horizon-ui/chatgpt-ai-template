import {
	Typography,
	Table,
	TableCell,
	Paper,
	styled,
	useTheme
  } from '@mui/material';
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
  
  type ChatType = {
	type: 'user' | 'bot';
	message: string;
  };

  type CodeComponentProps = {
    inline?: boolean;
    children: React.ReactNode;
	};
  

  const MarkdownContent = styled('div')(({ theme }) => ({
	whiteSpace: 'pre-wrap'
  }));
  
  const CodeBlock = styled('div')(({ theme }) => ({
	padding: theme.spacing(2),
	background: theme.palette.grey[300],
	overflowX: 'auto'
  }));
  
  const InlineCode = styled('code')(({ theme }) => ({
	padding: theme.spacing(0.5),
	background: theme.palette.grey[200],
	borderRadius: theme.shape.borderRadius,
	color: "#000"
  }));
  
  //@ts-ignore
  const ChatHistory = ({ chatHistory, handleCopy }) => {
	const theme = useTheme();
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
	const brandColor = useColorModeValue('brand.500', 'white');
	const gray = useColorModeValue('gray.500', 'white');
	const textColor = useColorModeValue('navy.700', 'white');
  
	const MarkdownComponents = () => {
		return {
			h1: ({ ...props }) => <Typography variant="h3" gutterBottom {...props} sx={{ whiteSpace: 'pre-wrap' }} />,
			h2: ({ ...props }) => <Typography variant="h4" gutterBottom {...props} sx={{ whiteSpace: 'pre-wrap' }} />,
			h3: ({ ...props }) => <Typography variant="h5" gutterBottom {...props} sx={{ whiteSpace: 'pre-wrap' }} />,
			p: ({ ...props }) => <Typography paragraph {...props} sx={{ whiteSpace: 'pre-wrap' }} />,
			//@ts-ignore
			table: ({ children, ...props }) => (
				<Paper sx={{ overflow: 'hidden', whiteSpace: 'pre-wrap' }}>
					<Table {...props}>{children}</Table>
				</Paper>
			),
			th: ({ ...props }) => <TableCell {...props} sx={{ whiteSpace: 'pre-wrap' }} />,
			td: ({ ...props }) => <TableCell {...props} sx={{ whiteSpace: 'pre-wrap' }} />,
			code: ({ inline, children }: CodeComponentProps) => {
				if (!children || (typeof children === 'string' && !children.trim())) {
					return null; 
				}
	
				if (inline) {
					return (
						//@ts-ignore
						<code sx={{
							padding: 0.5,
							//@ts-ignore
							background: theme => theme.palette.grey[200],
							borderRadius: 1,
							color: "#000",
						}}>
							{children}
						</code>
					);
				}
				let content = '...';

				if (typeof children === 'string') {
					content = children;
				}
	
				//@ts-ignore
				return (
					<Box sx={{ position: 'relative', marginBottom: '16px' }}>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
							<Icon as={MdFileCopy} onClick={() => handleCopy(children.toString())} />
						</Box>
						<SyntaxHighlighter style={dracula} language={"php"}>
							{content}
						</SyntaxHighlighter>
					</Box>
				);
			}
		};
	};
	
  
	const components = MarkdownComponents();
  //@ts-ignore
	return (
	  <>
		{chatHistory.map((chat: ChatType, index: number) => (
		  <Flex key={index} w="100%" align={'center'} mb="10px">
			<Flex
			  borderRadius="full"
			  justify="center"
			  align="center"
			  bg={
				chat.type === 'user'
				  ? 'transparent'
				  : 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'
			  }
			  me="20px"
			  h="40px"
			  minH="40px"
			  minW="40px"
			>
			  <Icon
				as={chat.type === 'user' ? MdPerson : MdAutoAwesome}
				width="20px"
				height="20px"
				color={chat.type === 'user' ? brandColor : 'white'}
			  />
			</Flex>
			<Flex
			  p="22px"
			  border="1px solid"
			  borderColor={borderColor}
			  borderRadius="14px"
			  w="100%"
			  zIndex={'2'}
			>
			  <Text
				color={textColor}
				fontWeight="600"
				fontSize={{ base: 'sm', md: 'md' }}
				lineHeight={{ base: '24px', md: '26px' }}
			  >
				<ReactMarkdown components={components}>{chat.message}</ReactMarkdown>
			  </Text>
			  <Flex ms="auto" alignItems="center">
				{chat.type === 'user' && (
				  <Icon
					cursor="pointer"
					as={MdEdit}
					width="20px"
					height="20px"
					color={gray}
					ml={3}
				  />
				)}
				{chat.type === 'bot' && (
				  <Icon
					cursor="pointer"
					as={MdContentCopy}
					width="20px"
					height="20px"
					color={gray}
					ml={3}
					onClick={() => handleCopy(chat.message)}
				  />
				)}
			  </Flex>
			</Flex>
		  </Flex>
		))}
	  </>
	);
  };
  
  export default ChatHistory;
  