import { NextPage } from "next";
import { Badge, Button, Container, FormControl, FormLabel, Heading, Input, SimpleGrid, Stack, Table, Tbody, Td, Textarea, Th, Thead, Tr } from '@chakra-ui/react';

const SectionBimbingan: NextPage = () => {
  return (
    <Container maxW={'5xl'} py={10}>
      <Heading textAlign={'center'}>Jadwalkan Bimbingan BK</Heading>
      <Stack mt={'10'}>
        <Heading size={'md'}>Bimbingan anda sebelumnya</Heading>
        <Table>
          <Thead>
            <Tr>
              <Th>Nama</Th>
              <Th>Jadwal</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Nur Ahmadi</Td>
              <Td>22 Juli 2022</Td>
              <Td><Badge colorScheme='green'>Disetujui</Badge></Td>
            </Tr>
          </Tbody>
        </Table>
      </Stack>
      <Stack mt={'10'}>
        <Heading size={'md'}>Jadwalkan sekarang</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
          <FormControl>
            <FormLabel htmlFor='name'>Nama</FormLabel>
            <Input
              borderColor={'orange.400'}
              id='nama'
              placeholder='Masukan nama'
            // {...register('nomorInduk')}
            />
          </FormControl>
          {/* <FormControl>
            <FormLabel htmlFor='name'>NIS</FormLabel>
            <Input
              borderColor={'orange.400'}
              id='nis'
              placeholder='Masukan NIS'
            // {...register('nomorInduk')}
            />
          </FormControl> */}
          <FormControl>
            <FormLabel htmlFor='name'>Kelas</FormLabel>
            <Input
              borderColor={'orange.400'}
              id='kelas'
              placeholder='Masukan kelas'
            // {...register('nomorInduk')}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor='name'>Jadwal bimbingan</FormLabel>
            <Input
              borderColor={'orange.400'}
              id='tanggal'
              placeholder='Masukan tanggal'
              type={'date'}
            // {...register('nomorInduk')}
            />
          </FormControl>
        </SimpleGrid>
        <FormControl>
          <FormLabel htmlFor='name'>Keluhan anda</FormLabel>
          <Textarea
            borderColor={'orange.400'}
            id='Keluhan'
            placeholder='Masukan keluhan'
          // {...register('nomorInduk')}
          />
        </FormControl>
      </Stack>
      <Button mt={4} fontWeight={600}
          color={'white'}
          bg={'orange.400'}
          _hover={{
            bg: 'orange.300',
          }} >
          Tambahkan
        </Button>
    </Container>
  )
}

export default SectionBimbingan