import { NextPage } from "next";
import { Container, Heading, Stack, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';

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
              <Td>Disetujui</Td>
            </Tr>
          </Tbody>
        </Table>
      </Stack>
      <Stack mt={'10'}>
        <Heading size={'md'}>Jadwalkan sekarang</Heading>
      </Stack>
    </Container>
  )
}

export default SectionBimbingan