import { NextPage } from "next";
import {
  Badge,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  SimpleGrid,
  Stack,
  Table,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import { useForm } from "react-hook-form";
import {
  createKonselingSchema,
  CreateKonselingSchema,
} from "../../server/schema/konseling.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import DeleteAlert from "../Alert/Delete";
import { IoTrash } from "react-icons/io5";
import moment from "moment";
import "moment/locale/id";

const SectionBimbingan: NextPage = () => {
  const { data: state } = useSession();
  const toast = useToast()
  const [delLoading, setDelLoading] = useState(false);
  // const { onOpen, onClose, isOpen } = useDisclosure();
  const {
    onOpen: onOpenDel,
    onClose: onCloseDel,
    isOpen: isOpenDel,
  } = useDisclosure();
  const [selected, setSelected] = useState("")

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<CreateKonselingSchema>({
    resolver: zodResolver(createKonselingSchema),
    mode: "onChange",
  });

  const { data: dataSiswa } = trpc.useQuery(["siswa.detail", state?.email]);
  const { data: dataKonseling, refetch } = trpc.useQuery([
    "konseling.getBySiswaID",
    String(dataSiswa?.result?.id),
  ]);
  const {mutateAsync: tambahKonseling} = trpc.useMutation(['konseling.create'])
  const {mutateAsync: hapusKonseling} = trpc.useMutation('konseling.delete')

  const handleAddKonseling = useCallback(
    async (data: CreateKonselingSchema) => {
      const result: any = await tambahKonseling(data);
      if (result.status === 201) {
        toast({
          title: "Tambah data berhasil",
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        refetch()
        reset({keluhan: '', tanggal: ''})
      } else {
        toast({
          title: "Tambah data gagal",
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      }
    },
    [tambahKonseling]
  );

  const handleDeleteKonseling = useCallback(
    async (data: string) => {
      const result: any = await hapusKonseling(data);
      if (result.status === 200) {
        toast({
          title: "Hapus data berhasil",
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        refetch();
        setDelLoading(false)
        // reset({ keluhan: "", tanggal: "" });
      } else {
        toast({
          title: "Hapus data gagal",
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        setDelLoading(false);
      }
    },
    [hapusKonseling]
  );

  useEffect(() => {
    setValue("siswaID", String(dataSiswa?.result?.id));
  }, [dataSiswa]);

  return (
    <Container maxW={"5xl"} py={10}>
      <Heading textAlign={"center"}>Jadwalkan Bimbingan BK</Heading>
      <Stack mt={"10"}>
        <Heading size={"md"}>Bimbingan anda sebelumnya</Heading>
        <Table className="text-[12px]">
          <Thead>
            <Tr>
              <Th>Nama</Th>
              <Th>Jadwal</Th>
              <Th>Jam</Th>
              <Th>Keluhan</Th>
              <Th>Status</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dataKonseling?.result.length != 0 ? (
              dataKonseling?.result.map((item, idx) => {
                return (
                  <Tr key={idx}>
                    <Td>{item.siswa.nama}</Td>
                    <Td>{moment(item.tanggal).format("dddd, DD/MM/YYYY")}</Td>
                    <Td>{item.jam ? item.jam : "-"}</Td>
                    <Td>
                      <p className="whitespace-pre-wrap">{item.keluhan}</p>
                    </Td>
                    <Td>
                      {item.status == "Disetujui" && (
                        <Badge size={"sm"} colorScheme="green">
                          Disetujui
                        </Badge>
                      )}
                      {item.status == "Menunggu" && (
                        <Badge size={"sm"} colorScheme="orange">
                          Menunggu
                        </Badge>
                      )}
                      {item.status == "Ditolak" && (
                        <Badge size={"sm"} colorScheme="red">
                          Ditolak
                        </Badge>
                      )}
                    </Td>
                    <Td>
                      <IconButton
                        // isLoading={delLoading}
                        variant="outline"
                        colorScheme="red"
                        aria-label="delete"
                        // fontSize="20px"
                        size={"sm"}
                        onClick={async () => {
                          onOpenDel();
                          setSelected(item.id);
                        }}
                        icon={<IoTrash />}
                      />
                    </Td>
                  </Tr>
                );
              })
            ) : (
              <Tr>
                <Td>Data belum ada</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Stack>
      <DeleteAlert
        isOpen={isOpenDel}
        onClick={async () => {
          setDelLoading(true);
          await handleDeleteKonseling(selected)
        }}
        onClose={onCloseDel}
        onOpen={onOpenDel}
        isLoading={delLoading}
        title={"Hapus konseling"}
        text={"Apa anda yakin ?"}
      />
      <form onSubmit={handleSubmit(handleAddKonseling)}>
        <Stack mt={"10"}>
          <Heading size={"md"}>Jadwalkan sekarang</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
            <FormControl>
              <FormLabel htmlFor="name">Nama</FormLabel>
              <Input
                borderColor={"orange.400"}
                id="nama"
                disabled
                defaultValue={dataSiswa?.result?.nama}
                placeholder="Masukan nama"
                // {...register('nomorInduk')}
              />
            </FormControl>
            <Input
              type={"hidden"}
              borderColor={"orange.400"}
              id="siswaID"
              defaultValue={dataSiswa?.result?.id}
              placeholder="Masukan NIS"
              {...register("siswaID")}
            />
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
              <FormLabel htmlFor="name">Kelas</FormLabel>
              <Input
                borderColor={"orange.400"}
                id="kelas"
                placeholder="Masukan kelas"
                disabled
                defaultValue={String(dataSiswa?.result?.kelas)}
                // {...register('nomorInduk')}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="name">Jadwal bimbingan</FormLabel>
              <Input
                borderColor={"orange.400"}
                id="tanggal"
                placeholder="Masukan tanggal"
                type={"date"}
                {...register("tanggal")}
              />
            </FormControl>
          </SimpleGrid>
          <FormControl>
            <FormLabel htmlFor="name">Keluhan anda</FormLabel>
            <Textarea
              borderColor={"orange.400"}
              id="Keluhan"
              placeholder="Masukan keluhan"
              {...register("keluhan")}
            />
          </FormControl>
        </Stack>
        <Button
          mt={4}
          isLoading={isSubmitting}
          disabled={!isValid}
          type="submit"
          fontWeight={600}
          color={"white"}
          bg={"orange.400"}
          _hover={{
            bg: "orange.300",
          }}
        >
          Tambahkan
        </Button>
      </form>
    </Container>
  );
};

export default SectionBimbingan;
