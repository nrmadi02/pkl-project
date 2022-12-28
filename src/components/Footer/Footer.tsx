import {
  Box,
  chakra,
  Container,
  Flex,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  VisuallyHidden,
} from '@chakra-ui/react';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { ReactNode } from 'react';
import { NextPage } from 'next';
import Image from 'next/image';
import LogoSmabat from '../../assets/logo/logo-smabat.png'

const Logo = (props: any) => {
  return (
    <Flex alignItems='center' gap={['10px']}>
      <Image layout='fixed' loading='lazy' width={40} height={40} src={LogoSmabat} alt="_logo" />
      {/* <Text
        textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
        fontFamily={'heading'}
        color={useColorModeValue('gray.800', 'white')}
        fontWeight={'bold'}
        fontSize='20px'
      >
        SMABAT
      </Text> */}
    </Flex>
  );
};

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}>
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

const FooterHome: NextPage = () => {
  return (
    <Box
      bg={useColorModeValue('gray.100', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}>
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}>
        <Logo />
        <Text>© 2022 SMA Negeri 1 Bati-bati. All rights reserved</Text>
        <Stack direction={'row'} spacing={6}>
          {/* <SocialButton label={'Twitter'} href={'#'}>
            <FaTwitter />
          </SocialButton>
          <SocialButton label={'YouTube'} href={'#'}>
            <FaYoutube />
          </SocialButton>
          <SocialButton label={'Instagram'} href={'#'}>
            <FaInstagram />
          </SocialButton> */}
        </Stack>
      </Container>
    </Box>
  );
}

export default FooterHome