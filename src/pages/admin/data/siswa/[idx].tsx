import { CalendarIcon, DeleteIcon, DownloadIcon } from "@chakra-ui/icons";
import fs from "fs";
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Select,
  Spinner,
  Textarea,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pelanggaran, Siswa, Terlambat, Tindaklanjut } from "@prisma/client";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { getCookie } from "cookies-next";
import moment from "moment";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  IoAdd,
  IoCalculator,
  IoCalendarClear,
  IoDownload,
  IoRemove,
  IoTrash,
} from "react-icons/io5";
import { MdClear } from "react-icons/md";
import DeleteAlert from "../../../../components/Alert/Delete";
import DataTable from "../../../../components/DataTable/DataTable";
import DrawerForm from "../../../../components/DrawerForm";
import AdminLayout from "../../../../components/Layout/AdminLayout";
import SafeHydrate from "../../../../components/SafeHydrate";
import prismaFront from "../../../../server/db/front";
import {
  CreatePelanggaranSchema,
  createPelanggaranSchema,
} from "../../../../server/schema/pelanggaran.schema";
import {
  createTindakSchema,
  CreateTindakSchema,
} from "../../../../server/schema/tindak.schema";
import { trpc } from "../../../../utils/trpc";
import "moment/locale/id";
import { FaEye } from "react-icons/fa";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import axios, { AxiosRequestConfig } from "axios";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps<{ data: Siswa }> = async (
  ctx
) => {
  const proto = ctx.req.headers["x-forwarded-proto"] ? "https" : "http";
  const token = getCookie(
    proto == "http"
      ? "next-auth.session-token"
      : "__Secure-next-auth.session-token",
    { req: ctx.req, res: ctx.res }
  );
  if (!token) {
    return {
      redirect: {
        destination: "/login?referer=admin",
        permanent: false,
      },
    };
  }

  const siswa = (await prismaFront.siswa.findFirst({
    where: {
      id: String(ctx.params?.idx),
    },
  })) as unknown as Siswa;

  if (!siswa) {
    return {
      redirect: {
        destination: "/admin/data/siswa",
        permanent: false,
      },
    };
  }

  return {
    props: {
      data: JSON.parse(JSON.stringify(siswa)),
    },
  };
};

