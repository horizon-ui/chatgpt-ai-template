'use client';

// Project imports
import MessageBox  from '@/components/chat/MessageBox';
import MessageIcon from '@/components/chat/MessageIcon';
import { ChatMessageGroup, ColorPalette } from '@/types/types';

// Chakra imports
import {
  Box,
  Flex,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

// React imports
import { MdPerson } from 'react-icons/md';



/*
 * Chat Message Component
 */

export type MessageGroupProps = {
  messages:      ChatMessageGroup;
  colorPalettes: Record<string, ColorPalette>;
}

export function MessageGroup({ messages, colorPalettes }: MessageGroupProps) {

  // Check whether the current speaker is the user
  const isUserMessage = messages.speaker.name == 'Me';

  return (
    <Flex
      w="100%"
      direction={ isUserMessage ? 'row-reverse' : 'row' }
      mx="-20px"
    >

      {/* Icon */}
      <MessageIcon
        character    = { messages.speaker }
        icon         = { MdPerson }
        colorPalette = { isUserMessage ? colorPalettes.messages_user : colorPalettes.messages_ai }
      />
      {/* /Icon */}

      <Flex w="100%" direction="column" align={ isUserMessage ? "end" : "start" } gap="8px">

        {/* Character name */}
        <Text
          color={ colorPalettes.annotations.text }
          fontSize="x-small"
          mx="8px"
        >
          { messages.speaker.name_full }
        </Text>
        {/* /Character Name */}

        {/* Message Text(s) */}
        {
          messages.messages.map((message, key) => 
            <MessageBox
              key = { key }
              output       = { message }
              colorPalette = { isUserMessage ? colorPalettes.messages_user : colorPalettes.messages_ai }
            />
          )
        }
        {/* /Message Text(s) */}

      </Flex>
    </Flex>
  );
}



/* Export */
export default MessageGroup;
