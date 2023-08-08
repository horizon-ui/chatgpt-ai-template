import ReactMarkdown from 'react-markdown'
import { useColorModeValue } from '@chakra-ui/react'
import Card from '@/components/card/Card'

export default function MessageBox({ output = '' }: { output?: string }) {
    const textColor = useColorModeValue('navy.700', 'white')

    if (!output) return null

    return (
        <Card
            px="22px"
            pl="22px"
            color={textColor}
            minH="450px"
            fontSize={{ base: 'sm', md: 'md' }}
            lineHeight={{ base: '24px', md: '26px' }}
            fontWeight="500"
        >
            <ReactMarkdown className="font-medium">
                {output}
            </ReactMarkdown>
        </Card>
    )
}
