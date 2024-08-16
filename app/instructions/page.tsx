'use client';
/*eslint-disable*/

// Project imports
import Link from '@/components/link/Link';
import { NowTyping, ChatBeginning } from '@/components/chat/Annotations';
import ComposeInput from '@/components/chat/ComposeInput';
import { ColorPalette } from '@/types/types';

// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Img,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

// React imports
import { useEffect, useState } from 'react';

// Other
import { streamAIMessage } from '../../src/utils/streaming'




const APIDOMAIN = process.env.API_DOMAIN



//export default function Page(props: { apiKeyApp: string }) {
export default function Page() {

  // Input text
  const [ inputCode,  setInputCode  ] = useState<string>('');

  // Response message
  const [ outputCode, setOutputCode ] = useState<string[]>([]);

  // Chat states
  const [ loading,    setLoading    ] = useState<boolean>(false);
  const [ nowTyping,  setNowTyping  ] = useState<string>('');

  // API Key
  // const [apiKey, setApiKey] = useState<string>(apiKeyApp);

  const colors: ColorPalette = {
    brand:         useColorModeValue('brand.500', 'white'),
    gray:          useColorModeValue('gray.500',  'white'),
  }

  const colorPalettes: Record<string, ColorPalette> = {

    // Chat annotations
    annotations: {
      text:        useColorModeValue('gray.500',  'white'),
    },

    // Input bar
    input: {
      border:      useColorModeValue('gray.200',    'whiteAlpha.200'),
      text:        useColorModeValue('purple.700',  'white'),
      placeholder: useColorModeValue('gray.500',    'whiteAlpha.600'),
    },

    // AI chat messages
    messages_ai: {
      bg:          useColorModeValue('white',       'purple.800'),
      text:        useColorModeValue('purple.700',  'white'),
      icon_bg:     "linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)",
      icon_border: "transparent",
      icon_text:   "white",
    },

    // User chat messages
    messages_user: {
      bg:          useColorModeValue('purple.100',  'gray.100'),
      text:        useColorModeValue('purple.700',  'purple.700'),
      icon_bg:     "transparent",
      icon_border: useColorModeValue('gray.200',  'whiteAlpha.600'),
      icon_text:   useColorModeValue('brand.500', 'white'),
    }
  }


  const appendMessage = async (newMessage: any) => {
    setOutputCode((prevCode) => [...prevCode, newMessage]);
  }

  // Call the model
  const handleTranslate = async () => {

    // Chat post conditions(maximum number of characters, valid message etc.)
    const maxCodeLength = 700;

    // Validate input message
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

    // Add the user's message to the chat
    appendMessage({name: 'Me', text: inputCode})

    setLoading(true);
    const controller = new AbortController();


    // -------------- Fetch --------------

    // Send the user message to the API and stream the results
    streamAIMessage(
      `${APIDOMAIN}/api/message/test`,
      inputCode,

      // Additional request options
      {
        signal: controller.signal,
      },

      // The callback to process values as they stream in
      (value: any) => {
        if (value['type'] === 'DialogueMarker') {
          setNowTyping(() => value['name']);
        }
        else if (value['type'] === 'DialogueInstance') {
          appendMessage(value);
          setNowTyping(() => '');
        }
        else {
          console.warn('Unrecognized dialogue token: ', value)
        }
      }
    )
      // Runs after stream finishes
      .then(() => {
        setLoading(false);
      })

      // Runs if stream encounters an error
      .catch((error) => {
        setLoading(false);
        alert('Something went wrong.');
        console.error(error);
      })
  };


  // -------------- Copy Response --------------
  // const copyToClipboard = (text: string) => {
  //   const el = document.createElement('textarea');
  //   el.value = text;
  //   document.body.appendChild(el);
  //   el.select();
  //   document.execCommand('copy');
  //   document.body.removeChild(el);
  // };

  // *** Initializing apiKey with .env.local value
  // useEffect(() => {
  // ENV file verison
  // const apiKeyENV = process.env.NEXT_PUBLIC_OPENAI_API_KEY
  // if (apiKey === undefined || null) {
  //   setApiKey(apiKeyENV)
  // }
  // }, [])

  const handleChange = (Event: any) => {
    setInputCode(Event.target.value);
  };

  return (
    <Flex
      w="100%"
      pt={{ base: '70px', md: '0px' }}
      direction="column"
      position="relative"
    >
      
      <Box>
        <Text>Instructions go here</Text>
      </Box>
    </Flex>
  );
}
