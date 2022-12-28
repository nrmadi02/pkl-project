import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Text, Button, Checkbox, Flex, FormControl, FormErrorMessage, FormLabel, Heading, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Popover, PopoverTrigger, Select, useDisclosure, useToast, Divider, Link } from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IoAdd, IoPencil, IoTrash } from "react-icons/io5";
import AdminLayout from "../../../components/Layout/AdminLayout";
import { CreateGuruSchema, createGuruSchema, UpdateGuruSchema, updateGuruSchema } from "../../../server/schema/guru.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DrawerForm from "../../../components/DrawerForm";
import { trpc } from "../../../utils/trpc";
import Image from "next/image";
import { Guru, Kelas, Siswa } from "@prisma/client";
import DataTable from "../../../components/DataTable/DataTable";
import { createSiswaSchema, CreateSiswaSchema, updateSiswaSchema, UpdateSiswaSchema, UploadSiswaSchema, uploadSiswaSchema } from "../../../server/schema/siswa.schema";
import { FaFileExcel } from "react-icons/fa";
import readXlsxFile from 'read-excel-file'
import { getCookie } from "cookies-next";
import NextLink from 'next/link'
import { useSession } from "next-auth/react";
import DeleteAlert from "../../../components/Alert/Delete";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { DownloadIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

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
        props: {
        }
    }
}

