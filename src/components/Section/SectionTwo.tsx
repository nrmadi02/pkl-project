import {
  Button,
  Container,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import moment from "moment";
import { NextPage } from "next";
import { trpc } from "../../utils/trpc";

const SectionTwo: NextPage = () => {
  const { data: dataInformasi } = trpc.useQuery(["informasi.getAllAccept", 5]);
  return (
    <Container maxW={"5xl"} mt={10} pb={10}>
      <Heading textAlign={"center"}>Pusat Informasi</Heading>
      <Flex flexDirection={"column"} width="full" alignItems={"center"}>
        {dataInformasi?.reuslt &&
          dataInformasi.reuslt.map((item, idx) => {
            return (
              <SimpleGrid
                key={idx}
                maxW={"2xl"}
                p={5}
                mt={{ base: 5, md: 10 }}
                shadow="md"
                rounded={8}
                columns={{ base: 1, md: 2 }}
                spacing={5}
              >
                <Flex>
                  <Image
                    rounded={5}
                    alt={"feature image"}
                    src={
                      item.sampul ||
                      "https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    }
                    objectFit={"cover"}
                  />
                </Flex>
                <Flex
                  flexDirection={"column"}
                  width="full"
                  justifyContent={"space-between"}
                >
                  <Stack>
                    <Flex alignItems={"center"}>
                      <Text color={"gray.500"} fontSize={12}>
                        {item.pembuat} -
                      </Text>
                      <Text ml="3px" fontSize={10} fontWeight={"bold"}>
                        {moment(item.createdAt).format("DD MMMM YYYY")}
                      </Text>
                    </Flex>
                    <Heading size={"lg"}>{item.judul}</Heading>
                    <div className="h-[1px] w-full bg-black bg-opacity-50"></div>
                    <Text fontSize={"14"}>{item.deskripsi}</Text>
                  </Stack>
                  <Flex
                    flexDirection={"column"}
                    width="full"
                    alignItems={"flex-end"}
                    justifyContent="flex-end"
                  >
                    <Button
                      fontSize={"sm"}
                      fontWeight={600}
                      color={"white"}
                      bg={"orange.400"}
                      _hover={{
                        bg: "orange.300",
                      }}
                    >
                      Selengkapnya
                    </Button>
                  </Flex>
                </Flex>
              </SimpleGrid>
            );
          })}
      </Flex>
      <Flex
        mt={10}
        flexDirection={"row"}
        width="full"
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Button
          fontSize={"sm"}
          fontWeight={600}
          px="40"
          color={"white"}
          bg={"orange.400"}
          _hover={{
            bg: "orange.300",
          }}
        >
          Lihat lebih banyak
        </Button>
      </Flex>
    </Container>
  );
};

export default SectionTwo;
