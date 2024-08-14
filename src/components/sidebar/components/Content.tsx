'use client';
// chakra imports
import {
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import NavLink from '@/components/link/NavLink';
//   Custom components
import avatarNU from '/public/img/avatars/nu.png';
import { NextAvatar } from '@/components/image/Avatar';
import APIModal from '@/components/apiModal';
import Brand from '@/components/sidebar/components/Brand';
import Links from '@/components/sidebar/components/Links';
import SidebarCard from '@/components/sidebar/components/SidebarCard';
import { RoundedChart } from '@/components/icons/Icons';
import { PropsWithChildren } from 'react';
import { IRoute } from '@/types/navigation';
import { IoMdPerson } from 'react-icons/io';
import { FiLogOut } from 'react-icons/fi';
import { LuHistory } from 'react-icons/lu';
import { MdOutlineManageAccounts, MdOutlineSettings } from 'react-icons/md';

// React imports
import { useEffect, useState } from 'react';

// Cookies
import { getCookie } from "cookies-next";



// FUNCTIONS

interface SidebarContent extends PropsWithChildren {
  routes: IRoute[];
  [x: string]: any;
}

function SidebarContent(props: SidebarContent) {
  const { routes, setApiKey } = props;
  const textColor = useColorModeValue('purple.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
  const bgColor = useColorModeValue('white', 'purple.700');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(12, 44, 55, 0.18)',
  );
  const iconColor = useColorModeValue('purple.700', 'white');
  const shadowPillBar = useColorModeValue(
    '4px 17px 40px 4px rgba(112, 144, 176, 0.08)',
    'none',
  );
  const gray = useColorModeValue('gray.500', 'white');


  // Retrieve user data from cookie
  const userData = JSON.parse( getCookie('userData') || '{}' )

  // Load username from cookies
  // Fill as an effect to avoid hydration error
  const [ username, setUsername ] = useState<string>('');
  useEffect(() => {
    setUsername( (userData['name_first'] || ['']).join(' ') )
  }, [])


  // SIDEBAR
  return (
    <Flex
      direction="column"
      height="100%"
      pt="20px"
      pb="26px"
      borderRadius="30px"
      maxW="285px"
      px="20px"
    >
      <Brand />

      <Stack direction="column" mb="auto" mt="8px">
        <Box ps="0px" pe={{ md: '0px', '2xl': '0px' }}>
          <Links routes={routes} />
        </Box>
      </Stack>

      <Flex
        mt="8px"
        justifyContent="center"
        alignItems="center"
        boxShadow={shadowPillBar}
        borderRadius="30px"
        p="14px"
      >
        <NextAvatar h="34px" w="34px" src={avatarNU} me="10px" />
        <Text color={textColor} fontSize="xs" fontWeight="600" me="10px" flexGrow={1}>
          { username }
        </Text>

        <Menu>
          <MenuButton
            as={Button}
            variant="transparent"
            aria-label=""
            border="1px solid"
            borderColor={borderColor}
            borderRadius="full"
            w="34px"
            h="34px"
            px="0px"
            p="0px"
            minW="34px"
            me="10px"
            justifyContent={'center'}
            alignItems="center"
            color={iconColor}
          >
            <Flex align="center" justifyContent="center">
              <Icon
                as={MdOutlineSettings}
                width="18px"
                height="18px"
                color="inherit"
              />
            </Flex>
          </MenuButton>
          <MenuList
            ms="-20px"
            py="25px"
            ps="20px"
            pe="20px"
            w="246px"
            borderRadius="16px"
            transform="translate(-19px, -12px)!important"
            border="0px"
            boxShadow={shadow}
            bg={bgColor}
          >
            <Box mb="30px">
              <Flex align="center" w="100%">
                <Icon
                  as={MdOutlineManageAccounts}
                  width="24px"
                  height="24px"
                  color={textColor}
                  me="12px"
                  opacity={'0.4'}
                />
                <Text
                  color={textColor}
                  fontWeight="500"
                  fontSize="sm"
                  opacity={'0.4'}
                >
                  Profile Settings
                </Text>
              </Flex>
            </Box>
            <Box mb="30px">
              <Flex align="center">
                <Icon
                  as={LuHistory}
                  width="24px"
                  height="24px"
                  color={textColor}
                  opacity="0.4"
                  me="12px"
                />
                <Text color={textColor} fontWeight="500" fontSize="sm" opacity="0.4">
                  History
                </Text>
              </Flex>
            </Box>
            <Box mb="30px">
              <Flex align="center">
                <Icon
                  as={RoundedChart}
                  width="24px"
                  height="24px"
                  color={textColor}
                  opacity="0.4"
                  me="12px"
                />
                <Text color={textColor} fontWeight="500" fontSize="sm" opacity="0.4">
                  Usage
                </Text>
              </Flex>
            </Box>
            <Box>
              <Flex align="center">
                <Icon
                  as={IoMdPerson}
                  width="24px"
                  height="24px"
                  color={textColor}
                  opacity="0.4"
                  me="12px"
                />
                <Text color={textColor} fontWeight="500" fontSize="sm" opacity="0.4">
                  My Plan
                </Text>
              </Flex>
            </Box>
          </MenuList>
        </Menu>

        <Button
          variant="transparent"
          border="1px solid"
          borderColor={borderColor}
          borderRadius="full"
          w="34px"
          h="34px"
          px="0px"
          minW="34px"
          justifyContent={'center'}
          alignItems="center"
        >
          <Icon as={FiLogOut} width="16px" height="16px" color="inherit" />
        </Button>
      </Flex>
    </Flex>
  );
}

export default SidebarContent;
