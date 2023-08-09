import { Flex, Icon } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/system";
import { MdAutoAwesome, MdBolt, MdEdit, MdPerson, MdContentCopy, MdFileCopy } from 'react-icons/md'; 

const ModelChange = ({ outputCode, model, setModel }) => {
		const buttonBg = useColorModeValue('white', 'whiteAlpha.100');
		const buttonShadow = useColorModeValue(
			'14px 27px 45px rgba(112, 144, 176, 0.2)',
			'none',
		);
		const textColor = useColorModeValue('navy.700', 'white');
		const bgIcon = useColorModeValue(
			'linear-gradient(180deg, #FBFBFF 0%, #CACAFF 100%)',
			'whiteAlpha.200',
		);
		const iconColor = useColorModeValue('brand.500', 'white');
	
		return (
			<Flex
				direction={'column'}
				w="100%"
				mb={outputCode ? '20px' : 'auto'}
			>
				<Flex
					mx="auto"
					zIndex="2"
					w="max-content"
					mb="20px"
					borderRadius="60px"
				>
					<Flex
						cursor={'pointer'}
						transition="0.3s"
						justify={'center'}
						align="center"
						bg={model === 'gpt-3.5-turbo' ? buttonBg : 'transparent'}
						w="174px"
						h="70px"
						boxShadow={model === 'gpt-3.5-turbo' ? buttonShadow : 'none'}
						borderRadius="14px"
						color={textColor}
						fontSize="18px"
						fontWeight={'700'}
						onClick={() => setModel('gpt-3.5-turbo')}
					>
						<Flex
							borderRadius="full"
							justify="center"
							align="center"
							bg={bgIcon}
							me="10px"
							h="39px"
							w="39px"
						>
							<Icon
								as={MdAutoAwesome}
								width="20px"
								height="20px"
								color={iconColor}
							/>
						</Flex>
						GPT-3.5
					</Flex>
					<Flex
						cursor={'pointer'}
						transition="0.3s"
						justify={'center'}
						align="center"
						bg={model === 'gpt-4' ? buttonBg : 'transparent'}
						w="164px"
						h="70px"
						boxShadow={model === 'gpt-4' ? buttonShadow : 'none'}
						borderRadius="14px"
						color={textColor}
						fontSize="18px"
						fontWeight={'700'}
						onClick={() => setModel('gpt-4')}
					>
						<Flex
							borderRadius="full"
							justify="center"
							align="center"
							bg={bgIcon}
							me="10px"
							h="39px"
							w="39px"
						>
							<Icon
								as={MdBolt}
								width="20px"
								height="20px"
								color={iconColor}
							/>
						</Flex>
						GPT-4
					</Flex>
				</Flex>
			</Flex>
		);
	};

export default ModelChange;