import { MdBolt } from "react-icons/md";
import {
  Button,
  Flex,
  Icon,
  Input,
  useColorModeValue,
} from '@chakra-ui/react';

const ChatInput = ({ inputCode, setInputCode, handleTranslate, loading }) => {
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
    const inputColor = useColorModeValue('navy.700', 'white');
    const placeholderColor = useColorModeValue(
      { color: 'gray.500' },
      { color: 'whiteAlpha.600' },
    );
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          handleTranslate();
      }
    }
    const handleChange = (Event: any) => {
      setInputCode(Event.target.value);
    };
  
    return (
      <Flex
        bottom="0"
        left="0"
        right="0"
        ms={{ base: '0px', xl: '60px' }}
        mt="20px"
        justifySelf={'flex-end'}
        as="form"
        onSubmit={e => e.preventDefault()}
      >
        <Input
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
          placeholder="Type your message here..."
          onChange={handleChange}
          value={inputCode}
        />
        <Button
          type="submit"
          variant="primary"
          py="20px"
          px="16px"
          fontSize="sm"
          borderRadius="45px"
          ms="auto"
          w={{ base: '160px', md: '210px' }}
          h="54px"
          _hover={{
            boxShadow:
              '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
            bg:
              'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
            _disabled: {
              bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
            },
          }}
          isLoading={loading ? true : false}
          onClick={handleTranslate}
        >
          Submit
        </Button>
      </Flex>
    );
  };

export default ChatInput;