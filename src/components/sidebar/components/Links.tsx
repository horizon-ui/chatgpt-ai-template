'use client';
/* eslint-disable */

// chakra imports
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  HStack,
  Text,
  List,
  Icon,
  ListItem,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaCircle } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
import NavLink from '@/components/link/NavLink';
import { IRoute } from '@/types/navigation';
import { PropsWithChildren, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface SidebarLinksProps extends PropsWithChildren {
  routes: IRoute[];
}

export function SidebarLinks(props: SidebarLinksProps) {
  //   Chakra color mode
  const pathname = usePathname();
  let activeColor = useColorModeValue('navy.700', 'white');
  let inactiveColor = useColorModeValue('gray.500', 'gray.500');
  let borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
  let activeIcon = useColorModeValue('brand.500', 'white');
  let iconColor = useColorModeValue('navy.700', 'white');

  const { routes } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = useCallback(
    (routeName: string) => {
      return pathname?.includes(routeName);
    },
    [pathname],
  );

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes: IRoute[]) => {
    return routes.map((route, key) => {
      if (route.collapse && !route.invisible) {
        return (
          <Accordion allowToggle key={key}>
            <AccordionItem border="none" mb="14px" key={key}>
              <AccordionButton
                display="flex"
                alignItems="center"
                mb="4px"
                justifyContent="center"
                _hover={{
                  bg: 'unset',
                }}
                _focus={{
                  boxShadow: 'none',
                }}
                borderRadius="8px"
                w="100%"
                py="0px"
                ms={0}
              >
                {route.icon ? (
                  <Flex align="center" justifyContent="space-between" w="100%">
                    <HStack
                      spacing={
                        activeRoute(route.path.toLowerCase()) ? '22px' : '26px'
                      }
                    >
                      <Flex
                        w="100%"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Box
                          color={
                            activeRoute(route.path.toLowerCase())
                              ? activeIcon
                              : inactiveColor
                          }
                          me="12px"
                          mt="6px"
                        >
                          {route.icon}
                        </Box>
                        <Text
                          me="auto"
                          color={
                            activeRoute(route.path.toLowerCase())
                              ? activeColor
                              : 'gray.500'
                          }
                          fontWeight="500"
                          letterSpacing="0px"
                          fontSize="sm"
                        >
                          {route.name}
                        </Text>
                      </Flex>
                    </HStack>
                    <AccordionIcon ms="auto" color={'gray.500'} />
                  </Flex>
                ) : (
                  <Flex pt="0px" pb="10px" alignItems="center" w="100%">
                    <HStack
                      spacing={
                        activeRoute(route.path.toLowerCase()) ? '22px' : '26px'
                      }
                      ps="32px"
                    >
                      <Text
                        me="auto"
                        color={
                          activeRoute(route.path.toLowerCase())
                            ? activeColor
                            : inactiveColor
                        }
                        fontWeight="500"
                        letterSpacing="0px"
                        fontSize="sm"
                      >
                        {route.name}
                      </Text>
                    </HStack>
                    <AccordionIcon ms="auto" color={'gray.500'} />
                  </Flex>
                )}
              </AccordionButton>
              <AccordionPanel py="0px" ps={'8px'}>
                <List>
                  {
                    route.icon && route.items
                      ? createLinks(route.items) // for bullet accordion links
                      : route.items
                      ? createAccordionLinks(route.items)
                      : '' // for non-bullet accordion links
                  }
                </List>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        );
      } else if (!route.invisible) {
        return (
          <>
            {route.icon ? (
              <Flex
                align="center"
                justifyContent="space-between"
                w="100%"
                maxW="100%"
                ps="17px"
                mb="0px"
              >
                <HStack
                  w="100%"
                  mb="14px"
                  spacing={
                    activeRoute(route.path.toLowerCase()) ? '22px' : '26px'
                  }
                >
                  <NavLink
                    href={route.layout ? route.layout + route.path : route.path}
                    key={key}
                    styles={{ width: '100%' }}
                  >
                    <Flex w="100%" alignItems="center" justifyContent="center">
                      <Box
                        color={
                          activeRoute(route.path.toLowerCase())
                            ? activeIcon
                            : inactiveColor
                        }
                        me="12px"
                        mt="6px"
                      >
                        {route.icon}
                      </Box>
                      <Text
                        me="auto"
                        color={
                          activeRoute(route.path.toLowerCase())
                            ? activeColor
                            : 'gray.500'
                        }
                        fontWeight="500"
                        letterSpacing="0px"
                        fontSize="sm"
                      >
                        {route.name}
                      </Text>
                      {route.rightElement ? (
                        <Flex
                          border="1px solid"
                          borderColor={borderColor}
                          borderRadius="full"
                          w="34px"
                          h="34px"
                          justify={'center'}
                          align="center"
                          color={iconColor}
                          ms="auto"
                          me="10px"
                        >
                          <Icon
                            as={IoMdAdd}
                            width="20px"
                            height="20px"
                            color="inherit"
                          />
                        </Flex>
                      ) : null}
                    </Flex>
                  </NavLink>
                </HStack>
              </Flex>
            ) : (
              <ListItem ms={0}>
                <Flex ps="32px" alignItems="center" mb="8px">
                  <NavLink
                    href={route.layout ? route.layout + route.path : route.path}
                    key={key}
                  >
                    <Text
                      color={
                        activeRoute(route.path.toLowerCase())
                          ? activeColor
                          : inactiveColor
                      }
                      fontWeight="500"
                      fontSize="xs"
                    >
                      {route.name}
                    </Text>
                  </NavLink>
                </Flex>
              </ListItem>
            )}
          </>
        );
      }
    });
  };
  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const createAccordionLinks = (routes: IRoute[]) => {
    return routes.map((route: IRoute, key: number) => {
      return (
        <ListItem
          ms="28px"
          display="flex"
          alignItems="center"
          mb="10px"
          key={key}
        >
          <NavLink href={route.layout + route.path} key={key}>
            <Icon w="6px" h="6px" me="8px" as={FaCircle} color={activeIcon} />
            <Text
              color={
                activeRoute(route.path.toLowerCase())
                  ? activeColor
                  : inactiveColor
              }
              fontWeight={
                activeRoute(route.path.toLowerCase()) ? 'bold' : 'normal'
              }
              fontSize="sm"
            >
              {route.name}
            </Text>
          </NavLink>
        </ListItem>
      );
    });
  };
  //  BRAND
  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;
