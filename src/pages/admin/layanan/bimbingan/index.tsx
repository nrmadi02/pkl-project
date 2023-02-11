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
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Select,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import AdminLayout from "../../../../components/Layout/AdminLayout";
import { useForm } from "react-hook-form";
import {
  createPeriodeSchema,
  CreatePeriodeSchema,
} from "../../../../server/schema/periode.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../../../../utils/trpc";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getCookie } from "cookies-next";
import { Konseling, Siswa } from "@prisma/client";
import "moment/locale/id";
import DataTable from "../../../../components/DataTable/DataTable";
import moment from "moment";
import {
  updateStatusKonselingSchema,
  UpdateStatusKonselingSchema,
} from "../../../../server/schema/konseling.schema";
import { IoDownload, IoPencil } from "react-icons/io5";
import { DownloadIcon } from "@chakra-ui/icons";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
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
  return {
    props: {},
  };
};

const LayananBimbingan: NextPage = () => {
  const router = useRouter()
  const { data: stateSession} = useSession()
  const toast = useToast();
  const {
    data: dataKonseling,
    isLoading,
    refetch,
  } = trpc.useQuery(["konseling.getAll"]);
  const { data: dataDownload } = trpc.useQuery(["konseling.downloadData"]);

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

  const getData = (
    data: (Konseling & {
      siswa: Siswa;
    })[]
  ) => {
    const dataNew = data as (Konseling & {
      siswa: Siswa;
    })[];
    return dataNew;
  };

  const columns = useMemo(
    () => [
      {
        Header: "Nama Siswa",
        accessor: "siswa.nama",
      },
      {
        Header: "Kelas",
        accessor: "siswa.kelas",
      },
      {
        Header: "Tanggal",
        accessor: (
          d: Konseling & {
            siswa: Siswa;
          }
        ) => {
          return <p>{moment(d.tanggal).format("dddd, DD/MM/YYYY")}</p>;
        },
      },
      {
        Header: "Waktu",
        accessor: (d: Konseling) => {
          return d.jam ? <p>{d.jam}</p> : <p>-</p>;
        },
      },
      {
        Header: "Keluhan",
        accessor: "keluhan",
      },
      {
        Header: "Status",
        accessor: (d: Konseling) => {
          const ColorSchema = (data: string) => {
            type tplotOptions = {
              [key: string]: string;
            };
            const dataColor: tplotOptions = {
              Menunggu: "orange",
              Disetujui: "green",
              Ditolak: "red",
            };

            return dataColor[data];
          };
          return (
            <Badge size={"sm"} colorScheme={ColorSchema(d.status)}>
              {d.status}
            </Badge>
          );
        },
      },
      {
        Header: "Action",
        accessor: (d: Konseling) => {
          return stateSession?.role == "bk" ? (
            <ActionTable
              key={d?.id}
              value={d?.id}
              data={d}
              refetch={refetch}
              toast={toast}
            />
          ) : <p>-</p>;
        },
      },
    ],
    [dataKonseling?.result]
  );

  const data = useMemo(
    () => getData(dataKonseling?.result ? dataKonseling.result : []),
    [dataKonseling]
  );

  return (
    <AdminLayout
      title="Bimbingan"
      breadcrumb={
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Layanan</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Jadwal</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      }
    >
      <>
        <Head>
          <title>SMABAT || Jadwal Bimbingan</title>
          <meta name="description" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="p-5">
          <Tooltip label="Print Jadwal" fontSize="sm">
            <Button
            onClick={() => {
              router.push('/admin/layanan/bimbingan/rekap/setuju')
            }}
              leftIcon={<IoDownload />}
              fontWeight={600}
              marginBottom="20px"
              color={"white"}
              bg={"blue.400"}
              size={"sm"}
              _hover={{
                bg: "blue.300",
              }}
            >
              Print Jadwal
            </Button>
          </Tooltip>
          <div className="text-[12px]">
            <DataTable
              isSearch
              sizeSet
              hiddenColumns={[]}
              isLoading={isLoading}
              columns={columns}
              data={data}
            />
          </div>
          <Button
            fontWeight={600}
            width={"full"}
            color={"white"}
            bg={"green.400"}
            onClick={async () => {
              await exportToCSV(dataDownload?.result, `jadwal_konseling`);
            }}
            leftIcon={<DownloadIcon />}
            _hover={{
              bg: "green.300",
            }}
            mt={"20px"}
          >
            Download Data
          </Button>
        </div>
      </>
    </AdminLayout>
  );
};

