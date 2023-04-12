import {
  Box,
  Divider,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
} from "@chakra-ui/react";
import { NextPage } from "next";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ItemSidebar from "../Sidebar/ItemSidebar";
import Logo from "../../assets/logo/logo-smabat.png";
import { useRouter } from "next/router";
import { useAppStore } from "../../lib/store";


type Props = {
  children: JSX.Element;
};

const BaseLayout: NextPage<Props> = ({ children }) => {
  const router = useRouter()
  const btnRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState<any>();
  const { isShow, hide: hideSidebar, show: showSidebar, close: onClose, isOpen, open: onOpen } = useAppStore();

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
    onClose()
    isMobile ? hideSidebar() : showSidebar();
  }, [isMobile]);

  if (!router.asPath.includes('/admin')){
    return children
  }

  return (
    <Box>
      {isShow && (
        <div className={`transition-all overflow-auto`}>
          <div className={`flex flex-col w-[300px] fixed transition-al`}>
            <div className="flex flex-col bg-white text-black items-center h-screen min-w-full relative">
              <p className="font-bold text-[25px] mt-[20px]">SMABAT</p>
              <div className="h-[80px] w-[80px]">
                <Image
                  width={80}
                  layout="fixed"
                  height={80}
                  src={Logo}
                  alt="_logo"
                />
              </div>
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

          <DrawerBody overflow={"hidden"} className="mr-[-20px]">
            <div className="flex flex-col h-screen bg-white min-w-full items-center relative">
              <p className="font-bold text-[25px] mt-[20px]">SMABAT</p>
              <div className="h-[80px] w-[80px]">
                <Image
                  width={80}
                  layout="fixed"
                  height={80}
                  src={Logo}
                  alt="_logo"
                />
              </div>
              <Divider mt={"20px"}></Divider>
              <ItemSidebar />
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      {children}
    </Box>
  );
};

export default BaseLayout;