const DataSiswa: NextPage = () => {
    const { data: stateSession } = useSession();
    const router = useRouter()
    // console.log(stateSession)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure()
    const btnRef = useRef<HTMLButtonElement>(null)
    const [show, setShow] = useState(false)
    const toast = useToast()
    const [file, setFile] = useState('')
    const [img, setImg] = useState()
    const [selectKelas, setSelectKelas] = useState('')
    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting, isDirty, isValid } } = useForm<CreateSiswaSchema>({
        resolver: zodResolver(createSiswaSchema),
        mode: "onChange"
    });

    const { register: registerUpload, handleSubmit: submitUpload, watch: watchUpload, setValue: setValueUpload, formState: { errors: errorsUpload, isSubmitting: isSubmitUpload, isDirty: isDirtyUpload, isValid: isValidUpload } } = useForm<UploadSiswaSchema>({
        resolver: zodResolver(uploadSiswaSchema),
        mode: "onChange"
    });

    const OverlayTwo = () => (
        <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(5px)'
        />
    )

    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    const exportToCSV = (apiData: any, fileName: any) => {
        const ws = XLSX.utils.json_to_sheet(apiData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    const handleChangeFile = (e: any) => {
        e.target?.files[0] && setFile(URL.createObjectURL(e.target?.files[0]))
        if (e.target?.files) {
            const filereader = new FileReader();
            filereader.readAsDataURL(e.target?.files[0]);
            filereader.onload = function (evt) {
                const base64 = evt.target?.result;
                setImg(e.target?.files[0])
                setValue("potoProfile", String(base64))
            }
        }
    }

    interface DataArr {
        nama: string;
        nis: string;
        email: string;
        jenisKelamin: string;
    }

    const handleChangeUpload = async (e: any) => {
        const arrData: DataArr[] = []
        await readXlsxFile(e.target?.files[0]).then((rows) => {
            // `rows` is an array of rows
            // each row being an array of cells.
            rows.map((itm, idx) => {
                if (idx != 0) {
                    const data = {
                        nama: itm[0],
                        nis: String(itm[2]),
                        email: itm[1],
                        jenisKelamin: itm[3]
                    } as DataArr
                    arrData.push(data)
                }
            })
        })
        setValueUpload('data', arrData)
    }

    const { data: dataKelas } = trpc.useQuery(['kelas.getAll'])
    const { mutateAsync: tambahSiswa } = trpc.useMutation(['siswa.create'])
    const { data: dataSiswa, isLoading, refetch } = trpc.useQuery(['siswa.getAll', selectKelas], {
        refetchOnWindowFocus: false
    })
    const { mutateAsync: uploadSiswa } = trpc.useMutation(['siswa.createBulk'])
    const { data: Periode } = trpc.useQuery(['periode.get'], {
        refetchOnWindowFocus: false
    })

    const getData = (data: Siswa[] | undefined) => {
        const dataNew = data as Siswa[]
        return dataNew
    }

    const columns = useMemo(() => [
        {
            Header: "Nama",
            accessor: (d: Siswa) => {
                return <InfoSiswa data={d} />
            }
        },
        {
            Header: "nama",
            accessor: "nama"
        },
        {
            Header: "Email",
            accessor: "email",
        },
        {
            Header: "Nomor Induk",
            accessor: "nis"
        },
        {
            Header: "Jenis Kelamin",
            accessor: "jenisKelamin"
        },
        {
            Header: "Kelas",
            accessor: 'kelas'
        },
        {
            Header: "Action",
            accessor: (d: Siswa) => {
                return <ActionTable key={d?.id} dataKelas={dataKelas?.result} value={d?.id} data={d} refetch={refetch} toast={toast} />
            },
        }
    ], [dataSiswa?.result])

    const data = useMemo(() => getData(dataSiswa?.result ? dataSiswa.result : []), [dataSiswa]);

    const handleUploadSiswa = useCallback(
        async (data: UploadSiswaSchema) => {
            const result: any = await uploadSiswa(data);
            if (result.status === 201) {
                // router.push("/")
                onCloseModal()
                toast({
                    title: 'Upload data siswa berhasil',
                    status: 'success',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                })
                refetch()
                // console.log(result)
            } else {
                toast({
                    title: 'Upload data siswa gagal',
                    status: 'error',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                })
            }
        },
        [uploadSiswa]
    );

    const handleAddSiswa = useCallback(
        async (data: CreateSiswaSchema) => {
            const result: any = await tambahSiswa(data);
            if (result.status === 201) {
                // router.push("/")
                setFile('')
                onClose()
                toast({
                    title: 'Tambah data siswa berhasil',
                    status: 'success',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                })
                refetch()
                // console.log(result)
            } else {
                toast({
                    title: 'Tambah data siswa gagal',
                    status: 'error',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                })
            }
        },
        [tambahSiswa]
    );

    useEffect(() => {
        const subs = watch((e) => {
            // console.log(e)
        })

        return () => subs.unsubscribe()
    }, [watch])

    useEffect(() => {
        const subs = watchUpload((e) => {
            // console.log(e)
        })

        return () => subs.unsubscribe()
    }, [watchUpload])

    useEffect(() => {
        file == '' && setValue('potoProfile', null)
    }, [file])

    return (
      <AdminLayout
        title="Siswa"
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Pendataan</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Siswa</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        }
      >
        <>
          <Head>
            <title>SMABAT || Siswa</title>
            <meta name="description" content="Generated by create-t3-app" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className="p-5">
            <Heading size={"md"}>
              Tahun Ajaran {Periode?.result ? Periode?.result : "-"}
            </Heading>
            <div className="flex mb-5 mt-5 flex-col-reverse md:flex-row items-center justify-between">
              <div className="flex gap-5 w-full flex-row items-center">
                <p>Filter</p>
                <Select
                  bg={"white"}
                  onChange={(e) => {
                    setSelectKelas(e.target.value);
                  }}
                  borderColor={"orange.300"}
                  borderWidth={2}
                  id="kelas"
                  placeholder="Kelas ---"
                >
                  {dataKelas &&
                    dataKelas.result.map((itm, idx) => {
                      return (
                        <option key={idx} value={itm.name}>
                          Kelas {itm.name}
                        </option>
                      );
                    })}
                </Select>
              </div>
              <div className="w-full mb-5 md:mb-0 flex gap-x-5 justify-end items-center">
                <Button
                  onClick={onOpenModal}
                  ref={btnRef}
                  leftIcon={<FaFileExcel />}
                  fontWeight={600}
                  color={"white"}
                  bg={"green.400"}
                  _hover={{
                    bg: "green.300",
                  }}
                >
                  Upload
                </Button>
                <Button
                  onClick={onOpen}
                  ref={btnRef}
                  leftIcon={<IoAdd />}
                  fontWeight={600}
                  color={"white"}
                  bg={"orange.400"}
                  _hover={{
                    bg: "orange.300",
                  }}
                >
                  Tambah data
                </Button>
              </div>
            </div>
            <div className="text-[14px]">
              <DataTable
                isSearch
                sizeSet
                isLoading={isLoading}
                hiddenColumns={["email", "nama"]}
                columns={columns}
                data={data}
              />
            </div>
            {!selectKelas ? (
              <Button
                fontWeight={600}
                width={"full"}
                color={"white"}
                bg={"green.400"}
                onClick={async () => {
                  exportToCSV(dataSiswa?.result, `data_siswa`);
                }}
                leftIcon={<DownloadIcon />}
                _hover={{
                  bg: "green.300",
                }}
                mt={"10px"}
              >
                Download data siswa
              </Button>
            ) : (
              <NextLink href={`/admin/data/siswa/rekap/perkelas/${selectKelas}`}>
                <Button
                  fontWeight={600}
                  width={"full"}
                  color={"white"}
                  bg={"green.400"}
                  leftIcon={<DownloadIcon />}
                  _hover={{
                    bg: "green.300",
                  }}
                  mt={"10px"}
                >
                  {`Print Data Siswa Kelas ${selectKelas}`}
                </Button>
              </NextLink>
            )}
          </div>
          <Modal isCentered isOpen={isOpenModal} onClose={onCloseModal}>
            <OverlayTwo />
            <ModalContent>
              <ModalHeader>Upload banyak siswa</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <div>
                  <span>Download contoh file excel : </span>
                  <Link
                    download={true}
                    href="../../test_excel.xlsx"
                    color={"orange.400"}
                  >
                    Download
                  </Link>
                </div>
                <Divider mt={"2"} />
                <Heading mt={"2"} size={"md"}>
                  File
                </Heading>
                <form
                  onSubmit={submitUpload(handleUploadSiswa)}
                  id="upload-form"
                  className="mt-2"
                >
                  <FormControl isInvalid={errorsUpload.data != undefined}>
                    {/* <FormLabel htmlFor='file'>File</FormLabel> */}
                    <Input
                      accept=".xlsx, .xls, .csv"
                      py={"1"}
                      bg={"white"}
                      borderColor={"orange.300"}
                      borderWidth={1}
                      id="file"
                      required={true}
                      placeholder="Masukan file"
                      type={"file"}
                      onChange={handleChangeUpload}
                      // {...register('file_excel', {
                      //     required: 'This is required',
                      // })}
                    />
                    <FormErrorMessage>
                      {errorsUpload.data && "data harus ada"}
                    </FormErrorMessage>
                  </FormControl>
                  <Heading mt={"3"} size={"md"}>
                    Kelas
                  </Heading>
                  <FormControl
                    mt={"2"}
                    isInvalid={errorsUpload.kelas != undefined}
                  >
                    {/* <FormLabel htmlFor='kelas'>Pilih Kelas</FormLabel> */}
                    <Select
                      bg={"white"}
                      borderColor={"orange.300"}
                      borderWidth={1}
                      id="kelas"
                      placeholder="Pilih kelas"
                      {...registerUpload("kelas")}
                    >
                      {dataKelas &&
                        dataKelas.result.map((itm, idx) => {
                          return (
                            <option key={idx} value={itm.name}>
                              {itm.name}
                            </option>
                          );
                        })}
                    </Select>
                    <FormErrorMessage>
                      {errorsUpload.kelas && "kelas harus di isi"}
                    </FormErrorMessage>
                  </FormControl>
                </form>
              </ModalBody>
              <ModalFooter gap={3}>
                <Button onClick={onCloseModal}>Close</Button>
                <Button
                  type="submit"
                  form="upload-form"
                  isLoading={isSubmitUpload}
                  fontWeight={600}
                  color={"white"}
                  bg={"green.400"}
                  _hover={{
                    bg: "green.300",
                  }}
                >
                  Upload
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <DrawerForm
            btnRef={btnRef}
            isOpen={isOpen}
            onClose={() => {
              setFile("");
              onClose();
            }}
            bottomButtons={
              <>
                <Button
                  variant="outline"
                  mr={3}
                  onClick={() => {
                    setFile("");
                    onClose();
                  }}
                >
                  Batal
                </Button>
                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  form="my-form"
                  fontWeight={600}
                  color={"white"}
                  bg={"orange.400"}
                  _hover={{
                    bg: "orange.300",
                  }}
                >
                  Simpan
                </Button>
              </>
            }
          >
            <div className="pt-5">
              <Heading size={"lg"} mb="5">
                Tambah data siswa
              </Heading>
              <form id="my-form" onSubmit={handleSubmit(handleAddSiswa)}>
                <Flex w={"full"} flexDirection={"column"} gap={"10px"}>
                  <FormControl isInvalid={errors.potoProfile != undefined}>
                    <FormLabel htmlFor="foto">Foto (optional)</FormLabel>
                    <Input
                      type="file"
                      accept="image/*"
                      bg={"white"}
                      borderColor={"orange.300"}
                      borderWidth={1}
                      id="input-file-upload"
                      className="hidden"
                      {...register("potoProfile")}
                      onChange={handleChangeFile}
                    />
                    {!file && (
                      <label id="label-file-upload" htmlFor="input-file-upload">
                        <div className="flex rounded hover:scale-[1.01] transition-all border-[1px] cursor-pointer border-orange-300 flex-col items-center justify-center w-[200px] h-[230px]">
                          <IoAdd size={"50"} color="#F6AD55" />
                        </div>
                      </label>
                    )}
                    {file && (
                      <label id="label-file-upload" htmlFor="input-file-upload">
                        <div className="w-[200px] h-[230px] cursor-pointer hover:scale-[1.01] transition-all rounded-md border-[2px] border-orange-300">
                          <Image
                            className="rounded-md"
                            width={200}
                            height={230}
                            alt="_img"
                            src={file}
                          />
                        </div>
                      </label>
                    )}
                    {/* <FormErrorMessage>
                                        {errors.potoProfile && errors.potoProfile.message?.toString()}
                                    </FormErrorMessage> */}
                  </FormControl>
                  <FormControl isInvalid={errors.nama != undefined}>
                    <FormLabel htmlFor="name">Nama Siswa</FormLabel>
                    <Input
                      bg={"white"}
                      borderColor={"orange.300"}
                      borderWidth={1}
                      id="nama"
                      placeholder="Masukan nama siswa"
                      {...register("nama")}
                    />
                    <FormErrorMessage>
                      {errors.nama && errors.nama.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={errors.email != undefined}>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      bg={"white"}
                      borderColor={"orange.300"}
                      borderWidth={1}
                      id="email"
                      placeholder="Masukan email"
                      {...register("email", {
                        required: "This is required",
                      })}
                    />
                    <FormErrorMessage>
                      {errors.email && errors.email.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={errors.nis != undefined}>
                    <FormLabel htmlFor="nomorInduk">Nomor Induk</FormLabel>
                    <Input
                      bg={"white"}
                      borderColor={"orange.300"}
                      borderWidth={1}
                      id="nis"
                      placeholder="Masukan nomor induk"
                      {...register("nis")}
                    />
                    <FormErrorMessage>
                      {errors.nis && errors.nis.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={errors.jenisKelamin != undefined}>
                    <FormLabel htmlFor="jenisKelamin">Jenis Kelamin</FormLabel>
                    <Select
                      bg={"white"}
                      borderColor={"orange.300"}
                      borderWidth={1}
                      id="jenisKelamin"
                      placeholder="Pilih jenis kelamin"
                      {...register("jenisKelamin")}
                    >
                      <option value={"Laki-laki"}>Laki-laki</option>
                      <option value={"Perempuan"}>Perempuan</option>
                    </Select>
                    <FormErrorMessage>
                      {errors.jenisKelamin && "Jenis kelamin harus di isi"}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={errors.kelas != undefined}>
                    <FormLabel htmlFor="kelas">Pilih Kelas</FormLabel>
                    <Select
                      bg={"white"}
                      borderColor={"orange.300"}
                      borderWidth={1}
                      id="kelas"
                      placeholder="Pilih kelas"
                      {...register("kelas")}
                    >
                      {dataKelas &&
                        dataKelas.result.map((itm, idx) => {
                          return (
                            <option key={idx} value={itm.name}>
                              {itm.name}
                            </option>
                          );
                        })}
                    </Select>
                    <FormErrorMessage>
                      {errors.kelas && "kelas harus di isi"}
                    </FormErrorMessage>
                  </FormControl>
                </Flex>
              </form>
            </div>
          </DrawerForm>
        </>
      </AdminLayout>
    );
}

export default DataSiswa

interface InfoSiswa {
    data: Siswa
}

const InfoSiswa = ({ data }: InfoSiswa) => {
    return (
        <div className="flex flex-row items-center gap-x-[10px]">
            <div className="w-[60px] h-[60px]">
                <Image className="rounded-full" width={60} height={60} alt="_profile" src={data.fotoProfile ? data.fotoProfile : `https://ui-avatars.com/api/?name=${data.nama.split(' ').join('+')}`} />
            </div>
            <NextLink href={`/admin/data/siswa/${data.id}`}>
                <div className="group flex cursor-pointer flex-col gap-y-[5px]">
                    <p className="font-bold group-hover:text-orange-400 transition-all group-hover:scale-105 group-active:scale-100">{data.nama}</p>
                    <p>{data.email}</p>
                </div>
            </NextLink>
        </div>
    )
}

interface ActionValue {
    value: any,
    refetch: any,
    toast: any,
    data: Siswa
    dataKelas: Kelas[] | undefined
}

const ActionTable = ({ value, data, refetch, toast, dataKelas }: ActionValue) => {
    const { onOpen, onClose, isOpen } = useDisclosure()
    const { onOpen: onOpenDel, onClose: onCloseDel, isOpen: isOpenDel } = useDisclosure()
    const firstFieldRef = useRef(null)
    const [delLoading, setDelLoading] = useState(false)
    const [file, setFile] = useState('')
    const [img, setImg] = useState()
    const [onCheck, setOnCheck] = useState(false)

    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting, isDirty, isValid } } = useForm<UpdateSiswaSchema>({
        resolver: zodResolver(updateSiswaSchema),
        mode: "onChange"
    });

    const handleChangeFile = (e: any) => {
        e.target?.files[0] && setFile(URL.createObjectURL(e.target?.files[0]))
        if (e.target?.files) {
            const filereader = new FileReader();
            filereader.readAsDataURL(e.target?.files[0]);
            filereader.onload = function (evt) {
                const base64 = evt.target?.result;
                setImg(e.target?.files[0])
                setValue("potoProfile", String(base64))
            }
        }
    }

    const { mutateAsync: hapusSiswa } = trpc.useMutation(['siswa.delete'])
    const { mutateAsync: editSiswa } = trpc.useMutation('siswa.update')

    const handleUpdateSiswa = useCallback(
        async (d: UpdateSiswaSchema) => {
            const updateSiswa = await editSiswa(d)
            if (updateSiswa.status === 200) {
                toast({
                    title: 'Edit data siswa berhasil',
                    status: 'success',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                })
                refetch()
                setDelLoading(false)
                onClose()
            } else {
                toast({
                    title: 'Edit data siswa gagal',
                    status: 'error',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                })
                setDelLoading(false)
            }
        }, []
    )

    const handleDeleteSiswa = useCallback(
        async (id: string) => {
            const delGuru = await hapusSiswa({
                id: id
            })
            if (delGuru.status === 200) {
                toast({
                    title: 'Hapus data siswa berhasil',
                    status: 'success',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                })
                refetch()
                setDelLoading(false)
                onCloseDel()
            } else {
                toast({
                    title: 'Hapus data siswa gagal',
                    status: 'error',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                })
                setDelLoading(false)
            }
        }, []
    )

    return (
        <Flex alignItems={'center'} gap={'2'}>
            <IconButton
                // isLoading={delLoading}
                variant='outline'
                colorScheme='orange'
                aria-label='update'
                fontSize='20px'
                onClick={async () => {
                    onOpen()
                    setValue('email', data.email)
                    setValue('id', data.id)
                    setValue('jenisKelamin', data.jenisKelamin)
                    setValue('nama', data.nama)
                    setValue('nis', data.nis)
                    setValue('kelas', data.kelas!)
                    setValue('potoProfile', null)
                    data.fotoProfile ? setFile(data.fotoProfile) : setFile('')
                }}
                icon={<IoPencil />}
            />
            <IconButton
                isLoading={delLoading}
                variant='outline'
                colorScheme='red'
                aria-label='delete'
                fontSize='20px'
                onClick={async () => {
                    onOpenDel()
                }}
                icon={<IoTrash />}
            />
            <DeleteAlert isOpen={isOpenDel} onClick={async () => {
                setDelLoading(true)
                await handleDeleteSiswa(data.id)
            }} onClose={onCloseDel} onOpen={onOpenDel} isLoading={delLoading} title={'Hapus siswa'} text={'Apa anda yakin ?'} />
            <DrawerForm btnRef={firstFieldRef} isOpen={isOpen} onClose={() => {
                onClose()
            }} bottomButtons={
                <>
                    <Button variant='outline' mr={3} onClick={() => {
                        onClose()
                    }}>
                        Batal
                    </Button>
                    <Button isLoading={isSubmitting} type='submit' form='form-update' fontWeight={600}
                        color={'white'}
                        bg={'orange.400'}
                        _hover={{
                            bg: 'orange.300',
                        }}>
                        Update
                    </Button>
                </>
            }>
                <div className='pt-5'>
                    <Heading size={'lg'} mb='5'>Edit data siswa</Heading>
                    <form id='form-update' onSubmit={handleSubmit(handleUpdateSiswa)}>
                        <Flex w={'full'} flexDirection={'column'} gap={'10px'}>
                            <FormControl isInvalid={errors.potoProfile != undefined}>
                                <FormLabel htmlFor='foto'>Foto (optional)</FormLabel>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                    id='input-file-upload'
                                    className="hidden"
                                    {...register('potoProfile')}
                                    onChange={handleChangeFile}
                                />
                                {!file && <label id="label-file-upload" htmlFor="input-file-upload">
                                    <div className="flex rounded hover:scale-[1.01] transition-all border-[1px] cursor-pointer border-orange-300 flex-col items-center justify-center w-[200px] h-[230px]">
                                        <IoAdd size={'50'} color='#F6AD55' />
                                    </div>
                                </label>}
                                {file && <label id="label-file-upload" htmlFor="input-file-upload">
                                    <div className="w-[200px] h-[230px] cursor-pointer hover:scale-[1.01] transition-all rounded-md border-[2px] border-orange-300">
                                        <Image className="rounded-md" width={200} height={230} alt='_img' src={file} />
                                    </div>

                                </label>}
                                {/* <FormErrorMessage>
                                        {errors.potoProfile && errors.potoProfile.message?.toString()}
                                    </FormErrorMessage> */}
                            </FormControl>
                            <Input
                                bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                id='id'
                                type={'hidden'}
                                // placeholder='Masukan nama guru'
                                {...register('id')}
                            />
                            <FormControl isInvalid={errors.nama != undefined}>
                                <FormLabel htmlFor='name'>Nama Siswa</FormLabel>
                                <Input
                                    bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                    id='nama'
                                    placeholder='Masukan nama guru'
                                    {...register('nama')}
                                />
                                <FormErrorMessage>
                                    {errors.nama && errors.nama.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.email != undefined}>
                                <FormLabel htmlFor='email'>Email</FormLabel>
                                <Input
                                    bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                    id='email'
                                    placeholder='Masukan email'
                                    {...register('email', {
                                        required: 'This is required',
                                    })}
                                />
                                <FormErrorMessage>
                                    {errors.email && errors.email.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.nis != undefined}>
                                <FormLabel htmlFor='nomorInduk'>Nomor Induk</FormLabel>
                                <Input
                                    bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                    id='nis'
                                    placeholder='Masukan nomor induk'
                                    {...register('nis')}
                                />
                                <FormErrorMessage>
                                    {errors.nis && errors.nis.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.jenisKelamin != undefined}>
                                <FormLabel htmlFor='jenisKelamin'>Jenis Kelamin</FormLabel>
                                <Select bg={'white'} borderColor={'orange.300'} borderWidth={1} id='jenisKelamin' placeholder='Pilih jenis kelamin' {...register('jenisKelamin')}>
                                    <option value={'Laki-laki'}>Laki-laki</option>
                                    <option value={'Perempuan'}>Perempuan</option>
                                </Select>
                                <FormErrorMessage>
                                    {errors.jenisKelamin && "Jenis kelamin harus di isi"}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.kelas != undefined}>
                                <FormLabel htmlFor='namaKelas'>Pilih Kelas</FormLabel>
                                <Select bg={'white'} borderColor={'orange.300'} borderWidth={1} id='kelas' placeholder='Pilih kelas' {...register('kelas')}>
                                    {dataKelas && dataKelas.map((itm, idx) => {
                                        return <option key={idx} value={itm.name}>{itm.name}</option>
                                    })}
                                </Select>
                                <FormErrorMessage>
                                    {errors.kelas && "Nama kelas harus di isi"}
                                </FormErrorMessage>
                            </FormControl>
                        </Flex>
                    </form>
                </div>
            </DrawerForm>
        </Flex>
    )
}