export default LayananBimbingan;

interface ActionValue {
  value: any;
  refetch: any;
  toast: any;
  data: Konseling | any;
}

const ActionTable = ({ data, refetch, toast, value }: ActionValue) => {
  const [delLoading, setDelLoading] = useState(false);
  const { onOpen, onClose, isOpen } = useDisclosure();
  const {
    onOpen: onOpenDel,
    onClose: onCloseDel,
    isOpen: isOpenDel,
  } = useDisclosure();
  const firstFieldRef = useRef(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<UpdateStatusKonselingSchema>({
    resolver: zodResolver(updateStatusKonselingSchema),
    mode: "onChange",
  });

  const { mutateAsync: updateStatus } = trpc.useMutation([
    "konseling.updateStatus",
  ]);

  const handleUbahStatus = useCallback(
    async (data: UpdateStatusKonselingSchema) => {
      const update = await updateStatus(data);
      if (update.status === 200) {
        toast({
          title: "Ubah status berhasil",
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        refetch();
        setDelLoading(false);
        onClose();
        reset({ jam: "", status: "" });
      } else {
        toast({
          title: "Ubah status gagal",
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        setDelLoading(false);
      }
    },
    []
  );

  return (
    <Flex alignItems={"center"} gap={"2"}>
      <Popover
        isOpen={isOpen}
        initialFocusRef={firstFieldRef}
        onOpen={() => {
          onOpen();
        }}
        onClose={onClose}
        placement="auto-start"
        closeOnBlur={false}
      >
        <PopoverTrigger>
          <IconButton
            // isLoading={delLoading}
            variant="outline"
            colorScheme="orange"
            aria-label="edit status"
            fontSize="20px"
            size={"sm"}
            onClick={async () => {
              onOpen();
            }}
            icon={<IoPencil />}
          />
        </PopoverTrigger>
        <PopoverContent p={5}>
          <PopoverArrow />
          <PopoverCloseButton />
          <form onSubmit={handleSubmit(handleUbahStatus)}>
            <Input
              // ref={firstFieldRef}
              type={"hidden"}
              bg={"white"}
              borderColor={"orange.300"}
              borderWidth={1}
              id="id"
              defaultValue={value}
              placeholder="Edit nama kelas"
              {...register("id")}
            />
            <FormControl isInvalid={errors.jam != undefined}>
              <FormLabel htmlFor="perihal">Jam</FormLabel>
              <Input
                bg={"white"}
                borderColor={"orange.300"}
                borderWidth={1}
                id="judul"
                type={"time"}
                placeholder="Masukan jam bimbingan"
                {...register("jam")}
              />
              <FormErrorMessage>
                {errors.jam && errors.jam.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.status != undefined}>
              <FormLabel htmlFor="name">Status</FormLabel>
              <Select
                bg={"white"}
                borderColor={"orange.300"}
                borderWidth={1}
                id="status"
                placeholder="Pilih..."
                {...register("status")}
              >
                <option value="Menunggu">Menunggu</option>
                <option value="Ditolak">Ditolak</option>
                <option value="Disetujui">Disetujui</option>
              </Select>
              <FormErrorMessage>
                {errors.status && "Harus dipilih"}
              </FormErrorMessage>
            </FormControl>
            <Button
              disabled={!isValid}
              isLoading={isSubmitting}
              type="submit"
              fontWeight={600}
              color={"white"}
              bg={"orange.400"}
              _hover={{
                bg: "orange.300",
              }}
              mt={"10px"}
            >
              Update
            </Button>
          </form>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};
