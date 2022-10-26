import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  Spinner,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { NextPage } from 'next';
import { signOut, useSession } from 'next-auth/react';
import NextLink from 'next/link';
import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import ChakraNextLink from '../CakraLink';
import Image from 'next/image';
import Logo from '../../assets/logo/logo-smabat.png'

const Navbar: NextPage = () => {
  const router = useRouter()
  const toast = useToast()
  const { isOpen, onToggle } = useDisclosure();
  const { data } = useSession();
  const [loading, setLoading] = useState(false)

  const handleLogOut = async () => {
    await signOut({ redirect: false })
    setLoading(false)
    toast({
      title: 'Logout Berhasil',
      status: 'success',
      duration: 3000,
      position: 'top-right',
      isClosable: true,
    })
    setTimeout(() => {
      router.reload()
    }, 1000)
  }


  return (
    <div className='sticky top-0 z-[99]'>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}>
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} alignItems='center' justify={{ base: 'center', md: 'start' }}>
          <Flex alignItems='center' gap={['10px']}>
            <Image layout='fixed' loading='lazy' width={40} height={40} src={Logo} alt="_logo" />
            <Text
              textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
              fontFamily={'heading'}
              color={useColorModeValue('gray.800', 'white')}
              fontWeight={'bold'}
              fontSize='20px'
            >
              SMABAT
            </Text>
          </Flex>

          <Flex display={{ base: 'none', md: 'flex' }} ml={50}>
            <DesktopNav />
          </Flex>
        </Flex>
        {!data?.user?.name && <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>
          <NextLink href="/login">
            <Button
              fontSize={'sm'}
              fontWeight={600}
              color={'white'}
              bg={'orange.400'}
              _hover={{
                bg: 'orange.300',
              }}>
              Masuk
            </Button>
          </NextLink>
        </Stack>}
        {data?.user?.name && (
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}>
            <Menu>
              <MenuButton
                fontSize={{ base: "small", md: "medium" }}
                fontWeight={600}
              >
                {!loading && data?.user?.name}
                {loading && <Spinner color='orange.500' />}
              </MenuButton>
              <MenuList>
                <MenuItem _focus={{ color: "orange.500" }}>Admin</MenuItem>
                <MenuItem onClick={() => {
                  setLoading(true)
                  handleLogOut()
                }} _focus={{ color: "orange.500" }}>Log out</MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </div>
  );
}

const DesktopNav = () => {
  const router = useRouter()
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkActiveColor = useColorModeValue('orange.500', 'gray.200');
  const linkHoverColor = useColorModeValue('orange.500', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>

            {navItem.href == '/pelayanan' &&
              <PopoverTrigger>
                <Link
                  p={2}
                  fontSize={'sm'}
                  fontWeight={router.pathname == navItem.href || ((router.pathname.startsWith('/bimbingan') || router.pathname.startsWith('/pinjam')) && navItem.href == "/pelayanan") ? 600 : 500}
                  color={router.pathname == navItem.href || ((router.pathname.startsWith('/bimbingan') || router.pathname.startsWith('/pinjam')) && navItem.href == "/pelayanan") ? linkActiveColor : linkColor}
                  _hover={{
                    textDecoration: 'none',
                    color: linkHoverColor,
                  }}>
                  {navItem.label}

                </Link>
              </PopoverTrigger>}
            {navItem.href != '/pelayanan' && <ChakraNextLink
              href={navItem.href}
              p={2}
              fontSize={'sm'}
              fontWeight={router.pathname == navItem.href || ((router.pathname.startsWith('/bimbingan') || router.pathname.startsWith('/pinjam')) && navItem.href == "/pelayanan") ? 600 : 500}
              color={router.pathname == navItem.href || ((router.pathname.startsWith('/bimbingan') || router.pathname.startsWith('/pinjam')) && navItem.href == "/pelayanan") ? linkActiveColor : linkColor}
              _hover={{
                textDecoration: 'none',
                color: linkHoverColor,
              }}>
              {navItem.label}
            </ChakraNextLink>}

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}>
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <NextLink href={href}>
      <Link
        role={'group'}
        display={'block'}
        p={2}
        rounded={'md'}
        _hover={{ bg: useColorModeValue('orange.50', 'gray.900') }}>
        <Stack direction={'row'} align={'center'}>
          <Box>
            <Text
              transition={'all .3s ease'}
              _groupHover={{ color: 'orange.400' }}
              fontWeight={600}>
              {label}
            </Text>
            <Text fontSize={'sm'}>{subLabel}</Text>
          </Box>
          <Flex
            transition={'all .3s ease'}
            transform={'translateX(-10px)'}
            opacity={0}
            _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
            justify={'flex-end'}
            align={'center'}
            flex={1}>
            <Icon color={'orange.400'} w={5} h={5} as={ChevronRightIcon} />
          </Flex>
        </Stack>
      </Link>
    </NextLink>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      {href != '/pelayanan' && <NextLink href={href}>
        <Flex
          py={2}
          justify={'space-between'}
          align={'center'}
          _hover={{
            textDecoration: 'none',
          }}>
          <Text
            fontWeight={600}
            color={'gray.600'}>
            {label}
          </Text>
          {children && (
            <Icon
              as={ChevronDownIcon}
              transition={'all .25s ease-in-out'}
              transform={isOpen ? 'rotate(180deg)' : ''}
              w={6}
              h={6}
            />
          )}
        </Flex>
      </NextLink>}
      {href == '/pelayanan' && <Flex
        py={2}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}>
        <Text
          fontWeight={600}
          color={'gray.600'}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>}

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}>
          {children &&
            children.map((child) => (
              <ChakraNextLink key={child.label} py={2} href={child.href}>
                {child.label}
              </ChakraNextLink>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Pelayanan',
    children: [
      {
        label: 'Bimbingan BK',
        subLabel: 'Jadwalkan bimbingan siswa dengan BK',
        href: '/bimbingan',
      },
      {
        label: 'Pinjam Buku',
        subLabel: 'Ajukan pinjaman buku di perpustakaan',
        href: '/pinjam',
      },
    ],
    href: '/pelayanan'
  },
  {
    label: 'Informasi',
    href: '/informasi',
  },
  {
    label: 'Admin',
    href: '/admin',
  },
];

export default Navbar;