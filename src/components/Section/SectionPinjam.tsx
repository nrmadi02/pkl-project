import { NextPage } from "next";
import { Badge, Button, Container, Divider, Flex, FormControl, FormLabel, Heading, Image, Input, SimpleGrid, Stack, Table, Tbody, Td, Text, Textarea, Th, Thead, Tr } from '@chakra-ui/react';

const SectionPinjam: NextPage = () => {
  return (
    <Container maxW={'5xl'} py={10}>
      <Heading mb={10}>List Buku Perpustakaan</Heading>
      <Stack>
        <Heading size={'md'}>Buku IPA</Heading>
        {/* item */}
        <Flex className="hover:scale-105 transition-all active:scale-100" gap={2} flexDirection={'column'} shadow={'sm'} cursor={'pointer'} rounded={5} alignItems={'center'} p={3} bg={'orange.100'} maxH={200} width={140} height={200}>
          <Image
          rounded={3}
            height={120}
            width={100}
            minHeight={120}
            alt={'feature image'}
            src={
              'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            }
            objectFit={'cover'} />
            <div className="w-full">
              <Text fontWeight={'bold'} fontSize={12}>Biologi</Text>
              <Text height={30} overflow='hidden' textAlign={'left'} fontSize={10}>Buku yang belajar tentang biologi. Buku yang belajar tentang biologi. Buku yang belajar tentang biologi.</Text>
            </div>
        </Flex>
      </Stack>
      <Divider my={5}></Divider>
      <Stack>
        <Heading size={'md'}>Buku Matematika</Heading>
        {/* item */}
        <Flex className="hover:scale-105 transition-all active:scale-100" gap={2} flexDirection={'column'} shadow={'sm'} cursor={'pointer'} rounded={5} alignItems={'center'} p={3} bg={'blue.100'} maxH={200} width={140} height={200}>
          <Image
          rounded={3}
            height={120}
            width={100}
            minHeight={120}
            alt={'feature image'}
            src={
              'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            }
            objectFit={'cover'} />
            <div className="w-full">
              <Text fontWeight={'bold'} fontSize={12}>Perkalian</Text>
              <Text height={30} overflow='hidden' textAlign={'left'} fontSize={10}>Buku yang belajar tentang perkalian. Buku yang belajar tentang perkalian. Buku yang belajar tentang perkalian.</Text>
            </div>
        </Flex>
      </Stack>
    </Container>
  )
}

export default SectionPinjam