const DetailSiswa: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: stateSession } = useSession();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const firstFieldRef = useRef(null);
  const router = useRouter();
  const {
    onOpen: onOpenTindak,
    onClose: onCloseTindak,
    isOpen: isOpenTindak,
  } = useDisclosure();
  const btnTindakan = useRef(null);
  const {
    onOpen: onOpenPanggil,
    onClose: onClosePanggil,
    isOpen: isOpenPanggil,
  } = useDisclosure();
  const toast = useToast();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedType, setSelectedType] = useState("");

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = async (apiData: any, fileName: any) => {
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<CreatePelanggaranSchema>({
    resolver: zodResolver(createPelanggaranSchema),
    mode: "onChange",
  });

  const {
    register: registerTindak,
    handleSubmit: submitTindak,
    watch: watchTindak,
    setValue: setValueTindak,
    reset: resetTindak,
    formState: {
      errors: errorsTindak,
      isSubmitting: isSubmitTindak,
      isDirty: isDirtyTindak,
      isValid: isValidTindak,
    },
  } = useForm<CreateTindakSchema>({
    resolver: zodResolver(createTindakSchema),
    mode: "onChange",
  });

  const OverlayTwo = () => (
    <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
  );

  const { mutateAsync: tambahPelanggaran } =
    trpc.useMutation("pelanggaran.create");
  const { mutateAsync: tambahTindakan } = trpc.useMutation("tindak.create");
  const { mutateAsync: hapusPanggil, isLoading: isLoadingDelPanggil } =
    trpc.useMutation(["panggil.delete"]);
  const {
    data: dataSiswa,
    isLoading,
    refetch,
  } = trpc.useQuery([
    "siswa.getByID",
    {
      id: data.id,
      type: selectedType,
      star_date: selectedDates[0]
        ? moment(selectedDates[0]).format("YYYY-MM-DD")
        : "",
      end_date: selectedDates[1]
        ? moment(selectedDates[1]).format("YYYY-MM-DD")
        : "",
    },
  ]);
  const { mutateAsync: mutateAkumulasi, isLoading: isLoadingAkumulasi } =
    trpc.useMutation(["terlambat.updateAkumulasi"]);
  const {
    data: dataTindakan,
    isLoading: isLoadingTindakan,
    refetch: refetchTindak,
  } = trpc.useQuery(["tindak.getByIDSiswa", String(dataSiswa?.result?.id)]);
  const {
    data: dataPanggilortu,
    isLoading: isLoadingPanggil,
    refetch: refetchPanggil,
  } = trpc.useQuery(["panggil.getAllByIDSiswa", String(dataSiswa?.result?.id)]);
  const { data: dataDownloadPenghargaan } = trpc.useQuery([
    "pelanggaran.downloadByType",
    {
      siswaID: String(dataSiswa?.result?.id),
      type: "Penghargaan",
    },
  ]);
  const { data: dataDownloadPelanggaran } = trpc.useQuery([
    "pelanggaran.downloadPelanggaran",
    String(dataSiswa?.result?.id),
  ]);

  const downloadXLSFile = async () => {
    // Its important to set the 'Content-Type': 'blob' and responseType:'arraybuffer'.
    await axios
      .get(`/api/download/pelanggaran`, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        // console.log(response.data)
        const blob = new Blob([response.data], {
          type: fileType,
        });
        FileSaver.saveAs(blob, "sheet" + fileExtension);
      });
  };

  const handleAddPelanggaran = useCallback(
    async (data: CreatePelanggaranSchema) => {
      const result: any = await tambahPelanggaran(data);
      if (result.status === 201) {
        onClose();
        reset();
        toast({
          title: "Tambah Point siswa berhasil",
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        refetch();
      } else if (result.status === 400) {
        toast({
          title:
            "Penghargaan tidak bisa diberikan karena point pelanggaran siswa lebih kecil",
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      } else {
        toast({
          title: "Tambah Point siswa gagal",
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      }
    },
    [tambahPelanggaran]
  );

  const handleAkumulasiTerlambat = useCallback(
    async (id: string) => {
      const result: any = await mutateAkumulasi(id);
      if (result.status === 200) {
        toast({
          title: "Akumulasi point terlambat berhasil",
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        refetch();
      } else {
        toast({
          title: "Akumulasi point terlambat gagal",
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      }
    },
    [mutateAkumulasi]
  );

  const handleAddTindakan = useCallback(
    async (data: CreateTindakSchema) => {
      const result: any = await tambahTindakan(data);
      if (result.status === 201) {
        onCloseTindak();
        resetTindak();
        toast({
          title: "Tambah Tindak lanjut berhasil",
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        refetchTindak();
      } else {
        toast({
          title: "Tambah Tindak lanjut gagal",
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      }
    },
    [tambahPelanggaran]
  );

  const PanggilanSatu = () => {
    return (
      <>
        <Badge colorScheme="yellow">Panggilan 1</Badge>
      </>
    );
  };

  const PanggilanDua = () => {
    return (
      <>
        <Badge colorScheme="orange">Panggilan 2</Badge>
      </>
    );
  };

  const PanggilanTiga = () => {
    return (
      <>
        <Badge colorScheme="red">Panggilan 3</Badge>
      </>
    );
  };

  const Aman = () => {
    return (
      <>
        <Badge colorScheme="green">Aman</Badge>
      </>
    );
  };

  const getData = (data: Pelanggaran[] | undefined) => {
    const dataNew = data as Pelanggaran[];
    return dataNew;
  };

  const getDataTindak = (data: Tindaklanjut[] | undefined) => {
    const dataNew = data as Tindaklanjut[];
    return dataNew;
  };

  const getDataTerlambat = (data: Terlambat[] | undefined) => {
    const dataNew = data as Terlambat[];
    return dataNew;
  };

  const columns = useMemo(
    () => [
      {
        Header: "Jenis Point",
        accessor: (d: Pelanggaran) => {
          return d.type == "Penghargaan" ? (
            <Badge colorScheme={"green"}>{d.type}</Badge>
          ) : (
            <Badge colorScheme={"red"}>{d.type}</Badge>
          );
        },
      },
      {
        Header: "jenis_point",
        accessor: "type",
      },
      {
        Header: "Deskripsi",
        accessor: "deskripsi",
      },
      {
        Header: "point",
        accessor: "point",
      },
      {
        Header: "Point",
        accessor: (d: Pelanggaran) => {
          return +Math.abs(d.point);
        },
      },
      {
        Header: "Dibuat",
        accessor: (d: Pelanggaran) => {
          const date = moment(d.createdAt).format("dddd, DD/MM/YYYY");
          return <p>{date}</p>;
        },
      },
      {
        Header: "Action",
        accessor: (d: Pelanggaran) => {
          return (
            <ActionTable
              key={d?.id}
              value={d?.id}
              data={d}
              refetch={refetch}
              toast={toast}
            />
          );
        },
      },
    ],
    [dataSiswa?.pelanggaran]
  );

  const columnsPanggil = useMemo(
    () => [
      {
        Header: "Hari, Tanggal",
        accessor: (d: Tindaklanjut) => {
          const date = moment(d.tanggal).format("dddd, DD/MM/YYYY");
          return <p>{date}</p>;
        },
      },
      {
        Header: "Bidang Bimbingan",
        accessor: "type",
      },
      {
        Header: "Permasalahan",
        accessor: (d: Tindaklanjut) => {
          return <p className="whitespace-pre-wrap w-[150px]">{d.deskripsi}</p>;
        },
      },
      {
        Header: "Penanganan",
        accessor: (d: Tindaklanjut) => {
          return (
            <p className="whitespace-pre-wrap w-[150px]">{d.penanganan}</p>
          );
        },
      },
      {
        Header: "Tindak Lanjut",
        accessor: (d: Tindaklanjut) => {
          return <p className="whitespace-pre-wrap w-[150px]">{d.tindakan}</p>;
        },
      },
      {
        Header: "Action",
        accessor: (d: Tindaklanjut) => {
          return (
            <ActionTableTindak
              key={d?.id}
              value={d?.id}
              data={d}
              refetch={refetchTindak}
              toast={toast}
            />
          );
        },
      },
    ],
    [dataTindakan?.result]
  );

  const columnsTerlambat = useMemo(
    () => [
      {
        Header: "Hari, Tanggal",
        accessor: (d: Tindaklanjut) => {
          const date = moment(d.tanggal).format("dddd, DD/MM/YYYY");
          return <p>{date}</p>;
        },
      },
      {
        Header: "Waktu Terlambat",
        accessor: (d: Terlambat) => {
          return <p>{d.waktu} Menit</p>;
        },
      },
      {
        Header: "Status Akumulasi",
        accessor: (d: Terlambat) => {
          return d.akumulasi ? (
            <Badge colorScheme={"green"}>Sudah</Badge>
          ) : (
            <Badge colorScheme={"yellow"}>Belum</Badge>
          );
        },
      },
      {
        Header: "Action",
        accessor: (d: Tindaklanjut) => {
          return (
            <ActionTableTerlambat
              key={d?.id}
              value={d?.id}
              data={d}
              refetch={refetch}
              toast={toast}
            />
          );
        },
      },
    ],
    [dataSiswa?.terlambat]
  );

  const dataPelanggaran = useMemo(
    () => getData(dataSiswa?.pelanggaran ? dataSiswa.pelanggaran : []),
    [dataSiswa]
  );
  const dataPanggil = useMemo(
    () => getDataTindak(dataTindakan?.result ? dataTindakan.result : []),
    [dataTindakan]
  );
  const dataTerlambat = useMemo(
    () => getDataTerlambat(dataSiswa?.terlambat ? dataSiswa?.terlambat : []),
    [dataSiswa]
  );

  return (
    <AdminLayout
      title="Detail Siswa"
      breadcrumb={
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink>Pendataan</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link href={"/admin/data/siswa"}>
              <BreadcrumbLink>Siswa</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
        </Breadcrumb>
      }
    >
      <>
        <Head>
          <title>SMABAT || Detail Siswa</title>
          <meta name="description" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="p-5">
          <Heading size={"md"}>Data Siswa</Heading>
          <div className="flex flex-col md:flex-row gap-x-20 gap-y-5">
            <div className="flex flex-row gap-5 mt-5">
              <div className="w-[190px] h-[220px] md:w-[200px] md:h-[230px] cursor-pointer hover:scale-[1.01] transition-all rounded-md border-[2px] border-orange-300">
                <Image
                  className="rounded-md"
                  width={200}
                  height={230}
                  alt="_img"
                  src={
                    data.fotoProfile
                      ? data.fotoProfile
                      : `https://ui-avatars.com/api/?name=${data.nama
                          .split(" ")
                          .join("+")}`
                  }
                />
              </div>
              <SafeHydrate>
                <div className="flex gap-3 flex-col text-[18px] md:text-[20px]">
                  <tr>
                    <td width={70} className="font-bold">
                      Nama
                    </td>
                    <td width={20}>:</td>
                    <td>{data.nama}</td>
                  </tr>
                  <tr>
                    <td width={70} className="font-bold">
                      NIS
                    </td>
                    <td width={20}>:</td>
                    <td>{data.nis}</td>
                  </tr>
                  <tr>
                    <td width={70} className="font-bold">
                      Kelas
                    </td>
                    <td width={20}>:</td>
                    <td>{data.kelas}</td>
                  </tr>
                  <tr>
                    <td width={70} className="font-bold">
                      Point
                    </td>
                    <td width={20}>:</td>
                    <td>{dataSiswa?.points}</td>
                  </tr>
                  <tr>
                    <td width={70} className="font-bold">
                      Status
                    </td>
                    <td width={20}>:</td>
                    <td>
                      {Number(dataSiswa?.points) < 15 && <Aman />}
                      {Number(dataSiswa?.points) >= 15 &&
                        Number(dataSiswa?.points) < 30 && <PanggilanSatu />}
                      {Number(dataSiswa?.points) >= 30 &&
                        Number(dataSiswa?.points) < 45 && <PanggilanDua />}
                      {Number(dataSiswa?.points) >= 45 && <PanggilanTiga />}
                    </td>
                  </tr>
                </div>
              </SafeHydrate>
            </div>
            <div className="md:mt-5">
              <Heading size={"md"}>Tindak Lanjut</Heading>
              <div className="flex flex-row gap-5 items-center">
                <Button
                  fontWeight={600}
                  color={"white"}
                  bg={"orange.400"}
                  onClick={() => {
                    onOpenTindak();
                    setValueTindak("siswaID", String(dataSiswa?.result?.id));
                    setValueTindak(
                      "penindak",
                      stateSession?.user?.name ? stateSession?.user?.name : ""
                    );
                  }}
                  _hover={{
                    bg: "orange.300",
                  }}
                  mt={"10px"}
                >
                  Panggil siswa
                </Button>
                <Link href={`/admin/data/siswa/panggil/${data.id}`}>
                  <Button
                    fontWeight={600}
                    color={"white"}
                    bg={"red.400"}
                    _hover={{
                      bg: "red.300",
                    }}
                    mt={"10px"}
                  >
                    Panggilan Orang Tua
                  </Button>
                </Link>
              </div>
              <Modal
                isCentered
                isOpen={isOpenTindak}
                onClose={() => {
                  onCloseTindak();
                  resetTindak();
                }}
              >
                <OverlayTwo />
                <ModalContent>
                  <ModalHeader>Panggil Siswa</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <form
                      id="form-tindak"
                      onSubmit={submitTindak(handleAddTindakan)}
                    >
                      <Flex w={"full"} flexDirection={"column"} gap={"10px"}>
                        <Input
                          bg={"white"}
                          borderColor={"orange.300"}
                          borderWidth={1}
                          id="id"
                          type={"hidden"}
                          // placeholder='Masukan nama guru'
                          {...registerTindak("siswaID")}
                        />
                        <Input
                          bg={"white"}
                          borderColor={"orange.300"}
                          borderWidth={1}
                          id="id"
                          type={"hidden"}
                          // placeholder='Masukan nama guru'
                          {...registerTindak("penindak")}
                        />
                        <FormControl isInvalid={errorsTindak.type != undefined}>
                          <FormLabel htmlFor="type">Jenis Bidang</FormLabel>
                          <Select
                            bg={"white"}
                            borderColor={"orange.300"}
                            borderWidth={1}
                            id="type"
                            placeholder="Pilih..."
                            {...registerTindak("type")}
                          >
                            <option value={"Pribadi"}>Pribadi</option>
                            <option value={"Sosial"}>Sosial</option>
                            {/* <option value={'Kerapian'}>Kerapian</option>
                                                        <option value={'Penghargaan'}>Penghargaan</option> */}
                          </Select>
                          <FormErrorMessage>
                            {errorsTindak.type &&
                              "Jenis tata tertib harus di pilih"}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl
                          isInvalid={errorsTindak.deskripsi != undefined}
                        >
                          <FormLabel htmlFor="deskripsi">
                            Permasalahan
                          </FormLabel>
                          <Textarea
                            bg={"white"}
                            borderColor={"orange.300"}
                            borderWidth={1}
                            id="deskripsi"
                            placeholder="Masukan permasalahan"
                            {...registerTindak("deskripsi")}
                          />
                          <FormErrorMessage>
                            {errorsTindak.deskripsi &&
                              errorsTindak.deskripsi.message}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl
                          isInvalid={errorsTindak.penanganan != undefined}
                        >
                          <FormLabel htmlFor="deskripsi">Penanganan</FormLabel>
                          <Textarea
                            bg={"white"}
                            borderColor={"orange.300"}
                            borderWidth={1}
                            id="penanganan"
                            placeholder="Masukan penanganan"
                            {...registerTindak("penanganan")}
                          />
                          <FormErrorMessage>
                            {errorsTindak.penanganan &&
                              errorsTindak.penanganan.message}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl
                          isInvalid={errorsTindak.tindakan != undefined}
                        >
                          <FormLabel htmlFor="deskripsi">
                            Tindak Lanjut
                          </FormLabel>
                          <Textarea
                            bg={"white"}
                            borderColor={"orange.300"}
                            borderWidth={1}
                            id="tindakan"
                            placeholder="Masukan tindak lanjut"
                            {...registerTindak("tindakan")}
                          />
                          <FormErrorMessage>
                            {errorsTindak.tindakan &&
                              errorsTindak.tindakan.message}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl
                          isInvalid={errorsTindak.tanggal != undefined}
                        >
                          <FormLabel htmlFor="deskripsi">
                            Tanggal Penanganan
                          </FormLabel>
                          <Input
                            bg={"white"}
                            borderColor={"orange.300"}
                            borderWidth={1}
                            id="tanggal"
                            type={"date"}
                            placeholder="Masukan tindak lanjut"
                            {...registerTindak("tanggal")}
                          />
                          <FormErrorMessage>
                            {errorsTindak.tanggal &&
                              errorsTindak.tanggal.message}
                          </FormErrorMessage>
                        </FormControl>
                      </Flex>
                    </form>
                  </ModalBody>
                  <ModalFooter gap={3}>
                    <Button
                      onClick={() => {
                        onCloseTindak();
                        resetTindak();
                      }}
                    >
                      Batal
                    </Button>
                    <Button
                      isLoading={isSubmitTindak}
                      disabled={!isValidTindak}
                      type="submit"
                      form="form-tindak"
                      fontWeight={600}
                      color={"white"}
                      bg={"orange.400"}
                      _hover={{
                        bg: "orange.300",
                      }}
                    >
                      Panggil
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3">
            <Heading size={"md"}>Data Panggilan Orang tua</Heading>
            <div className="p-5 overflow-auto my-5 bg-white rounded shadow">
              {dataPanggilortu ? (
                dataPanggilortu.result.length != 0 ? (
                  dataPanggilortu.result.map((item, idx) => {
                    return (
                      <div className="flex gap-2 items-center" key={idx}>
                        <p>{idx + 1}.</p>
                        <p>{item.perihal}</p>
                        <p>-</p>
                        <p>{moment(item.tanggal).format("DD/MM/YYYY")}</p>
                        <Link
                          href={`/admin/data/siswa/panggil/detail/${item.id}`}
                        >
                          <IconButton
                            color={"orange.300"}
                            size={"sm"}
                            variant={"ghost"}
                            aria-label={""}
                          >
                            <FaEye />
                          </IconButton>
                        </Link>
                        <IconButton
                          onClick={onOpenPanggil}
                          size={"sm"}
                          colorScheme={"red"}
                          variant={"ghost"}
                          aria-label={""}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <DeleteAlert
                          isOpen={isOpenPanggil}
                          onClick={async () => {
                            const delPanggil = await hapusPanggil(item.id);
                            if (delPanggil.status === 200) {
                              toast({
                                title: "Hapus data berhasil",
                                status: "success",
                                duration: 3000,
                                position: "top-right",
                                isClosable: true,
                              });
                              refetchPanggil();
                              onClosePanggil();
                            } else {
                              toast({
                                title: "Hapus data gagal",
                                status: "error",
                                duration: 3000,
                                position: "top-right",
                                isClosable: true,
                              });
                            }
                          }}
                          onClose={onClosePanggil}
                          onOpen={onOpenPanggil}
                          isLoading={isLoadingDelPanggil}
                          title={"Hapus Panggilan"}
                          text={"Apa anda yakin ?"}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="flex gap-2 items-center">
                    <p>Belum ada data</p>
                  </div>
                )
              ) : (
                <Spinner color="orange.400" />
              )}
            </div>
            <Heading size={"md"}>Data Terlambat</Heading>
            <div className="w-full flex justify-end gap-3 items-end">
              <Button
                onClick={() => router.push(`/admin/data/siswa/rekap/lambat/${dataSiswa?.result?.id}`)}
                // ref={firstFieldRef}
                leftIcon={<IoDownload />}
                fontWeight={600}
                color={"white"}
                bg={"blue.400"}
                size={"sm"}
                _hover={{
                  bg: "blue.300",
                }}
              >
                Download
              </Button>
              <Button
                size={"sm"}
                onClick={() =>
                  handleAkumulasiTerlambat(String(dataSiswa?.result?.id))
                }
                ref={firstFieldRef}
                isLoading={isLoadingAkumulasi}
                leftIcon={<IoCalculator />}
                disabled={Number(dataSiswa?.waktuTerlambat) < 15}
                fontWeight={600}
                color={"white"}
                bg={"green.400"}
                _hover={{
                  bg: "green.300",
                }}
              >
                Akumulasi
              </Button>
              {/* <Button
                onClick={() => {
                  onOpen();
                  setValue("siswaID", data?.id);
                  setValue(
                    "pemeberi",
                    stateSession?.user?.name ? stateSession?.user?.name : ""
                  );
                }}
                ref={firstFieldRef}
                leftIcon={<IoAdd />}
                fontWeight={600}
                color={"white"}
                bg={"orange.400"}
                _hover={{
                  bg: "orange.300",
                }}
              >
                Tambah Point
              </Button> */}
            </div>
            <div className="text-[14px]">
              <DataTable
                isSearch={false}
                sizeSet
                isLoading={isLoading}
                hiddenColumns={[]}
                columns={columnsTerlambat}
                data={dataTerlambat}
              />
            </div>
            <Heading mt={5} size={"md"}>
              Data Point Siswa
            </Heading>
            <div className="w-full mb-3 flex justify-end items-end">
              <Button
                onClick={() => {
                  onOpen();
                  setValue("siswaID", data?.id);
                  setValue(
                    "pemeberi",
                    stateSession?.user?.name ? stateSession?.user?.name : ""
                  );
                }}
                ref={firstFieldRef}
                leftIcon={<IoAdd />}
                fontWeight={600}
                color={"white"}
                bg={"orange.400"}
                _hover={{
                  bg: "orange.300",
                }}
              >
                Tambah Point
              </Button>
            </div>
            <div className="relative hidden md:block pl-36 mb-3">
              <RangeDatepicker
                propsConfigs={{
                  inputProps: {
                    borderColor: "orange.300",
                    borderWidth: "2px",
                    bg: "white",
                  },
                  dateNavBtnProps: {
                    colorScheme: "orange",
                    variant: "outline",
                  },
                  dayOfMonthBtnProps: {
                    defaultBtnProps: {
                      // borderColor: "red.300",
                      _hover: {
                        background: "orange.400",
                        color: "white",
                      },
                    },
                    isInRangeBtnProps: {
                      color: "white",
                      bg: "orange.300",
                    },
                    selectedBtnProps: {
                      background: "orange.400",
                      color: "white",
                    },
                  },
                }}
                selectedDates={selectedDates}
                onDateChange={setSelectedDates}
              />
              <div className="absolute top-1 right-1">
                <IconButton
                  variant="ghost"
                  size={"sm"}
                  colorScheme={
                    selectedDates.length != 0 ? "orange" : "blackAlpha"
                  }
                  aria-label="update"
                  fontSize="20px"
                  onClick={async () => {
                    setSelectedDates([]);
                  }}
                  icon={<MdClear />}
                />
              </div>
              <div className="absolute gap-3 flex flex-row items-center top-[4px] left-0">
                <p className="font-bold">Filter waktu</p>
                <CalendarIcon fontSize={"20px"} color={"orange.300"} />
              </div>
            </div>
            <div className="mb-3 flex flex-row items-center">
              <p className="font-bold">Jenis Point</p>
              <Select
                onChange={(e) => setSelectedType(e.target.value)}
                bg={"white"}
                borderColor={"orange.300"}
                borderWidth={2}
                placeholder="Pilih..."
              >
                <option value={"Kelakuan"}>Kelakuan</option>
                <option value={"Kerajinan"}>Kerajinan</option>
                <option value={"Kerapian"}>Kerapian</option>
                <option value={"Penghargaan"}>Penghargaan</option>
              </Select>
            </div>
            <DrawerForm
              btnRef={firstFieldRef}
              isOpen={isOpen}
              onClose={() => {
                onClose();
                reset();
              }}
              bottomButtons={
                <>
                  <Button
                    variant="outline"
                    mr={3}
                    onClick={() => {
                      onClose();
                      reset();
                    }}
                  >
                    Batal
                  </Button>
                  <Button
                    isLoading={isSubmitting}
                    disabled={!isValid}
                    type="submit"
                    form="form-update"
                    fontWeight={600}
                    color={"white"}
                    bg={"orange.400"}
                    _hover={{
                      bg: "orange.300",
                    }}
                  >
                    Tambah
                  </Button>
                </>
              }
            >
              <div className="pt-5">
                <Heading size={"lg"} mb="5">
                  Tambah point
                </Heading>
                <form
                  className="mt-5"
                  id="form-update"
                  onSubmit={handleSubmit(handleAddPelanggaran)}
                >
                  <Flex w={"full"} flexDirection={"column"} gap={"10px"}>
                    <Input
                      bg={"white"}
                      borderColor={"orange.300"}
                      borderWidth={1}
                      id="id"
                      type={"hidden"}
                      // placeholder='Masukan nama guru'
                      {...register("siswaID")}
                    />
                    <Input
                      bg={"white"}
                      borderColor={"orange.300"}
                      borderWidth={1}
                      id="id"
                      type={"hidden"}
                      // placeholder='Masukan nama guru'
                      {...register("pemeberi")}
                    />
                    <FormControl isInvalid={errors.point != undefined}>
                      <FormLabel htmlFor="point">Point</FormLabel>
                      <Input
                        bg={"white"}
                        borderColor={"orange.300"}
                        borderWidth={1}
                        id="point"
                        placeholder="Masukan point"
                        type={"number"}
                        {...register("point")}
                      />
                      <FormErrorMessage>
                        {errors.point && errors.point.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.deskripsi != undefined}>
                      <FormLabel htmlFor="deskripsi">Deskripsi</FormLabel>
                      <Textarea
                        bg={"white"}
                        borderColor={"orange.300"}
                        borderWidth={1}
                        id="deskripsi"
                        placeholder="Masukan deskripsi"
                        {...register("deskripsi")}
                      />
                      <FormErrorMessage>
                        {errors.deskripsi && errors.deskripsi.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.type != undefined}>
                      <FormLabel htmlFor="type">Jenis Tata Tertib</FormLabel>
                      <Select
                        bg={"white"}
                        borderColor={"orange.300"}
                        borderWidth={1}
                        id="type"
                        placeholder="Pilih..."
                        {...register("type")}
                      >
                        <option value={"Kelakuan"}>Kelakuan</option>
                        <option value={"Kerajinan"}>Kerajinan</option>
                        <option value={"Kerapian"}>Kerapian</option>
                        <option value={"Penghargaan"}>Penghargaan</option>
                      </Select>
                      <FormErrorMessage>
                        {errors.type && "Jenis tata tertib harus di pilih"}
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>
                </form>
              </div>
            </DrawerForm>
            <div className="text-[14px]">
              <DataTable
                isSearch
                sizeSet
                isLoading={isLoading}
                hiddenColumns={["type", "point"]}
                columns={columns}
                data={dataPelanggaran}
              />
            </div>
            <div className="flex md:flex-row flex-col gap-2 md:gap-5 items-center">
              <Button
                fontWeight={600}
                width={"full"}
                color={"white"}
                bg={"green.400"}
                leftIcon={<DownloadIcon />}
                onClick={async () => {
                  await exportToCSV(
                    dataDownloadPenghargaan?.result,
                    `penghargaan_${dataSiswa?.result?.nama}`
                  );
                }}
                _hover={{
                  bg: "green.300",
                }}
                mt={"10px"}
              >
                Penghargaan
              </Button>
              <Button
                fontWeight={600}
                width={"full"}
                color={"white"}
                bg={"red.400"}
                onClick={async () => {
                  await exportToCSV(
                    dataDownloadPelanggaran?.result,
                    `pelanggaran_${dataSiswa?.result?.nama}`
                  );
                  // await downloadXLSFile();
                }}
                leftIcon={<DownloadIcon />}
                _hover={{
                  bg: "red.300",
                }}
                mt={"10px"}
              >
                Pelanggaran
              </Button>
              <Link href={`/admin/data/siswa/rekapitulasi/${data.id}`}>
                <Button
                  fontWeight={600}
                  width={"full"}
                  color={"white"}
                  bg={"orange.400"}
                  leftIcon={<DownloadIcon />}
                  _hover={{
                    bg: "orange.300",
                  }}
                  mt={"10px"}
                >
                  Rekapitulasi Pelanggaran
                </Button>
              </Link>
            </div>

            <Heading mt={5} size={"md"}>
              Kartu Bimbingan Siswa
            </Heading>
            <div className="text-[14px]">
              <DataTable
                isLoading={isLoadingTindakan}
                hiddenColumns={[]}
                columns={columnsPanggil}
                data={dataPanggil}
              />
            </div>
            <Button
              fontWeight={600}
              width={"full"}
              color={"white"}
              bg={"green.400"}
              onClick={async () => {
                router.push(`/admin/data/siswa/rekap/panggilan/${data.id}`);
              }}
              leftIcon={<DownloadIcon />}
              _hover={{
                bg: "green.300",
              }}
              mt={"10px"}
            >
              Rekap Bimbingan
            </Button>
          </div>
        </div>
      </>
    </AdminLayout>
  );
};

export default DetailSiswa;

interface ActionValue {
  value: any;
  refetch: any;
  toast: any;
  data: Siswa | any;
}

const ActionTable = ({ value, data, refetch, toast }: ActionValue) => {
  const { data: stateSession } = useSession();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [delLoading, setDelLoading] = useState(false);

  const { mutateAsync: hapusPelanggaran } = trpc.useMutation([
    "pelanggaran.delete",
  ]);

  const handleDeletePoint = useCallback(async (id: string) => {
    const delPoint = await hapusPelanggaran(id);
    if (delPoint.status === 200) {
      toast({
        title: "Hapus data point berhasil",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      refetch();
      setDelLoading(false);
      onClose();
    } else {
      toast({
        title: "Hapus data point gagal",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      setDelLoading(false);
    }
  }, []);

  return (
    <>
      <IconButton
        isLoading={delLoading}
        variant="outline"
        colorScheme="red"
        aria-label="delete"
        fontSize="20px"
        onClick={async () => {
          onOpen();
        }}
        icon={<IoTrash />}
      />
      <DeleteAlert
        isOpen={isOpen}
        onClick={async () => {
          setDelLoading(true);
          await handleDeletePoint(value);
        }}
        onClose={onClose}
        onOpen={onOpen}
        isLoading={delLoading}
        title={"Hapus point"}
        text={"Apa anda yakin ?"}
      />
    </>
  );
};

const ActionTableTindak = ({ value, data, refetch, toast }: ActionValue) => {
  const { data: stateSession } = useSession();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [delLoading, setDelLoading] = useState(false);

  const { mutateAsync: hapusTindak } = trpc.useMutation(["tindak.delete"]);

  const handleDeleteTindak = useCallback(async (id: string) => {
    const delPoint = await hapusTindak(id);
    if (delPoint.status === 200) {
      toast({
        title: "Hapus data berhasil",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      refetch();
      setDelLoading(false);
      onClose();
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
  }, []);

  return (
    <>
      <IconButton
        isLoading={delLoading}
        variant="outline"
        colorScheme="red"
        aria-label="delete"
        fontSize="20px"
        onClick={async () => {
          onOpen();
        }}
        icon={<IoTrash />}
      />
      <DeleteAlert
        isOpen={isOpen}
        onClick={async () => {
          setDelLoading(true);
          await handleDeleteTindak(value);
        }}
        onClose={onClose}
        onOpen={onOpen}
        isLoading={delLoading}
        title={"Hapus data"}
        text={"Apa anda yakin ?"}
      />
    </>
  );
};

const ActionTableTerlambat = ({ value, data, refetch, toast }: ActionValue) => {
  const { data: stateSession } = useSession();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [delLoading, setDelLoading] = useState(false);

  const { mutateAsync: hapusTerlambat } = trpc.useMutation([
    "terlambat.delete",
  ]);

  const handleDeleteTerlambat = useCallback(async (id: string) => {
    const delPoint = await hapusTerlambat(id);
    if (delPoint.status === 200) {
      toast({
        title: "Hapus data berhasil",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      refetch();
      setDelLoading(false);
      onClose();
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
  }, []);

  return (
    <>
      <IconButton
        isLoading={delLoading}
        variant="outline"
        colorScheme="red"
        aria-label="delete"
        fontSize="20px"
        onClick={async () => {
          onOpen();
        }}
        icon={<IoTrash />}
      />
      <DeleteAlert
        isOpen={isOpen}
        onClick={async () => {
          setDelLoading(true);
          await handleDeleteTerlambat(value);
        }}
        onClose={onClose}
        onOpen={onOpen}
        isLoading={delLoading}
        title={"Hapus data"}
        text={"Apa anda yakin ?"}
      />
    </>
  );
};
