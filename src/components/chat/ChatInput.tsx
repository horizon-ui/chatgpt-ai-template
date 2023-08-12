import React, { FC, KeyboardEvent, ChangeEvent, useState } from 'react';
import { MdBolt } from 'react-icons/md';
import { Button, Flex, Icon, Input, useColorModeValue } from '@chakra-ui/react';
import { commands } from '@/utils/commands';

interface ChatInputProps {
  inputCode: string;
  setInputCode: (value: string) => void;
  handleChat: () => void;
  loading: boolean;
}

const ChatInput: FC<ChatInputProps> = ({
  inputCode,
  setInputCode,
  handleChat,
  loading,
}) => {
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' }
  );

  const [autoCompleteIndex, setAutoCompleteIndex] = useState<number>(-1);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleChat();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const matchingCommands = commands.filter((command) =>
        command.name.startsWith(inputCode.slice(1))
      );
      if (matchingCommands.length > 0) {
        if (autoCompleteIndex === -1) {
          // First tab press
          setAutoCompleteIndex(0);
          setInputCode(`/${matchingCommands[0].name}`);
        } else {
          // Subsequent tab presses
          const nextIndex = (autoCompleteIndex + 1) % matchingCommands.length;
          setAutoCompleteIndex(nextIndex);
          setInputCode(`/${matchingCommands[nextIndex].name}`);
        }
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputCode(value);

    if (value.startsWith('/')) {
      const matchingCommands = commands.filter((command) =>
        command.name.startsWith(value.slice(1))
      );
      if (matchingCommands.length > 0) {
        setAutoCompleteIndex(0);
      } else {
        setAutoCompleteIndex(-1);
      }
    } else {
      setAutoCompleteIndex(-1);
    }
  };

  return (
    <Flex
      position="relative"
      bottom="0"
      left="0"
      right="0"
      ms={{ base: '0px', xl: '60px' }}
      mt="20px"
      justifySelf={'flex-end'}
      as="form"
      onSubmit={(e) => e.preventDefault()}
    >
      <Input
        placeholder={
          autoCompleteIndex >= 0
            ? commands[autoCompleteIndex].name
            : 'Type your message here...'
        }
        onKeyDown={handleKeyDown}
        minH="54px"
        h="54px"
        border="1px solid"
        borderColor={borderColor}
        borderRadius="45px"
        p="15px 20px"
        me="10px"
        fontSize="sm"
        fontWeight="500"
        _focus={{ borderColor: 'none' }}
        color={inputColor}
        _placeholder={placeholderColor}
        onChange={handleChange}
        value={inputCode}
      />
      {/* ... (Button) */}
    </Flex>
  );
};

export default ChatInput;
