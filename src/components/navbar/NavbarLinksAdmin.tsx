'use client';

// Chakra Imports
import {
  Flex,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';

// Project imports
import { SearchBar } from '@/components/navbar/searchBar/SearchBar';
import { SidebarResponsive } from '@/components/sidebar/Sidebar';
import APIModal from '@/components/apiModal';
import ButtonInfo from '@/components/navbar/ButtonInfo'
import ButtonColorMode from '@/components/navbar/ButtonColorMode'
import ButtonUser from '@/components/navbar/ButtonUser'
import { IRoute } from '@/types/navigation';



export default function HeaderLinks(props: {
  routes:    IRoute[];
  secondary: boolean;
  setApiKey: any;
}) {
  const { routes, secondary, setApiKey } = props;
  const { colorMode, toggleColorMode } = useColorMode();

  // Chakra Color Mode
  const navbarIcon = useColorModeValue('gray.500', 'white');
  let menuBg = useColorModeValue('white', 'purple.800');
  const textColor = useColorModeValue('purple.700', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '0px 41px 75px purple.900',
  );
  const buttonBg = useColorModeValue('transparent', 'purple.800');
  const hoverButton = useColorModeValue(
    { bg: 'gray.100' },
    { bg: 'whiteAlpha.100' },
  );
  const activeButton = useColorModeValue(
    { bg: 'gray.200' },
    { bg: 'whiteAlpha.200' },
  );

  return (
    <Flex
      zIndex="100"
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      <SearchBar
        mb={() => {
          if (secondary) {
            return { base: '10px', md: 'unset' };
          }
          return 'unset';
        }}
        me="10px"
        borderRadius="30px"
      />
      <SidebarResponsive routes={routes} />

      {/* Info */}
      {/* <ButtonInfo /> */}

      {/* Color Mode */}
      <ButtonColorMode
        onClick   = { toggleColorMode }
        color     = { navbarIcon }
        colorMode = { colorMode }
      />

      {/* User Dropdown */}
      {/* <ButtonUser /> */}
    </Flex>
  );
}
