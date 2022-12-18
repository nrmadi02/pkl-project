import { Badge, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, IconButton, Input, Popover, PopoverArrow, PopoverCloseButton, PopoverContent, PopoverTrigger, Select, Textarea, useDisclosure, useToast } from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { getCookie } from "cookies-next";
import AdminLayout from "../../../../components/Layout/AdminLayout";
import { IoAdd, IoDownload, IoPencil, IoTrash } from "react-icons/io5";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Guru, Lab } from "@prisma/client";
import { trpc } from "../../../../utils/trpc";
import DataTable from "../../../../components/DataTable/DataTable";
import DrawerForm from "../../../../components/DrawerForm";
import { createPengajuanLabSchema, CreatePengajuanLabSchema, updateStatusPengajuanSchema } from "../../../../server/schema/lab.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import moment from "moment";
import 'moment/locale/id'
import DeleteAlert from "../../../../components/Alert/Delete";

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

const PengajuanLab: NextPage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef<HTMLButtonElement>(null)
    const toast = useToast()

    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting, isDirty, isValid } } = useForm<CreatePengajuanLabSchema>({
        resolver: zodResolver(createPengajuanLabSchema),
        mode: "onChange"
    });

    const { data: dataPengajuan, isLoading, refetch } = trpc.useQuery(['lab.getAll'])
    const { data: dataGuru, } = trpc.useQuery(['guru.getAll'])
    const { mutateAsync: tambahPengajuan } = trpc.useMutation(['lab.create'])

    const onSubmit = useCallback(
        async (data: CreatePengajuanLabSchema) => {
            const result: any = await tambahPengajuan(data);
            if (result.status === 201) {
                // router.push("/")
                onClose()
                toast({
                    title: 'Pengajuan data berhasil',
                    status: 'success',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                })
                refetch()
                // console.log(result)
            } else {
                toast({
                    title: 'Pengajuan data gagal',
                    status: 'error',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                })
            }
        },
        [tambahPengajuan]
    );

    const getData = (data: (Lab & {
        guru: Guru;
    })[] | undefined) => {
        const dataNew = data as (Lab & {
            guru: Guru;
        })[] | undefined
        return dataNew
    }

    const columns = useMemo(() => [
        {
            Header: "Lab",
            accessor: "type"
        },
        {
            Header: "Guru",
            accessor: (d: (Lab & {
                guru: Guru;
            })) => {
                return (
                    <p>{d.guru.nama}</p>
                )
            }
        },
        {
            Header: "Hari, Tanggal",
            accessor: (d: Lab) => {
                return (
                    <p>{moment(d.tanggal).format("dddd, DD/MM/YYYY")}</p>
                )
            }
        },
        {
            Header: "Jam",
            accessor: (d: Lab) => {
                return (
                    <p>{d.start_jam}/{d.end_jam}</p>
                )
            }
        },
        {
            Header: "status",
            accessor: "status"
        },
        {
            Header: "Status",
            accessor: (d: Lab) => {
                const ColorSchema = (data: string) => {
                    type tplotOptions = {
                        [key: string]: string
                    }
                    const dataColor: tplotOptions = {
                        "Menunggu": "yellow",
                        "Disetujui": "green",
                        "Ditolak": "red"
                    }

                    return dataColor[data]
                }
                return (
                    <Badge size={'sm'} colorScheme={ColorSchema(d.status)}>{d.status}</Badge>
                )
            }
        },
        {
            Header: "Action",
            accessor: (d: Lab) => {
                return <ActionTable key={d?.id} status={d.status} value={d?.id} refetch={refetch} toast={toast} />
            },
        }
    ], [dataPengajuan?.result])

    const data = useMemo(() => getData(dataPengajuan?.result ? dataPengajuan.result : []), [dataPengajuan]);

    useEffect(() => {
        setValue('status', 'Menunggu')
    })

    return (
        <AdminLayout title='Pengajuan' breadcrumb={(
            <Breadcrumb>
                <BreadcrumbItem>
                    <BreadcrumbLink href='#'>Labkom</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <BreadcrumbLink href='#'>Pengajuan</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
        )}>
            <>
                <Head>
                    <title>SMABAT || Pengajuan Labkom</title>
                    <meta name="description" content="Generated by create-t3-app" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <div className="p-5">
                    <div className='w-full mb-5 flex gap-5 justify-end items-end'>
                        <Button onClick={onOpen} ref={btnRef} leftIcon={<IoAdd />} fontWeight={600}
                            color={'white'}
                            bg={'orange.400'}
                            _hover={{
                                bg: 'orange.300',
                            }}>
                            Ajukan
                        </Button>
                        <Button ref={btnRef} leftIcon={<IoDownload />} fontWeight={600}
                            color={'white'}
                            bg={'green.400'}
                            _hover={{
                                bg: 'green.300',
                            }}>
                            Download
                        </Button>
                    </div>
                    <div className="text-[12px]">
                        <DataTable isSearch sizeSet hiddenColumns={['status']} isLoading={isLoading} columns={columns} data={data} />
                    </div>
                </div>
                <DrawerForm btnRef={btnRef} isOpen={isOpen} onClose={onClose} bottomButtons={
                    <>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Batal
                        </Button>
                        <Button disabled={!isValid} isLoading={isSubmitting} type='submit' form='my-form' fontWeight={600}
                            color={'white'}
                            bg={'orange.400'}
                            _hover={{
                                bg: 'orange.300',
                            }}>
                            Simpan
                        </Button>
                    </>
                }>
                    <div className='pt-5'>
                        <Heading size={'lg'} mb='5'>Tambah Pengajuan</Heading>
                        <form id='my-form' onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-3">
                                <FormControl isInvalid={errors.type != undefined}>
                                    <FormLabel htmlFor='type'>Pilih LAB</FormLabel>
                                    <Select bg={'white'} borderColor={'orange.300'} borderWidth={1} id='type' placeholder='Pilih...' {...register('type')}>
                                        <option value='LAB 1'>LAB 1</option>
                                        <option value='LAB 2'>LAB 2</option>
                                        <option value='LAB 3'>LAB 3</option>
                                    </Select>
                                    <FormErrorMessage>
                                        {errors.type && "Harus di pilih"}
                                    </FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={errors.deskripsi != undefined}>
                                    <FormLabel htmlFor='deskripsi'>Deskripsi</FormLabel>
                                    <Textarea
                                        bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                        id='deskripsi'
                                        placeholder='Masukan deskripsi'
                                        {...register('deskripsi')}
                                    />
                                    <FormErrorMessage>
                                        {errors.deskripsi && errors.deskripsi.message}
                                    </FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={errors.start_jam != undefined}>
                                    <FormLabel htmlFor='start_jam'>Pilih JAM Awal</FormLabel>
                                    <Select bg={'white'} borderColor={'orange.300'} borderWidth={1} id='start_jam' placeholder='Pilih...' {...register('start_jam')}>
                                        <option value='Jam-1'>Jam-1</option>
                                        <option value='Jam-2'>Jam-2</option>
                                        <option value='Jam-3'>Jam-3</option>
                                        <option value='Jam-4'>Jam-4</option>
                                        <option value='Jam-5'>Jam-5</option>
                                        <option value='Jam-6'>Jam-6</option>
                                        <option value='Jam-7'>Jam-7</option>
                                        <option value='Jam-8'>Jam-8</option>
                                        <option value='Jam-9'>Jam-9</option>
                                        <option value='Jam-10'>Jam-10</option>
                                        <option value='Jam-11'>Jam-11</option>
                                        <option value='Jam-12'>Jam-12</option>
                                        <option value='Jam-13'>Jam-13</option>
                                        <option value='Jam-14'>Jam-14</option>
                                    </Select>
                                    <FormErrorMessage>
                                        {errors.start_jam && "Harus di pilih"}
                                    </FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={errors.end_jam != undefined}>
                                    <FormLabel htmlFor='end_jam'>Pilih JAM Akhir</FormLabel>
                                    <Select bg={'white'} borderColor={'orange.300'} borderWidth={1} id='end_jam' placeholder='Pilih...' {...register('end_jam')}>
                                        <option value='Jam-1'>Jam-1</option>
                                        <option value='Jam-2'>Jam-2</option>
                                        <option value='Jam-3'>Jam-3</option>
                                        <option value='Jam-4'>Jam-4</option>
                                        <option value='Jam-5'>Jam-5</option>
                                        <option value='Jam-6'>Jam-6</option>
                                        <option value='Jam-7'>Jam-7</option>
                                        <option value='Jam-8'>Jam-8</option>
                                        <option value='Jam-9'>Jam-9</option>
                                        <option value='Jam-10'>Jam-10</option>
                                        <option value='Jam-11'>Jam-11</option>
                                        <option value='Jam-12'>Jam-12</option>
                                        <option value='Jam-13'>Jam-13</option>
                                        <option value='Jam-14'>Jam-14</option>
                                    </Select>
                                    <FormErrorMessage>
                                        {errors.end_jam && "Harus di pilih"}
                                    </FormErrorMessage>
                                </FormControl>
                                <Input
                                    bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                    id='status'
                                    type={'hidden'}
                                    placeholder='Masukan status'
                                    {...register('status')}
                                />
                                <FormControl isInvalid={errors.tanggal != undefined}>
                                    <FormLabel htmlFor='tanggal'>Tanggal</FormLabel>
                                    <Input
                                        bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                        id='tanggal'
                                        type={'date'}
                                        placeholder='Masukan tanggal'
                                        {...register('tanggal')}
                                    />
                                    <FormErrorMessage>
                                        {errors.tanggal && errors.tanggal.message}
                                    </FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={errors.guruID != undefined}>
                                    <FormLabel htmlFor='guruID'>Pilih Guru</FormLabel>
                                    <Select bg={'white'} borderColor={'orange.300'} borderWidth={1} id='guruID' placeholder='Pilih...' {...register('guruID')}>
                                        {dataGuru && dataGuru.result.map((item, idx) => {
                                            return (
                                                <option key={idx} value={item.id}>{item.nama}</option>
                                            )
                                        })}
                                    </Select>
                                    <FormErrorMessage>
                                        {errors.guruID && "Harus di pilih"}
                                    </FormErrorMessage>
                                </FormControl>
                            </div>
                        </form>
                    </div>
                </DrawerForm>
            </>
        </AdminLayout>
    )
}

