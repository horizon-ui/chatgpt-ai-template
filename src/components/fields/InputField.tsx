import React, { useState, ChangeEvent, KeyboardEvent, useEffect } from 'react';
import {
  Flex,
  FormLabel,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

interface AutocompleteInputProps {
  id?: string;
  label?: string;
  extra?: JSX.Element;
  placeholder?: string;
  type?: string;
  mb?: string;
  availableCommands: { name: string }[];
}

export default function AutocompleteInput(props: AutocompleteInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { availableCommands } = props;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault(); // Prevent default Tab behavior
      const matchingCommands = availableCommands.filter((command) =>
        command.name.startsWith(inputValue)
      );
      setSuggestions(matchingCommands.map((command) => command.name));
    }
  };

  useEffect(() => {
    if (suggestions.length > 0) {
      const selectedIndex = suggestions.findIndex((command) => command === inputValue);
      if (selectedIndex !== -1) {
        const nextIndex = (selectedIndex + 1) % suggestions.length;
        setInputValue(suggestions[nextIndex]);
      }
    }
  }, [suggestions, inputValue]);

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('navy.700', 'white');
  const searchColor = useColorModeValue('gray.700', 'white');
  const inputBg = useColorModeValue('transparent', 'navy.800');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' }
  );

  return (
    <Flex direction="column" mb={props.mb ? props.mb : '30px'}>
      <FormLabel
        display="flex"
        ms="10px"
        htmlFor={props.id}
        fontSize="sm"
        color={textColorPrimary}
        fontWeight="bold"
        _hover={{ cursor: 'pointer' }}
      >
        {props.label}
        <Text fontSize="sm" fontWeight="400" ms="2px">
          {props.extra}
        </Text>
      </FormLabel>
      <Input
        {...props}
        id={props.id}
        fontWeight="500"
        bg={inputBg}
        variant="main"
        fontSize="sm"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        placeholder={props.placeholder}
        _placeholder={placeholderColor}
        border="1px solid"
        color={searchColor}
        borderColor={useColorModeValue('gray.200', 'whiteAlpha.100')}
        borderRadius="12px"
        h="44px"
        maxH="44px"
      />
    </Flex>
  );
}
