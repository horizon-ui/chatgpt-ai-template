'use client';

// Project imports
import { ColorPalette } from '@/types/types';

// Chakra imports
import {
  Button,
  Img,
  Text,
  useColorModeValue,
  ButtonProps
} from '@chakra-ui/react';

// React imports
import React from 'react'

import academicN from '/public/img/academic-n-purple.png';



/*
 * Login Button Component
 */

export type LoginButtonProps = {
  text:          string;
  colorPalette?: ColorPalette;
} & ButtonProps

export function LoginButton({ text, colorPalette, ...props }: LoginButtonProps) {

  // Change logo to white & transparent on hover
  // Adapted from https://stackoverflow.com/a/24224219
  const logoColorFilter = 'brightness(0) invert(1)';

  return (
    <Button
      // variant="primary"
      role="group"
      p="20px"
      h="auto"
      w="auto"
      fontSize="2xl"
      borderRadius="12px"
      color={ 'white' }
      bgColor={ 'purple.500' }
      _hover={{
        boxShadow:
          '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
        color: 'purple.500',
        bg: 'white',
      }}
      { ...props }
    >
      <Img
        src={ academicN.src }
        filter={ logoColorFilter }
        _groupHover={{ filter: 'none' }}
        transitionProperty="filter"
        transitionDuration="var(--chakra-transition-duration-normal)"
        width="32px"
        height="32px"
        me="16px"
      />
      <Text me="8px">{ text }</Text>
    </Button>
  );
}



export default LoginButton;
