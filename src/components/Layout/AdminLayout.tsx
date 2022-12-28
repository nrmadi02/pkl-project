import {
  Box,
  Flex,
  Badge,
  Stack,
  Text,
  Divider,
  MenuList,
  MenuItem,
  useToast,
  Spinner,
  Menu,
  MenuButton,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  useColorModeValue,
  Icon,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Portal,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useRef, useState } from "react";
import { IoHome, IoMenu } from "react-icons/io5";
import ItemSidebar from "../Sidebar/ItemSidebar";
import Logo from "../../assets/logo/logo-smabat.png";
import Link from "next/link";
import FooterAdmin from "../Footer/FooterAdmin";

type Props = {
  children: JSX.Element;
  breadcrumb: any;
  title: string;
};

const AdminLayout: NextPage<Props> = ({ children, breadcrumb, title }) => {
  const { data } = useSession();
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState<any>();
  const [isShow, setIsShow] = useState(true);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };
  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);
  const isMobile = parseInt(width) <= 1300;
  useEffect(() => {
    isMobile ? setIsShow(false) : setIsShow(true);
  }, [isMobile]);

  const handleLogOut = async () => {
    await signOut({ redirect: false });
    toast({
      title: "Logout Berhasil",
      status: "success",
      duration: 3000,
      position: "top-right",
      isClosable: true,
    });
    router.replace("/");
    setLoading(false);
  };

  const [loading, setLoading] = useState(false);

  return (
    <Box>
      {isShow && (
        <div className={`transition-all overflow-auto`}>
          <div className={`flex flex-col w-[300px] fixed transition-al`}>
            <div className="flex flex-col items-center h-screen min-w-full relative">
              <p className="font-bold text-[25px] mt-[20px]">SMABAT</p>
              <Image
                width={80}
                layout="fixed"
                height={80}
                src={Logo}
                alt="_logo"
              />
              <Divider mt={"20px"}></Divider>
              <ItemSidebar />
            </div>
          </div>
        </div>
      )}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent overflow={"hidden"}>
          <DrawerCloseButton className="z-[55]" />

          <DrawerBody overflow={"hidden"} className='mr-[-20px]'>
            <div className="flex flex-col h-screen min-w-full items-center relative">
              <p className="font-bold text-[25px] mt-[20px]">SMABAT</p>
              <Image width={80} height={80} src={Logo} alt="_logo" />
              <Divider mt={"20px"}></Divider>
              <ItemSidebar />
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Box
        float="right"
        minHeight="100vh"
        height="100%"
        overflow="auto"
        position="relative"
        maxHeight="100%"
        backgroundColor={"#f0f0f0"}
        w={{ base: "100%", xl: "calc( 100% - 300px )" }}
        maxWidth={{ base: "100%", xl: "calc( 100% - 300px )" }}
        transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
        transitionDuration=".2s, .2s, .35s"
        transitionProperty="top, bottom, width"
        transitionTimingFunction="linear, linear, ease"
      >
        <Portal>
          <Box>
            <div
              className={`flex-initial bg-[#f0f0f0] overflow-hidden w-full transition-all ${
                isShow && "ml-[300px]"
              }`}
            >
              <div
                className={`bg-[#f0f0f0] bg-opacity-20 backdrop-blur-lg drop-shadow-lg z-[50] fixed top-0 ${
                  isShow ? "left-[300px]" : "left-0"
                } right-0`}
              >
                <div className="w-full flex gap-y-[10px] flex-col md:flex-row py-[20px] px-[20px] md:justify-between md:items-center">
                  <div className="flex flex-col">
                    {breadcrumb}
                    <p className="text-[20px] font-bold">{title}</p>
                  </div>
                  {data?.user?.name && (
                    <div
                      className={`bg-white ${
                        isShow ? "pl-[100px]" : "pl-[20px]"
                      } flex items-center justify-between md:justify-end flex-row gap-x-[20px] shadow-sm rounded-[15px] px-[20px] py-[10px] `}
                    >
                      {!isShow && (
                        <div
                          ref={btnRef}
                          onClick={onOpen}
                          className="cursor-pointer hover:scale-105 active:scale-100"
                        >
                          <Icon as={IoMenu} w={10} h={10} />
                        </div>
                      )}
                      <div className="flex flex-col items-end">
                        <Menu>
                          <MenuButton
                            fontSize={{ base: "small", md: "medium" }}
                            fontWeight={600}
                          >
                            {!loading && data?.user?.name}
                            {loading && <Spinner color="orange.500" />}
                          </MenuButton>
                          <MenuList>
                            <Link href={"/"}>
                              <MenuItem _focus={{ color: "orange.500" }}>
                                Home
                              </MenuItem>
                            </Link>
                            <MenuItem
                              onClick={() => {
                                setLoading(true);
                                handleLogOut();
                              }}
                              _focus={{ color: "orange.500" }}
                            >
                              Log out
                            </MenuItem>
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
            </div>
          </Box>
        </Portal>
        <Box
          mx="auto"
          // p={{ base: "20px", md: "20px" }}
          // pe="20px"
          minH="100vh"
          pt="20px"
          backgroundColor={"#f0f0f0"}
          marginTop={{ base: "175px", md: "100px" }}
        >
          {children}
        </Box>
        <Box>
          <FooterAdmin />
        </Box>
      </Box>

      {/* <Flex className="min-h-screen relative">
        {isShow && (
          <div className={`transition-all`}>
            <div className={`flex flex-col w-[300px] fixed transition-al`}>
              <div className="flex flex-col items-center relative">
                <p className='font-bold text-[25px] mt-[20px]'>SMABAT</p>
                <Image width={80} height={80} src={Logo} alt="_logo" />
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
                <Image width={80} height={80} src={Logo} alt="_logo" />
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
                        <Link href={'/'}>
                          <MenuItem _focus={{ color: "orange.500" }}>Home</MenuItem>
                        </Link>
                        <MenuItem onClick={() => {
                          setLoading(true)
                          handleLogOut()
                        }} _focus={{ color: "orange.500" }}>Log out</MenuItem>
                      </MenuList>
                    </Menu> */}
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore:next-line */}
      {/* <p>{data?.role}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex bg-[#f0f0f0] mt-[175px] md:mt-[120px] flex-col">
            <div className="overflow-x-auto w-full flex-1">
              <div className="w-full">
                {children}
              </div>
            </div>
          </div>
        </div> */}
      {/* </Flex> */}
    </Box>
  );
};

export default AdminLayout;
