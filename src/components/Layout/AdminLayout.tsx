import { Box, Flex, Badge, Stack, Text, Divider, MenuList, MenuItem, useToast, Spinner, Menu, MenuButton, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Heading, useColorModeValue, Icon, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter } from '@chakra-ui/react';
import { NextPage } from "next"
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useRef, useState } from 'react';
import {
  IoHome, IoMenu
} from 'react-icons/io5';
import ItemSidebar from '../Sidebar/ItemSidebar';
import Logo from '../../assets/logo/logo-smabat.png'

type Props = {
  children: JSX.Element
  breadcrumb: any
  title: string
}

const AdminLayout: NextPage<Props> = ({ children, breadcrumb, title }) => {
  const { data } = useSession();
  const router = useRouter()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef<HTMLDivElement>(null)

  const [width, setWidth] = useState(0);
  const [isShow, setIsShow] = useState(true)

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth)
  }
  useEffect(() => {
    setWidth(window.innerWidth)
  }, [])
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);
  const isMobile = width <= 1000
  useEffect(() => {
    isMobile ? setIsShow(false) : setIsShow(true)
  }, [isMobile])

  const handleLogOut = async () => {
    await signOut({ redirect: false })
    toast({
      title: 'Logout Berhasil',
      status: 'success',
      duration: 3000,
      position: 'top-right',
      isClosable: true,
    })
    router.replace('/')
    setLoading(false)
  }

  const [loading, setLoading] = useState(false)

  return (
    <>
      <Flex className="min-h-screen relative">
        {isShow && (
          <div className={`transition-all`}>
            <div className={`flex flex-col w-[300px] fixed transition-al`}>
              <div className="flex flex-col items-center relative">
                <p className='font-bold text-[25px] mt-[20px]'>SMABAT</p>
                <Image width={100} height={100} src={Logo} alt="_logo" />
                <Divider mt={'20px'}></Divider>
                <ItemSidebar />
              </div>
            </div>
          </div>
        )}
        <Drawer
          isOpen={isOpen}
          placement='left'
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton className='z-[55]' />

            <DrawerBody>
              <div className="flex flex-col items-center relative">
                <p className='font-bold text-[25px] mt-[20px]'>SMABAT</p>
                <Image width={100} height={100} src={Logo} alt="_logo" />
                <Divider mt={'20px'}></Divider>
                <ItemSidebar />
              </div>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        <div className={`flex-initial bg-[#f0f0f0] overflow-hidden w-full transition-all ${isShow && 'ml-[300px]'}`}>
          <div className={`bg-[#f0f0f0] bg-opacity-20 backdrop-blur-lg drop-shadow-lg z-[50] fixed top-0 ${isShow ? 'left-[300px]' : 'left-0'} right-0`}>
            <div className="w-full flex gap-y-[10px] flex-col md:flex-row py-[20px] px-[20px] md:justify-between md:items-center">
              <div className='flex flex-col'>
                {breadcrumb}
                <p className='text-[20px] font-bold'>{title}</p>
              </div>
              {data?.user?.name && (
                <div className={`bg-white ${isShow ? 'pl-[100px]' : 'pl-[20px]'} flex items-center justify-between md:justify-end flex-row gap-x-[20px] shadow-sm rounded-[15px] px-[20px] py-[10px] `}>
                  {!isShow && <div ref={btnRef} onClick={onOpen} className='cursor-pointer hover:scale-105 active:scale-100'>
                    <Icon as={IoMenu} w={10} h={10} />
                  </div>}
                  <div className='flex flex-col items-end'>
                    <Menu>
                      <MenuButton
                        fontSize={{ base: "small", md: "medium" }}
                        fontWeight={600}
                      >
                        {!loading && data?.user?.name}
                        {loading && <Spinner color='orange.500' />}
                      </MenuButton>
                      <MenuList>
                        <MenuItem _focus={{ color: "orange.500" }}>Home</MenuItem>
                        <MenuItem onClick={() => {
                          setLoading(true)
                          handleLogOut()
                        }} _focus={{ color: "orange.500" }}>Log out</MenuItem>
                      </MenuList>
                    </Menu>
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/* @ts-ignore:next-line */}
                    <p>{data?.role}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex bg-[#f0f0f0] mt-[185px] md:mt-[120px] flex-col">
            <div className="overflow-x-auto w-full flex-1">
              <div className="w-full">
                {children}
              </div>
            </div>
          </div>
        </div>
      </Flex>
    </>
  )
}

export default AdminLayout