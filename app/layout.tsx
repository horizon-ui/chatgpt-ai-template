'use client';
import React, { ReactNode } from 'react';
import { Box, Portal, useDisclosure } from '@chakra-ui/react';
import routes from '@/routes';
import Navbar from '@/components/navbar/NavbarAdmin';
import { getActiveNavbar } from '@/utils/navigation';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import '@/styles/App.css';
import '@/styles/Contact.css';
import '@/styles/Plugins.css';
import '@/styles/MiniCalendar.css';
import AppWrappers from './AppWrappers';

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [apiKey, setApiKey] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    const initialKey = localStorage.getItem('apiKey');
    console.log(initialKey);
    if (initialKey?.includes('sk-') && apiKey !== initialKey) {
      setApiKey(initialKey);
    }
  }, [apiKey]);

  return (
    <html lang="en">
      <body id={'root'}>
        <AppWrappers>
          {pathname?.includes('register') || pathname?.includes('sign-in') ? (
            children
          ) : (
            <Box>
              <Portal>
                <Box>
                  <Navbar
                    setApiKey={setApiKey}
                    onOpen={onOpen}
                    logoText={'Delfos'}
                    brandText={'Delfos'}
                    secondary={getActiveNavbar(routes, pathname)}
                  />
                </Box>
              </Portal>
              <Box
                mx="auto"
                minH="100vh"
              >
                {children}
              </Box>
            </Box>
          )}
        </AppWrappers>
      </body>
    </html>
  );
}
