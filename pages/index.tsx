/*eslint-disable*/

import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/chat');
  }, []);
  return <Flex w="100%" direction="column" position="relative"></Flex>;
}
