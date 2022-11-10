import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useDisclosure } from "@chakra-ui/react"
import { NextPage } from "next"
import { useRef } from "react"

interface Props {
    onClick: any,
    isOpen: any,
    onOpen: any,
    onClose: any,
    title: string,
    text: string,
    isLoading: boolean
}

const DeleteAlert: NextPage<Props> = ({ onClick, isOpen, onOpen, onClose, title, text, isLoading }) => {
    const cancelRef = useRef<any>()

    return (
        <>
            <AlertDialog
                motionPreset='slideInBottom'
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <AlertDialogOverlay />

                <AlertDialogContent>
                    <AlertDialogHeader>{title}</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        {text}
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            Tidak
                        </Button>
                        <Button isLoading={isLoading} onClick={onClick} colorScheme='red' ml={3}>
                            Iya
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default DeleteAlert