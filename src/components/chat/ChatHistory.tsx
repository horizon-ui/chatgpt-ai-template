import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, makeStyles } from '@material-ui/core';
import { MdAutoAwesome, MdBolt, MdEdit, MdPerson, MdContentCopy, MdFileCopy } from 'react-icons/md'; 
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

const ChatHistory = ({ chatHistory, handleCopy }) => {
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
    const brandColor = useColorModeValue('brand.500', 'white');
    const gray = useColorModeValue('gray.500', 'white');
    const textColor = useColorModeValue('navy.700', 'white');
    const useStyles = makeStyles(theme => ({
      markdownContent: {
          whiteSpace: 'pre-wrap',
      },
      codeBlock: {
          padding: theme.spacing(2),
          background: theme.palette.grey[300],
          overflowX: 'auto',
      },
      inlineCode: {
          padding: theme.spacing(0.5),
          background: theme.palette.grey[200],
          borderRadius: theme.shape.borderRadius,
          color: "#000"
      },
  }));

const MarkdownComponents = () => {
      const classes = useStyles();

    return {
          h1: ({ ...props }) => <Typography variant="h3" gutterBottom {...props} className={classes.markdownContent} />,
          h2: ({ ...props }) => <Typography variant="h4" gutterBottom {...props} className={classes.markdownContent} />,
          h3: ({ ...props }) => <Typography variant="h5" gutterBottom {...props} className={classes.markdownContent} />,
          p: ({ ...props }) => <Typography paragraph {...props} className={classes.markdownContent} />,
        table: ({ children, ...props }) => (
              <Paper className={classes.markdownContent}  style={{ overflow: 'hidden' }}>
                  <Table className={classes.markdownContent}  {...props}>{children}</Table>
            </Paper>
        ),
          th: ({ ...props }) => <TableCell className={classes.markdownContent}  {...props} />,
          td: ({ ...props }) => <TableCell className={classes.markdownContent}  {...props} />,
        code: ({ inline, language, children, ...props }) => {
              // Check if children is empty or undefined
            if (!children || (typeof children === 'string' && !children.trim())) {
                  return null; // Don't render anything if children is empty or undefined
            } else if (Array.isArray(children) && !children.length) {
                return null;
            } else if (typeof children === 'object' && !Object.keys(children).length) {
                return null;
            }

            if (inline) {
                return <code sx={{
                    padding: 0.5,
                    background: theme => theme.palette.grey[200],
                    borderRadius: 1,
                    color: "#000",
                }} {...props}>{children}</code>;
            }

            return (
                <div sx={{ position: 'relative', marginBottom: '16px' }}>
                    <div sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
                        <Icon
                            as={MdFileCopy} // Assuming you're using this icon
                            sx={{ cursor: 'pointer' }}
                            onClick={() => handleCopy(children)}
                        />
                    </div>
                    <SyntaxHighlighter style={dracula} language={"php"}>
                        {children ?? '...'}
                    </SyntaxHighlighter>
                </div>
            );
        }
    };
  };

  const components = MarkdownComponents();
  
    return (
      <>
        {chatHistory.map((chat, index) => (
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