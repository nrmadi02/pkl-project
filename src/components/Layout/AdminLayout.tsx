import {
  Box,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useRef, useState } from "react";
import { IoMenu } from "react-icons/io5";
import FooterAdmin from "../Footer/FooterAdmin";
import { useAppStore } from "../../lib/store";

interface Props {
  children: ReactElement;
  breadcrumb: any;
  title: string;
}

const AdminLayout = ({ children, breadcrumb, title }: Props) => {
  const { data } = useSession();
  const router = useRouter();
  const toast = useToast();
  const btnRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState<any>();
   const {
     isShow,
     hide: hideSidebar,
     show: showSidebar,
     close: onClose,
     isOpen,
     open: onOpen,
   } = useAppStore();

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
    isMobile ? hideSidebar() : showSidebar();
  }, [isMobile]);

  const [loading, setLoading] = useState(false);
  return (
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
              className={`bg-[#f0f0f0] h-[105px] bg-opacity-20 backdrop-blur-lg drop-shadow-lg z-[50] fixed top-0 ${
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
        minH="calc(100vh - 170px)"
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
  );
};

export default AdminLayout;
