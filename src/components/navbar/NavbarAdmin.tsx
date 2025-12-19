'use client';
/* eslint-disable */
// Chakra Imports
import {
  Box,
  Flex,
  Img,
  Link,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import AdminNavbarLinks from './NavbarLinksAdmin';
import { isWindowAvailable } from '@/utils/navigation';

export default function AdminNavbar(props: {
  secondary: boolean;
  brandText: string;
  logoText: string;
  onOpen: (...args: any[]) => any;
  setApiKey: any;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    isWindowAvailable() && window.addEventListener('scroll', changeNavbar);

    return () => {
      isWindowAvailable() && window.removeEventListener('scroll', changeNavbar);
    };
  });

  const { secondary, brandText, setApiKey } = props;

  // Here are all the props that may change depending on navbar's type or state.(secondary, variant, scrolled)
  const brandColor = '#0F4C9B';
  let mainText = useColorModeValue(brandColor, 'white');
  let secondaryText = useColorModeValue('gray.600', 'white');
  let navbarPosition = 'fixed' as const;
  let navbarFilter = 'none';
  let navbarBackdrop = 'none';
  let navbarShadow = '0 8px 24px rgba(15, 76, 155, 0.08)';
  let navbarBg = useColorModeValue('white', 'navy.900');
  let navbarBorder = useColorModeValue('gray.200', 'whiteAlpha.200');
  let secondaryMargin = '0px';
  let gap = '0px';
  const changeNavbar = () => {
    if (isWindowAvailable() && window.scrollY > 1) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  return (
    <Box
      zIndex="100"
      position={navbarPosition}
      boxShadow={navbarShadow}
      bg={navbarBg}
      borderColor={navbarBorder}
      filter={navbarFilter}
      backdropFilter={navbarBackdrop}
      borderWidth="1px"
      borderStyle="solid"
      alignItems={{ xl: 'center' }}
      display={secondary ? 'block' : 'flex'}
      minH="75px"
      justifyContent={{ xl: 'center' }}
      lineHeight="25.6px"
      w="100%"
      top="0"
      left="0"
      right="0"
      px={{ base: '16px', md: '32px' }}
      py="10px"
    >
      <Flex
        w="100%"
        maxW="100%"
        mx="0"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex direction="column" gap="6px">
          <Img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Logo_bancosAval.png/1200px-Logo_bancosAval.png"
            alt="Grupo Aval"
            h="30px"
            w="auto"
            objectFit="contain"
          />
          <Box>
            <Link
              color={mainText}
              href="#"
              bg="inherit"
              borderRadius="inherit"
              fontWeight="bold"
              fontSize="30px"
              p="0px"
              _hover={{ color: mainText }}
              _active={{
                bg: 'inherit',
                transform: 'none',
                borderColor: 'transparent',
              }}
              _focus={{
                boxShadow: 'none',
              }}
            >
              {brandText}
            </Link>
          </Box>
        </Flex>
        <Box ms="auto" w={{ sm: '100%', md: 'unset' }}>
          <AdminNavbarLinks setApiKey={setApiKey} secondary={props.secondary} />
        </Box>
      </Flex>
    </Box>
  );
}
