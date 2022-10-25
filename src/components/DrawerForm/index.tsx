import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerOverlay } from "@chakra-ui/react";
import { NextPage } from "next";

interface Props {
    isOpen: boolean,
    onClose: () => void,
    btnRef: any,
    children: JSX.Element,
    bottomButtons?: JSX.Element
}

const DrawerForm: NextPage<Props> = ({ btnRef, children, isOpen, onClose, bottomButtons }) => {
    return (
        <Drawer
            isOpen={isOpen}
            placement='right'
            onClose={onClose}
            finalFocusRef={btnRef}
            size='md'
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton className='z-[55]' />

                <DrawerBody>
                    {children}
                </DrawerBody>
                <DrawerFooter>
                    {bottomButtons}
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default DrawerForm