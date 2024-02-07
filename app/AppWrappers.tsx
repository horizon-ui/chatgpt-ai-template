'use client';
import React, { ReactNode } from 'react';
import '@/styles/App.css';
import '@/styles/Contact.css';
import '@/styles/Plugins.css';
import '@/styles/MiniCalendar.css';
import { ChakraProvider } from '@chakra-ui/react';

// import dynamic from 'next/dynamic';
import theme from '@/theme/theme';

const _NoSSR = ({ children }: any) => (
  <React.Fragment>{children}</React.Fragment>
);

// const NoSSR = dynamic(() => Promise.resolve(_NoSSR), {
//   ssr: false,
// });

export default function AppWrappers({ children }: { children: ReactNode }) {
  return (
    // <NoSSR>
    <ChakraProvider theme={theme}>{children}</ChakraProvider>
    // </NoSSR>
  );
}
