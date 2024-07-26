'use client';

// Project imports
import LoginButton from '@/components/auth/LoginButton';

import { login } from '@/utils/auth';

// Chakra imports
import {
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';

// React imports
import React from 'react'



export default function LoginPage() {

  // When the login button is clicked, redirect to the SSO process
  const onClick = () => {
    login(`${process.env.API_DOMAIN}/auth/login`);
  };


  return (
    <Flex
      w="100%"
      h="100%"
      direction="column"
      pt={{ base: '70px', md: '0px' }}
      position="relative"
      alignItems="center"
      justifyContent="center"
    >
      <LoginButton
        text="Login with NetID"
        onClick={onClick}
        w="fit-content"
      />
    </Flex>
  );
}