export default PengajuanLab

interface ActionValue {
    value: any,
    refetch: any,
    toast: any,
    status: any
}

const ActionTable = ({ value, refetch, toast, status }: ActionValue) => {
    const [delLoading, setDelLoading] = useState(false)
    const { onOpen, onClose, isOpen } = useDisclosure()
    const firstFieldRef = useRef(null)
    const { mutateAsync: deletePengajuan, isLoading: deleteLoading } = trpc.useMutation(['lab.delete'])
    const { mutateAsync: ubahStatus } = trpc.useMutation(['lab.updateStatusByID'])
    const { onOpen: onOpenDel, onClose: onCloseDel, isOpen: isOpenDel } = useDisclosure()
    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting, isDirty, isValid } } = useForm<updateStatusPengajuanSchema>({
        resolver: zodResolver(updateStatusPengajuanSchema),
        mode: "onChange"
    });

    const handleDeleteUser = useCallback(
        async (id: string) => {
            const delPengajuan = await deletePengajuan(id)
            if (delPengajuan.status === 200) {
                toast({
                    title: 'Hapus data berhasil',
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
                    title: 'Hapus data gagal',
                    status: 'error',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                })
                setDelLoading(false)
            }
        }, []
    )

    const handleUbahStatus = useCallback(
        async (status: string, id: string) => {
            const delPengajuan = await ubahStatus({
                id: id,
                status: status
            })
            if (delPengajuan.status === 200) {
                toast({
                    title: 'Ubah data berhasil',
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
                    title: 'Ubah data gagal',
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
            <Popover
                isOpen={isOpen}
                initialFocusRef={firstFieldRef}
                onOpen={() => {
                    setValue('status', status)
                    onOpen()
                }}
                onClose={onClose}
                placement='auto-start'
                closeOnBlur={false}
            >
                <PopoverTrigger>
                    <IconButton
                        // isLoading={delLoading}
                        variant='outline'
                        colorScheme='orange'
                        aria-label='edit status'
                        fontSize='20px'
                        onClick={async () => {
                            onOpen()
                        }}
                        icon={<IoPencil />}
                    />
                </PopoverTrigger>
                <PopoverContent p={5}>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <form onSubmit={handleSubmit((e) => handleUbahStatus(e.status, e.id))}>
                        <Input
                            // ref={firstFieldRef}
                            type={'hidden'}
                            bg={'white'} borderColor={'orange.300'} borderWidth={1}
                            id='id'
                            defaultValue={value}
                            placeholder='Edit nama kelas'
                            {...register('id')}
                        />
                        <FormControl isInvalid={errors.status != undefined}>
                            <FormLabel htmlFor='name'>Status</FormLabel>
                            <Select bg={'white'} borderColor={'orange.300'} borderWidth={1} id='status' placeholder='Pilih...' {...register('status')}>
                                <option value='Menunggu'>Menunggu</option>
                                <option value='Ditolak'>Ditolak</option>
                                <option value='Disetujui'>Disetujui</option>
                            </Select>
                            <FormErrorMessage>
                                {errors.status && "Harus dipilih"}
                            </FormErrorMessage>
                        </FormControl>
                        <Button disabled={!isValid} isLoading={isSubmitting} type='submit' fontWeight={600}
                            color={'white'}
                            bg={'orange.400'}
                            _hover={{
                                bg: 'orange.300',
                            }} mt={'10px'}>
                            Update
                        </Button>
                    </form>
                </PopoverContent>
            </Popover>
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
                await handleDeleteUser(value)
            }} onClose={onCloseDel} onOpen={onOpenDel} isLoading={delLoading} title={'Hapus pengajuan'} text={'Apa anda yakin ?'} />
        </Flex>
    )
}